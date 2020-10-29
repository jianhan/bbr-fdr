import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestCache, RequestCacheDocument, RequestCacheMethod } from './schemas/request-cache.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class RequestCacheService {

  constructor(@InjectModel(RequestCache.name) private requestCacheModel: Model<RequestCacheDocument>) {
  }

  async request(func, url: string, method: RequestCacheMethod, extractor, cacheInSeconds = 0): Promise<string> {
    return this.requestCacheModel.findOne({
      url,
      method,
      $or: [{ expiredAt: null }, { expiredAt: { $gt: new Date() } }],
    }).exec().then((document: RequestCacheDocument) => {
      if (document !== null) {
        return document.response;
      }

      return func(url).then(r => {
        return this.requestCacheModel.findOneAndUpdate({
            url,
            method,
          },
          {
            expiredAt: moment().add(cacheInSeconds, 'seconds').toDate(),
            response: extractor(r),
            cachedAt: new Date(),
          }, { new: true, upsert: true }).then(extractor);
      });
    });
  }

}
