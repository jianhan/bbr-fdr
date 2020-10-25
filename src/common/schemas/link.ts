import { Prop } from '@nestjs/mongoose';
import { isNotEmpty, isURL } from 'class-validator';

export class Link {
  @Prop({ required: true, default: '', validate: isNotEmpty })
  title: string;

  @Prop({ validate: isURL })
  href?: string;

  @Prop()
  data?: string;

  constructor(title: string, href: string, data = '') {
    this.title = title;
    this.href = href;
    if (data !== '') {
      this.data = data;
    }
  }

}
