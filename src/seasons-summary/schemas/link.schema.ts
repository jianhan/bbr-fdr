import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { isURL } from 'class-validator';

export class Link
{
  @Prop({ required: true })
  title: string;

  @Prop({validate: isURL})
  href: string;

  @Prop()
  data: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
