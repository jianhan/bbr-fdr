import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import configuration from '../../config/configuration';
import { Document } from 'mongoose';
import { game } from './game';

type GamesDocument = Games & Document;

@Schema({ collection: 'games', timestamps: true })
class Games {

  @Prop({ required: true, min: configuration()['minSeasonYear'], max: configuration()['maxSeasonYear'] })
  year: number;

  @Prop()
  regularSeasonGames: game[];

  @Prop()
  playOffGames: game[];

  @Prop({ type: Date, required: true, default: new Date() })
  lastSyncedAt: Date;
}

const GamesSchema = SchemaFactory.createForClass(Games);
GamesSchema.index({ year: -1 }, { unique: true });

export { GamesDocument, Games, GamesSchema };
