import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsFeederController } from './seasons-feeder.controller';

describe('SeasonsFeederController', () => {
  let controller: SeasonsFeederController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeasonsFeederController],
    }).compile();

    controller = module.get<SeasonsFeederController>(SeasonsFeederController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
