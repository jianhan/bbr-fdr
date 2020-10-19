import { Link } from '../schemas/link.schema';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

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
}
