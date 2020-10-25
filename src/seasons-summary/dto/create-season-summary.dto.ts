import { IsDate, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Link } from '../../common/dto/link';
import { MAX_SUMMARY_YEAR, MIN_SUMMARY_YEAR } from '../constants';

export class CreateSeasonSummaryDto {

  @IsNumber()
  @IsNotEmpty()
  @Min(MIN_SUMMARY_YEAR)
  @Max(MAX_SUMMARY_YEAR)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  leagueChampion: Link;

  @IsOptional()
  mostValuablePlayer: Link;

  @IsOptional()
  rookieOfTheYear: Link;

  @IsOptional()
  ppgLeader: Link;

  @IsOptional()
  rpgLeader: Link;

  @IsOptional()
  apgLeader: Link;

  @IsOptional()
  wsLeader: Link;

  @IsNotEmpty()
  @IsDate()
  lastSyncedAt: Date = new Date();

  @IsNotEmpty()
  rawHtml: string;
}
