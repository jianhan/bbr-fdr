import { Link } from '../../common/schemas/link';
import { Prop, raw } from '@nestjs/mongoose';

export class PlayoffGame {

  @Prop({ required: true })
  game: Link;

  @Prop({ required: true })
  date: string;

  @Prop(raw({
    name: {type: String},
    score: {type: Number}
  }))
  homeTeam: Record<string, any>;

  @Prop(raw({
    name: {type: String},
    score: {type: Number}
  }))
  awayTeam: Record<string, any>;

}
