import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StandingRecord } from './standing-record';
import { MAX_SUMMARY_YEAR, MIN_SUMMARY_YEAR } from '../constants';

export enum StandingType {
  Conference = 'Conference',
  Division = 'Division',
}

export enum StandingRegion {
  East = 'East',
  West = 'West'
}

@Schema({ collection: 'season-summary-standings', timestamps: true })
export class SeasonSummaryStanding {

  @Prop({ required: true, min: MIN_SUMMARY_YEAR, max: MAX_SUMMARY_YEAR })
  year: number;

  @Prop({ required: true })
  type: StandingType;

  @Prop({ required: true })
  region: StandingRegion;

  @Prop({required: true, minlength: 1})
  records: StandingRecord[];

  @Prop({ type: Date, required: true })
  lastSyncedAt: Date;

  constructor(type: StandingType, region: StandingRegion) {
    this.type = type;
    this.region = region;
  }
}

export const SeasonSummaryStandingSchema = SchemaFactory.createForClass(SeasonSummaryStanding);
