import { SeasonSummary } from './schemas/season-summary.schema';
import * as _ from 'lodash';
import { dateDiff, stringInBrackets } from '../common/functions';
import { CreateSeasonSummaryDto } from './dto/create-season-summary.dto';
import axios, { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import * as cheerio from 'cheerio';
import { Link } from '../common/schemas/link';
import { StandingRecord } from './schemas/standing-record';
import Root = cheerio.Root;
import {
  SeasonSummaryStanding,
  StandingRegion,
  StandingType,
} from './schemas/season-summary-standing.schema';

/**
 * canSyncSummaryByYear checks if summary can be synced.
 *
 * @param yearOfSummary
 * @param cacheDuration
 * @param seasonSummary
 */
export const canSyncSummaryByYear = (yearOfSummary: number, cacheDuration: number, seasonSummary?: SeasonSummary): boolean => {
  if (_.isEmpty(seasonSummary)) {
    return true;
  }

  const currentYear = new Date().getFullYear();
  if (currentYear !== yearOfSummary) {
    return false;
  }

  return minutesSinceLastSynced(seasonSummary) > cacheDuration;
};

/**
 * minutesSinceLastSynced get date diff between current summary and an given date.
 *
 * @param seasonSummary
 * @param dateToCompare
 */
const minutesSinceLastSynced = (seasonSummary: SeasonSummary, dateToCompare: Date = new Date()): number => dateDiff(seasonSummary.lastSyncedAt, dateToCompare).asMinutes();

/**
 * generateSummaryURL generates summary url.
 *
 * @param domainURL
 * @param year
 */
export const generateSummaryURL = (domainURL: string, year: number): string => `${domainURL}/leagues/NBA_${year}.html`;

/**
 *fetchSummaryHtml fetches summary.
 *
 * @param url
 */
export const fetchSummaryHtml = (url: string): Observable<string> => from(axios.get(url).then((response: AxiosResponse) => response.data));

export const generateSeasonSummaryDto = ($: Root, year: number): CreateSeasonSummaryDto => {
  const html = $.html();
  const createSeasonSummaryDto = new CreateSeasonSummaryDto();
  createSeasonSummaryDto.year = year;
  createSeasonSummaryDto.rawHtml = html;

  [
    { attribute: 'leagueChampion', selector: 'League Champion' },
    { attribute: 'mostValuablePlayer', selector: 'Most Valuable Player' },
    { attribute: 'rookieOfTheYear', selector: 'Rookie of the Year' },
    { attribute: 'ppgLeader', selector: 'PPG Leader' },
    { attribute: 'rpgLeader', selector: 'RPG Leader' },
    { attribute: 'apgLeader', selector: 'APG Leader' },
    { attribute: 'wsLeader', selector: 'WS Leader' },
  ].forEach(v => {
    const info = extractSummaryInfo($, v.selector);
    if (info !== null) {
      createSeasonSummaryDto[v.attribute] = info;
    }
  });

  return createSeasonSummaryDto;
};

export const extractSummaryInfo = ($: Root, selector: string): Link | null => {

  const element = $(`strong:contains('${selector}')`).next('a').first();
  if (element.length === 1) {
    const linkTitle = element.text();
    const linkHref = element.attr('href');
    return new Link(linkTitle, linkHref, stringInBrackets(element.parent().text()));
  }

  return null;
};

export const extractStandings = ($: Root, selector: string, type: StandingType, region: StandingRegion) => {
  const standing = new SeasonSummaryStanding(type, region);
  standing.records = $(`#${selector}`).toArray().map(trEl => {
    const standingRecord = new StandingRecord();
    $(trEl).children().toArray().forEach(tdEl => {
      const dataStat = $(tdEl).attr('data-stat');
      const tdText = $(tdEl).text();

      switch (dataStat) {
        case 'team_name': {
          const teamNameLink = $(tdEl).children('a').first();
          if (teamNameLink.length === 1) {
            standingRecord.isPlayoffTeam = _.includes(tdText, '*');
            standingRecord.team = new Link(teamNameLink.text(), teamNameLink.attr('href'));
          }
          break;
        }
        case 'wins': {
          standingRecord.wins = parseInt(tdText, 10);
          break;
        }
        case 'losses': {
          standingRecord.losses = parseInt(tdText, 10);
          break;
        }
        case 'win_loss_pct': {
          standingRecord.winLossPercentage = parseFloat(tdText);
          break;
        }
        case 'gb': {
          standingRecord.gamesBehind = parseInt(tdText, 10);
          break;
        }
        case 'pts_per_g': {
          standingRecord.pointsPerGame = parseFloat(tdText);
          break;
        }
        case 'opp_pts_per_g': {
          standingRecord.opponentPointsPerGame = parseFloat(tdText);
          break;
        }
        case 'srs': {
          standingRecord.simpleRatingSystem = parseFloat(tdText);
          break;
        }
      }
    });

    return standingRecord;
  });
  standing.lastSyncedAt = new Date();
  return standing;
};
