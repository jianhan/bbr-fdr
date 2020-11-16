import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameService } from './game.service';

@Module({
  imports: [
    ConfigModule
  ],
  providers: [GameService]
})
export class GameModule {}
