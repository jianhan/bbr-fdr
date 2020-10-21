import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import rxjs, { from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SeasonSummary, SeasonSummaryDocument, SeasonSummarySchema } from './schemas/season-summary.schema';
import { Model } from 'mongoose';
import { CreateSeasonSummaryDto } from './dto/create-season-summary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from '../common/dto/link';

@Injectable()
export class SeasonsSummaryService {

  constructor(
    @InjectModel(SeasonSummary.name) private seasonSummaryModel: Model<SeasonSummaryDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService
  ) { }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async createSummary(createSeasonSummaryDto: CreateSeasonSummaryDto): Promise<SeasonSummary> {
    const testDTO = new CreateSeasonSummaryDto();
    testDTO.year = 2019;
    testDTO.leagueChampion = new Link('test', '/test.com');
    const createdSeasonSummary = new this.seasonSummaryModel(testDTO);
    return createdSeasonSummary.save();
  }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // handleFetch(year: number = new Date().getFullYear()) {
  //   const domainURL = this.configService.get<string>('domainURL');
  //   const summaryURL = this.generateSummaryURL(domainURL, year);
  //
  //   // from(axios.get('https://asdfasasdfdasdfsdasfdfas.dasdasfa.dfas')).pipe(
  //   //   map(r => console.log(r)),
  //   //   catchError(err => of(`unable to process seasons with year ${year}: ${err}`))
  //   // );
  //
  //   this.logger.debug(`Called when the current second is ${summaryURL}`);
  // }

  private generateSummaryURL = (domainURL: string, year: number): string => `${domainURL}/leagues/NBA_${year}.html`

  // private async downloadHTML () {
  //
  // }
}
