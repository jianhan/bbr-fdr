import { Link } from '../../common/schemas/link';
import { Prop } from '@nestjs/mongoose';

export class StandingRecord {

  @Prop()
  team: Link;

  @Prop({default: false})
  isPlayoffTeam: boolean;

  @Prop()
  rank: number | null;

  @Prop()
  wins: number;

  @Prop()
  losses: number;

  @Prop()
  winLossPercentage: number;

  @Prop()
  gamesBehind: number;

  @Prop()
  pointsPerGame: number;

  @Prop()
  opponentPointsPerGame?: number;

  @Prop()
  simpleRatingSystem: number;
}
