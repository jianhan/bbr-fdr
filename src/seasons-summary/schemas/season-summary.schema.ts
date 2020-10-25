import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Link } from '../../common/schemas/link';
import { MAX_SUMMARY_YEAR, MIN_SUMMARY_YEAR } from '../constants';

export type SeasonSummaryDocument = SeasonSummary & Document;

@Schema({ collection: 'season-summaries', timestamps: true })
export class SeasonSummary {

  @Prop({ required: true, min: MIN_SUMMARY_YEAR, max: MAX_SUMMARY_YEAR })
  year: number;

  @Prop({ type: Link })
  leagueChampion: Link;

  @Prop({ type: Link })
  mostValuablePlayer: Link;

  @Prop({ type: Link })
  rookieOfTheYear: Link;

  @Prop({ type: Link })
  ppgLeader: Link;

  @Prop({ type: Link })
  rpgLeader: Link;

  @Prop({ type: Link })
  apgLeader: Link;

  @Prop({ type: Link })
  wsLeader: Link;

  @Prop({ type: Date, required: true })
  lastSyncedAt: Date;

  @Prop({ type: String, required: true })
  rawHtml: string;
}

export const SeasonSummarySchema = SchemaFactory.createForClass(SeasonSummary);
