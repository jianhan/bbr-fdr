import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Link } from '../../common/dto/link';

export class CreateSeasonSummaryDto {

  @IsNumber()
  @IsNotEmpty()
  @Min(2000)
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
  lastSyncedAt: Date;

  @IsNotEmpty()
  rawHtml: string;
}
