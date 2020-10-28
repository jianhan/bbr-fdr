import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SeasonSummary, SeasonSummaryDocument } from './schemas/season-summary.schema';
import { Model } from 'mongoose';
import * as cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { canSyncSummaryByYear, fetchSummaryHtml, generateSeasonSummaryDto, generateSummaryURL } from './functions';
import { SeasonSummaryStanding, SeasonSummaryStandingDocument } from './schemas/season-summary-standing.schema';
import { RequestCacheService } from '../common/request-cache.service';
import * as fp from 'lodash/fp';
import { RequestCacheMethod } from '../common/schemas/request-cache.schema';
import { isEmpty } from 'class-validator';

@Injectable()
export class SeasonsSummaryService {

  constructor(
    @InjectModel(SeasonSummary.name) private seasonSummaryModel: Model<SeasonSummaryDocument>,
    @InjectModel(SeasonSummaryStanding.name) private seasonSummaryStandingModel: Model<SeasonSummaryStandingDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(RequestCacheService.name) private requestCache: RequestCacheService,
    private configService: ConfigService,
  ) {
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async syncSeasonSummaryStandings(year: number = new Date().getFullYear()): Promise<void> {
    return this.requestCache.request(axios.get, 'https://www.google.com', RequestCacheMethod.GET, ((response: AxiosResponse) => response.data))
    // axios.get()
    // const tt = (a, b) => a + b;
    // const t1 = fp.curry(tt)(1)(2);
    // console.log(t1())
    // console.log(this.requestCache, "***")
  }

  syncSeasonSummaries(year: number = new Date().getFullYear()): Observable<string> {
    return from(this.seasonSummaryModel.findOne({ year }).exec()).pipe(
      mergeMap((seasonSummary: SeasonSummary) => {
        const cacheDuration = this.configService.get<number>('CURRENT_SEASONS_SUMMARY_CACHE_DURATION');

        if (canSyncSummaryByYear(year, cacheDuration, seasonSummary)) {
          const domainURL = this.configService.get<string>('domainURL');
          const summaryURL = generateSummaryURL(domainURL, year);

          return fetchSummaryHtml(summaryURL).pipe(
            map(html => cheerio.load(html)),
            map($ => generateSeasonSummaryDto($, year)),
            mergeMap(dto => new this.seasonSummaryModel(dto).save()),
            map((document: SeasonSummaryDocument) => `syncing successful for season ${document.year} summary`),
          );
        }

        return of('unable to sync at the moment');
      }),
    );

  }
}
