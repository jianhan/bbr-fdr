import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsFeederService } from './seasons-feeder.service';
import { getModelToken } from '@nestjs/mongoose';
import { SeasonSummary } from './schemas/season-summary.schema';
import { ConfigModule } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';


describe('SeasonsFeederService', () => {

  const mockedSeasonSummaryModel = (dto: any) => {
    this.data = dto;
    this.save = () => {
      return this.data;
    };
  };

  let service: SeasonsFeederService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonsFeederService,
        { provide: getModelToken(SeasonSummary.name), useValue: mockedSeasonSummaryModel },
        { provide: WINSTON_MODULE_PROVIDER, useValue: console },
      ],
      imports: [ConfigModule]
    }).compile();

    service = module.get<SeasonsFeederService>(SeasonsFeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
