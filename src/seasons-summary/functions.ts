import { SeasonSummary } from './schemas/season-summary.schema';
import * as _ from 'lodash';
import { dateDiff, stringInBrackets } from '../common/functions';
import { CreateSeasonSummaryDto } from './dto/create-season-summary.dto';
import axios, { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import * as cheerio from 'cheerio';
import { Link } from '../common/dto/link';
import Cheerio = cheerio.Cheerio;
import Root = cheerio.Root;

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

export const extractSummaryHtml = (year: number, html: string): CreateSeasonSummaryDto => {
  const $ = cheerio.load(html);
  const createSeasonSummaryDto = new CreateSeasonSummaryDto();
  createSeasonSummaryDto.year = year;
  createSeasonSummaryDto.rawHtml = html;

  [
    {attribute: 'leagueChampion', selector: 'League Champion'},
    {attribute: 'mostValuablePlayer', selector: 'Most Valuable Player'},
    {attribute: 'rookieOfTheYear', selector: 'Rookie of the Year'},
    {attribute: 'ppgLeader', selector: 'PPG Leader'},
    {attribute: 'rpgLeader', selector: 'RPG Leader'},
    {attribute: 'apgLeader', selector: 'APG Leader'},
    {attribute: 'wsLeader', selector: 'WS Leader'},
  ].forEach(v => {
    const info = extractSummaryStrongInfo($,v.selector);
    if (info !== null) {
      createSeasonSummaryDto[v.attribute] = info;
    }
  });

  return createSeasonSummaryDto;
};

export const extractSummaryStrongInfo = ($: Root, selector: string): Link | null => {

  const element = $(`strong:contains('${selector}')`).next('a').first();
  if (element.length === 1) {
    const linkTitle = element.text();
    const linkHref = element.attr('href');
    const link = new Link(linkTitle, linkHref);
    const data = stringInBrackets(element.parent().text());
    if (data !== '') {
      link.data = data
    }
    return link;
  }

  return null;
}
