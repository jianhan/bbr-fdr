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
import { extractYears, generateSummaryURL, headOrMax, notIn, range } from '../common/functions';
import { RequestCacheMethod } from '../common/schemas/request-cache.schema';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  cacheDuration,
  extractSummary,
  fetchSummaryWithCache,
  findOneSummaryAndUpdate,
  findYearToSync,
} from './functions/summary';
import { extractStandings, findOneStandingAndUpdate } from './functions/standing';

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

  private allYears = (): number[] => range(this.configService.get<number>('minSeasonYear'), this.configService.get<number>('maxSeasonYear'));

  async syncCacheWrapper<T>(findOneAndUpdateFunc): Promise<T>  {
    const allYears = this.allYears();
    const fetchSummary = fp.curry(fetchSummaryWithCache)(this.requestCache);

    return this.standingModel.find()
      .sort({ year: 1 })
      .exec()
      .then(findYearToSync(allYears))
      .then(fetchSummary)
      .then(findOneAndUpdateFunc)
  }

  async syncStandings(): Promise<string> {
      return this.syncCacheWrapper<Standing>(fp.curry(findOneStandingAndUpdate)(this.standingModel)).then((r: Standing) => `successfully synced standing for summary of year ${r.year}`);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async syncSummaries(): Promise<string> {
    return this.syncCacheWrapper<Standing>(fp.curry(findOneSummaryAndUpdate)(this.summaryModel)).then((r: Standing) => `successfully synced summary of year ${r.year}`);
  }
}
