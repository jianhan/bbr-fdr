
import { Module } from '@nestjs/common';
import { SeasonsFeederController } from './seasons-feeder.controller';
import { SeasonsFeederService } from './seasons-feeder.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeasonSummary, SeasonSummarySchema } from './schemas/season-summary.schema';

@Module({
    imports: [
      ConfigModule,
      MongooseModule.forFeature([{name: SeasonSummary.name, schema: SeasonSummarySchema}])
    ],
    controllers: [SeasonsFeederController],
    providers: [SeasonsFeederService]
})
export class SeasonsFeederModule { }
