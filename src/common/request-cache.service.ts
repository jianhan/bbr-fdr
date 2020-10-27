import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestCache, RequestCacheDocument, RequestCacheMethod } from './schemas/request-cache.schema';
import { Model } from 'mongoose';

@Injectable()
export class RequestCacheService {

  constructor(@InjectModel(RequestCache.name) private requestCacheModel: Model<RequestCacheDocument>) {
  }

  request(func, url: string, method: RequestCacheMethod, extractor) {
    return this.requestCacheModel.findOne({
      url,
      method,
      $or: [{ expiredAt: null }, { expiredAt: { $gt: new Date() } }],
    }).exec().then((document: RequestCacheDocument) => {
      if (document !== null) {
        return extractor(document.response);
      }

      return func(url).then(r => {
        return new this.requestCacheModel({
          url,
          method,
          response: extractor(r),
        }).save().then(extractor);
      });
    });

  }

}
