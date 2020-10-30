import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { SeasonSummary, SeasonSummaryDocument } from './schemas/season-summary.schema';
import { Model } from 'mongoose';
import * as cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { canSyncSummaryByYear, generateSeasonSummaryDto, generateSummaryURL } from './functions';
import { SeasonSummaryStanding, SeasonSummaryStandingDocument } from './schemas/season-summary-standing.schema';
import { RequestCacheService } from '../common/request-cache.service';
import { RequestCacheMethod } from '../common/schemas/request-cache.schema';
import * as fp from 'lodash/fp';
import * as _ from 'lodash';

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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncSeasonSummaries(): Promise<string> {
    const existingSeasonSummary = await this.seasonSummaryModel.find({}).exec();
    const existingYears = existingSeasonSummary.map(fp.prop('year'))

    const maxSeasonYear = this.configService.get<number>('maxSeasonYear');
    let minSeasonYear = this.configService.get<number>('minSeasonYear');

    const allYears = [];
    while (minSeasonYear <= maxSeasonYear) {
      allYears.push(minSeasonYear);
      minSeasonYear++;
    }

    const year = allYears.filter(v => !_.includes(existingYears, v)).pop();
    if (year === undefined) {
      return 'nothing to sync'
    }

    console.log('start syncing year')

    return this.seasonSummaryModel.findOne({ year }).exec().then((seasonSummary: SeasonSummary) => {
      const cacheDuration = this.configService.get<number>('CURRENT_SEASONS_SUMMARY_CACHE_DURATION');
      if (canSyncSummaryByYear(year, cacheDuration, seasonSummary)) {
        const domainURL = this.configService.get<string>('domainURL');
        const summaryURL = generateSummaryURL(domainURL, year);

        return this.requestCache.request(
          axios.get,
          summaryURL,
          RequestCacheMethod.GET,
          (response: AxiosResponse) => response.data,
          60 * 60 * 24).then((html: string) => {
          const $ = cheerio.load(html);
          const dto = generateSeasonSummaryDto($, year);
          return new this.seasonSummaryModel(dto).save();
        }).then((document: SeasonSummaryDocument) => `syncing successful for season ${document.year} summary`);
      }

      return 'unable to sync at the moment';
    });
  }

}
