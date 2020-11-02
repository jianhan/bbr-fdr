import { Prop, raw } from '@nestjs/mongoose';
import { Link } from '../../common/schemas/link';

export class PlayoffSerie {

  @Prop({ required: true })
  name: string;

  @Prop(raw({
    teamName: {type: Link},
    score: {type: Number}
  }))
  firstTeam: Record<string, any>;

  @Prop(raw({
    teamName: {type: Link},
    score: {type: Number}
  }))
  secondTeam: Record<string, any>;

  @Prop({ required: true })
  status: Link;

  @Prop({ required: true })
  lastSyncedAt: Date;
}
