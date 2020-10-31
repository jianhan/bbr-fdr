import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Link } from '../../common/schemas/link';
import configuration from '../../config/configuration';

type SummaryDocument = Summary & Document;

@Schema({ collection: 'summaries', timestamps: true })
class Summary {

  @Prop({ required: true, min: configuration()['minSeasonYear'], max: configuration()['maxSeasonYear'] })
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
}

const SummarySchema = SchemaFactory.createForClass(Summary);
SummarySchema.index({ year: 1 }, { unique: true });

export { SummaryDocument, Summary, SummarySchema };
