import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeasonSummary, SeasonSummarySchema } from './schemas/season-summary.schema';
import { SeasonsSummaryController } from './seasons-summary.controller';
import { SeasonsSummaryService } from './seasons-summary.service';
import { SeasonSummaryStanding, SeasonSummaryStandingSchema } from './schemas/season-summary-standing.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{
      name: SeasonSummary.name,
      schema: SeasonSummarySchema,
    }, { name: SeasonSummaryStanding.name, schema: SeasonSummaryStandingSchema }]),
  ],
  controllers: [SeasonsSummaryController],
  providers: [SeasonsSummaryService],
})
export class SeasonsSummaryModule {
}
