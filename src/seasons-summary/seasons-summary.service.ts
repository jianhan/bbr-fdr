import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SeasonSummary, SeasonSummaryDocument } from './schemas/season-summary.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { canSyncSummaryByYear, extractSummaryHtml, fetchSummaryHtml, generateSummaryURL } from './functions';

@Injectable()
export class SeasonsSummaryService {

  constructor(
    @InjectModel(SeasonSummary.name) private seasonSummaryModel: Model<SeasonSummaryDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async syncByYear(year: number = new Date().getFullYear()): Promise<void> {
    from(this.seasonSummaryModel.findOne({ year: 2019 }).exec()).pipe(
      mergeMap((seasonSummary: SeasonSummary) => {
        const cacheDuration = this.configService.get<number>('CURRENT_SEASONS_SUMMARY_CACHE_DURATION');
        if (canSyncSummaryByYear(year, cacheDuration, seasonSummary)) {
          const domainURL = this.configService.get<string>('domainURL');
          const summaryURL = generateSummaryURL(domainURL, year);
          return fetchSummaryHtml(summaryURL).pipe(map(extractSummaryHtml));
        }
        return of('no data');
      }),
    ).subscribe(v => console.log(v));
    if (year === moment().year()) {
      this.logger.debug(this.configService.get<number>('CURRENT_SEASONS_SUMMARY_CACHE_DURATION'));
    }
  }
}
