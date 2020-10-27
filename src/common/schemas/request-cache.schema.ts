import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { isDate, isEmpty, isURL } from 'class-validator';

type RequestCacheDocument = RequestCache & Document;

enum RequestCacheMethod {
  GET = 'GET',
  POST = 'POST'
}

@Schema({ collection: 'request-caches' })
export class RequestCache {

  @Prop({ required: true, validate: isURL })
  url: string;

  @Prop({ required: true })
  method: RequestCacheMethod;

  @Prop({ required: true, validate: isDate, default: new Date() })
  cachedAt: Date;

  @Prop({ required: true })
  response: string;

  @Prop({ default: null })
  expiredAt?: Date;
}

const RequestCacheSchema = SchemaFactory.createForClass(RequestCache);
RequestCacheSchema.index({ url: 1, method: 1 }, { unique: true });

export { RequestCacheDocument, RequestCacheMethod, RequestCacheSchema };
