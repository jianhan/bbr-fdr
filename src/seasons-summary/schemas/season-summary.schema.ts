import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Link } from '../../common/schemas/link';
import { MAX_SUMMARY_YEAR, MIN_SUMMARY_YEAR } from '../constants';

type SeasonSummaryDocument = SeasonSummary & Document;

@Schema({ collection: 'season-summaries', timestamps: true })
class SeasonSummary {

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

const SeasonSummarySchema = SchemaFactory.createForClass(SeasonSummary);
SeasonSummarySchema.index({ year: 1 }, { unique: true });

export {SeasonSummaryDocument, SeasonSummary, SeasonSummarySchema}

