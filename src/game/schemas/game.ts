import { Link } from '../../common/schemas/link';
import { Prop } from '@nestjs/mongoose';

export class game {

  @Prop({ required: true })
  date: Link;

  @Prop({ required: true })
  visitor: Link;

  @Prop({ required: true })
  visitorPoints: number;

  @Prop({ required: true })
  home: Link;

  @Prop({ required: true })
  homePoints: number;

  @Prop({ required: true })
  attend: number;

  @Prop({ required: true, default: false })
  overtime: boolean
}
