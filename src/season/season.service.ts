import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RequestCacheService } from '../common/request-cache.service';
import { ConfigService } from '@nestjs/config';
import { Summary, SummaryDocument } from './schemas/summary.schema';
import { Standing, StandingDocument } from './schemas/standing.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fp from 'lodash/fp';
import { extractYears, generateSummaryURL, range } from '../common/functions';
import { fetchSummaryWithCache, findOneSummaryAndUpdate, findYearToSync } from './functions/summary';
import { findOneStandingAndUpdate } from './functions/standing';
import { fetchPlayoffHtml } from './functions/playoff';
import { RequestCacheMethod } from '../common/schemas/request-cache.schema';
import * as fs from 'fs';

@Injectable()
export class SeasonService {

  constructor(
    @InjectModel(Summary.name) private summaryModel: Model<SummaryDocument>,
    @InjectModel(Standing.name) private standingModel: Model<StandingDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(RequestCacheService.name) private requestCache: RequestCacheService,
    private configService: ConfigService,
  ) {
  }

  async syncCacheWrapper<T>(queryResults: Promise<T[]>, findOneAndUpdateFunc): Promise<T> {
    const allYears = this.allYears();
    const fetchSummary = fp.curry(fetchSummaryWithCache)(this.requestCache);

    return queryResults
      .then(extractYears)
      .then(findYearToSync(allYears))
      .then(fetchSummary)
      .then(findOneAndUpdateFunc);
  }

  async syncStandings(): Promise<string> {
    return this.syncCacheWrapper<Standing>(
      this.standingModel.find().sort({ year: 1 }).exec(),
      fp.curry(findOneStandingAndUpdate)(this.standingModel),
    ).then((r: Standing) => `successfully synced standing for summary of year ${r.year}`);
  }

  async syncSummaries(): Promise<string> {
    return this.syncCacheWrapper<Summary>(
      this.summaryModel.find().sort({ year: 1 }).exec(),
      fp.curry(findOneSummaryAndUpdate)(this.summaryModel),
    ).then((r: Summary) => `successfully synced summary of year ${r.year}`);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async syncPlayoffSeries(): Promise<string> {
    const url = generateSummaryURL(2000);
    const html = await this.requestCache.request(fetchPlayoffHtml, url, RequestCacheMethod.GET, fp.identity, 10);
    fs.writeFileSync('/tmp/playoff_2000.html', html);
    console.log("******")
    return html;
  }

  private allYears = (): number[] => range(this.configService.get<number>('minSeasonYear'), this.configService.get<number>('maxSeasonYear'));
}
