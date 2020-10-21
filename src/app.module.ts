import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { WinstonModule } from 'nest-winston';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeasonsSummaryModule } from './seasons-summary/seasons-summary.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      // options
    }),
    MongooseModule.forRoot('mongodb://root:password@172.19.0.2/bbr-fdr'),
    SeasonsSummaryModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['env.production', 'env.staging', '.env.dev', '.env.local'],
      validationSchema: Joi.object({
        NATS_HOST: Joi.string().default('localhost'),
        NATS_PORT: Joi.number().default(4222),
      }),
      isGlobal: true,
    }),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
