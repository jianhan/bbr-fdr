import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // TODO: fix: create a dummy app to get configurations only
  const configApp = await NestFactory.create(AppModule);
  const configService = configApp.get(ConfigService);

  // create app
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        url:  `nats://${configService.get<string>('NATS_HOST')}:${configService.get<number>('NATS_PORT')}`
      }
    },
  );

  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
