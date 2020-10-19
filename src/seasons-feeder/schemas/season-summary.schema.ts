import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Link, LinkSchema } from './link.schema';

export type SeasonSummaryDocument = SeasonSummary & Document;

@Schema({ collection: 'season-summaries' })
export class SeasonSummary {

  @Prop({ required: true, min: 2000, max: (new Date()).getFullYear() })
  year: number;

  @Prop({type: LinkSchema})
  leagueChampion: Link;

  // League Champion: Toronto Raptors
  //
  // Most Valuable Player: Giannis Antetokounmpo (27.7/12.5/5.9)
  //
  // Rookie of the Year: Luka Dončić (21.2/7.8/6.0)
  //
  // PPG Leader: James Harden (36.1)
  //
  // RPG Leader: Andre Drummond (15.6)
  //
  // APG Leader: Russell Westbrook (10.7)
  //
  // WS Leader: James Harden (15.2)
}

export const SeasonSummarySchema = SchemaFactory.createForClass(SeasonSummary);
