import { Prop, raw } from '@nestjs/mongoose';
import { Link } from '../../common/schemas/link';
import { PlayoffGame } from './playoff-game';

export class PlayoffSerie {

  @Prop({ required: true })
  name: string;

  @Prop(raw({
    name: {type: Link},
    score: {type: Number}
  }))
  winTeam: Record<string, any>;

  @Prop(raw({
    name: {type: Link},
    score: {type: Number}
  }))
  loseTeam: Record<string, any>;

  @Prop({ required: true })
  status: Link;

  @Prop({required: true})
  games: PlayoffGame[];

  @Prop({ required: true })
  lastSyncedAt: Date;
}
