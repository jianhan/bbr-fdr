import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestCache, RequestCacheDocument, RequestCacheMethod } from './schemas/request-cache.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';
import * as fp from 'lodash/fp';
import configuration from '../config/configuration';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RequestCacheService {

  constructor(
    @InjectModel(RequestCache.name) private requestCacheModel: Model<RequestCacheDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
  }

  async request(func, url: string, method: RequestCacheMethod, extractor, cacheInSeconds = configuration().pageCacheDurationInSeconds): Promise<string> {
    return this.requestCacheModel.findOne({
      url,
      method,
      $or: [{ expiredAt: null }, { expiredAt: { $gt: new Date() } }],
    }).exec().then((document: RequestCacheDocument) => {
      this.logger.debug(`request func called with url: ${url}, cached document is [${document}]`);
      if (document !== null) {
        this.logger.debug(`cached response for url: ${url} has been found and returned`);
        return document.response;
      }
      this.logger.debug(`start fetching url: ${url}`);
      return func(url).then(r => {
        this.logger.debug(`end fetching url: ${url}`);
        return this.requestCacheModel.findOneAndUpdate({
            url,
            method,
          },
          {
            expiredAt: moment().add(cacheInSeconds, 'seconds').toDate(),
            response: extractor(r),
            cachedAt: new Date(),
          }, { new: true, upsert: true }).then(fp.prop('response'));
      });
    });
  }

}
