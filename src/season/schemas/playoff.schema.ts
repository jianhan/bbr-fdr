import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import configuration from '../../config/configuration';
import { Document } from 'mongoose';
import { PlayoffSerie } from './playoff-serie';

type PlayoffDocument = Playoff & Document;

@Schema({ collection: 'playoffs', timestamps: true })
class Playoff {

  @Prop({ required: true, min: configuration()['minSeasonYear'], max: configuration()['maxSeasonYear'] })
  year: number;

  @Prop({ type: Date, required: true })
  lastSyncedAt: Date;

  @Prop()
  series: PlayoffSerie[]
}

const PlayoffSchema = SchemaFactory.createForClass(Playoff);
PlayoffSchema.index({ year: -1 }, { unique: true });

export { PlayoffDocument, Playoff, PlayoffSchema };
