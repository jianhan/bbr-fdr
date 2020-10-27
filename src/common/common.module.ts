import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestCache, RequestCacheSchema } from './schemas/request-cache.schema';
import { RequestCacheService } from './request-cache.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: RequestCache.name, schema: RequestCacheSchema }])],
  providers: [RequestCacheService],
  exports: [RequestCacheService]
})
export class CommonModule {
}
