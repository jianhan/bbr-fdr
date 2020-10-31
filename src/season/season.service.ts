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
import { generateSummaryURL, headOrMax, range } from '../common/functions';
import { RequestCacheMethod } from '../common/schemas/request-cache.schema';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { cacheDuration, extractSummary } from './functions/summary';

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

  @Cron(CronExpression.EVERY_5_SECONDS)
  async syncSummary(): Promise<string> {
    const allYears = range(this.configService.get<number>('minSeasonYear'), this.configService.get<number>('maxSeasonYear'));
    return this.summaryModel.find()
      .sort({ year: 1 })
      .exec()
      .then(fp.map(fp.prop('year')))
      .then(fp.curry(fp.difference)(allYears))
      .then(headOrMax(allYears))
      .then((year: number) => this.requestCache.request(
        axios.get,
        generateSummaryURL(year),
        RequestCacheMethod.GET,
        fp.prop('data'),
        cacheDuration(year)).then((html: string) => this.summaryModel.findOneAndUpdate({ year }, extractSummary(cheerio.load(html), year), { new: true, upsert: true })
      ))
      .then((r: Summary) => `successfully synced summary year ${r.year}`);
  }
}
