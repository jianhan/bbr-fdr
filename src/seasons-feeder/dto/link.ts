import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class Link {

  @IsNotEmpty({message: 'link title should not be empty'})
  title: string;

  @IsUrl({}, {message: 'link href should be a valid url'})
  href: string;

  @IsOptional()
  data: string;

  constructor(title: string, href: string, data = '') {
    this.title = title;
    this.href = href;
    this.data = data;
  }
}
