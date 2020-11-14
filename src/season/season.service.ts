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
import { extractYears, generateSummaryURL, range, simpleAxiosRequest } from '../common/functions';
import { fetchSummaryWithCache, findOneSummaryAndUpdate, findYearToSync } from './functions/summary';
import { findOneStandingAndUpdate } from './functions/standing';
import { extractPlayoff, fetchPlayoffHtml, findOnePlayoffAndUpdate } from './functions/playoff';
import { RequestCacheMethod } from '../common/schemas/request-cache.schema';
import * as cheerio from 'cheerio';
import { Playoff, PlayoffDocument } from './schemas/playoff.schema';
import axios from 'axios';

@Injectable()
export class SeasonService {

  constructor(
    @InjectModel(Summary.name) private summaryModel: Model<SummaryDocument>,
    @InjectModel(Standing.name) private standingModel: Model<StandingDocument>,
    @InjectModel(Playoff.name) private playoffModel: Model<PlayoffDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(RequestCacheService.name) private requestCache: RequestCacheService,
    private configService: ConfigService,
  ) {
  }

  async syncCacheWrapper<T>(queryResults: Promise<T[]>, findOneAndUpdateFunc, httpRequestFunc = fetchPlayoffHtml): Promise<T> {
    const allYears = this.allYears();
    const fetchSummary = fp.curry(fetchSummaryWithCache)(this.requestCache)(httpRequestFunc);

    return queryResults
      .then(extractYears)
      .then(findYearToSync(allYears))
      .then(fetchSummary)
      .then(findOneAndUpdateFunc);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async syncStandings(): Promise<string> {
    return this.syncCacheWrapper<Standing>(
      this.standingModel.find().sort({ year: 1 }).exec(),
      fp.curry(findOneStandingAndUpdate)(this.standingModel),
    ).then((r: Standing) => `successfully synced standing for summary of year ${r.year}`);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncSummaries(): Promise<string> {
    return this.syncCacheWrapper<Summary>(
      this.summaryModel.find().sort({ year: 1 }).exec(),
      fp.curry(findOneSummaryAndUpdate)(this.summaryModel),
    ).then((r: Summary) => `successfully synced summary of year ${r.year}`);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async syncPlayoffSeries(): Promise<string> {
    return this.syncCacheWrapper<Playoff>(
      this.playoffModel.find().sort({ year: 1 }).exec(),
      fp.curry(findOnePlayoffAndUpdate)(this.playoffModel),
    ).then((r: Playoff) => `successfully synced playoff for year ${r.year}`);
  }

  private allYears = (): number[] => range(this.configService.get<number>('minSeasonYear'), this.configService.get<number>('maxSeasonYear'));
}
