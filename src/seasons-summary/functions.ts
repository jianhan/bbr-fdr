import { SeasonSummary } from './schemas/season-summary.schema';
import * as _ from 'lodash';
import { dateDiff } from '../common/functions';
import { CreateSeasonSummaryDto } from './dto/create-season-summary.dto';
import axios, { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';

export const canSyncSummaryByYear = (yearOfSummary: number, cacheDuration: number, seasonSummary?: SeasonSummary): boolean => {
  if (_.isEmpty(seasonSummary)) {
    return true;
  }

  const currentYear = new Date().getFullYear();
  if (currentYear !== yearOfSummary) {
    return false;
  }

  const hasLastSyncedAtProp = _.has(seasonSummary, 'lastSyncedAt');
  if (!hasLastSyncedAtProp) {
    return true;
  }

  return minutesSinceLastSynced(seasonSummary) > cacheDuration;
};
const minutesSinceLastSynced = (seasonSummary: SeasonSummary): number => dateDiff(seasonSummary.lastSyncedAt, new Date()).asMinutes();
export const generateSummaryURL = (domainURL: string, year: number): string => `${domainURL}/leagues/NBA_${year}.html`;
export const fetchSummaryHtml = (url: string): Observable<string> => from(axios.get(url).then((response: AxiosResponse) => response.data));
export const extractSummaryHtml = (html: string): CreateSeasonSummaryDto => {
  return new CreateSeasonSummaryDto();
};
