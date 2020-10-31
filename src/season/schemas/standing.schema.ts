import { StandingRecord } from './standing-record';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import configuration from '../../config/configuration';
import { Document } from 'mongoose';

type StandingDocument = Standing & Document;

@Schema({ collection: 'standings', timestamps: true })
class Standing {

  @Prop({ required: true, min: configuration()['minSeasonYear'], max: configuration()['maxSeasonYear'] })
  year: number;

  @Prop(raw({
    easternConference: { type: Array },
    westernConference: { type: Array },
  }))
  conferenceStandings?: Record<string, StandingRecord[]>;

  @Prop(raw({
    easternConference: { type: Array },
    westernConference: { type: Array },
  }))
  divisionStandings: Record<string, StandingRecord[]>;

  @Prop({ type: Date, required: true, default: new Date() })
  lastSyncedAt: Date;
}

const StandingSchema = SchemaFactory.createForClass(Standing);
StandingSchema.index({ year: -1 }, { unique: true });

export { StandingDocument, Standing, StandingSchema };
