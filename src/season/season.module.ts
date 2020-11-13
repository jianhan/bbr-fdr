import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Summary, SummarySchema } from './schemas/summary.schema';
import { Standing, StandingSchema } from './schemas/standing.schema';
import { Playoff, PlayoffSchema } from './schemas/playoff.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{
        name: Summary.name,
        schema: SummarySchema,
      }, {
        name: Standing.name,
        schema: StandingSchema,
      }, {
        name: Playoff.name,
        schema: PlayoffSchema,
      },
      ],
    ),
  ],
  controllers: [],
  providers: [SeasonService],
})
export class SeasonModule {
}
