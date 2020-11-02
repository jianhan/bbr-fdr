import { Link } from '../../common/schemas/link';
import { Prop } from '@nestjs/mongoose';

export class PlayoffGame {

  @Prop({ required: true })
  game: Link;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  homeTeam: string;

  @Prop({ required: true })
  awayTeam: string;

  @Prop({ required: true })
  homeTeamPoints: number;

  @Prop({ required: true })
  awayTeamPoints: number;

}
