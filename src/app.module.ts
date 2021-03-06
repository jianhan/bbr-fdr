import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { WinstonModule } from 'nest-winston';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeasonModule } from './season/season.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      // options
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['env.production', 'env.staging', '.env.dev', '.env.local'],
      validationSchema: Joi.object({
        // NATS
        NATS_HOST: Joi.string().default('localhost'),
        NATS_PORT: Joi.number().default(4222),

        // MONGODB
        MONGODB_USERNAME: Joi.string().default('root'),
        MONGODB_PASSWORD: Joi.string().default('password'),
        MONGODB_HOST: Joi.string().default('localhost'),
        MONGODB_PORT: Joi.number().default(27017),
        MONGODB_DATABASE: Joi.string().default('bbr-fdr'),

        // application level configurations
        CURRENT_SEASONS_SUMMARY_CACHE_DURATION: Joi.number().default(10),

      }),
      isGlobal: true,
    }),
    CommonModule,
    MongooseModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const username = configService.get<string>('MONGODB_USERNAME');
          const password = configService.get<string>('MONGODB_PASSWORD');
          const host = configService.get<number>('MONGODB_HOST');
          const port = configService.get<number>('MONGODB_PORT');
          const database = configService.get<string>('MONGODB_DATABASE');
          return {
            uri: `mongodb://${username}:${password}@${host}:${port}/${database}`,
            useFindAndModify: true
          };
        },
        inject: [ConfigService],
      },
    ),
    SeasonModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}
