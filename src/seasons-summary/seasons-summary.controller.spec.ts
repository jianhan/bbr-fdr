import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsSummaryController } from './seasons-summary.controller';

describe('SeasonsFeederController', () => {
  let controller: SeasonsSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeasonsSummaryController],
    }).compile();

    controller = module.get<SeasonsSummaryController>(SeasonsSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
