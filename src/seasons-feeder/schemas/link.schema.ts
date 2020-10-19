import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isURL } from 'class-validator';

@Schema()
export class Link
{
  @Prop({ required: true })
  title: string;

  @Prop({validate: isURL})
  url: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
