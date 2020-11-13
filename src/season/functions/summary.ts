import { Link } from '../../common/schemas/link';
import { generateSummaryURL, headOrMax, notIn, stringInBrackets } from '../../common/functions';
import Root = cheerio.Root;
import configuration from '../../config/configuration';
import * as fp from 'lodash/fp';
import { RequestCacheService } from '../../common/request-cache.service';
import axios from 'axios';
import { RequestCacheMethod } from '../../common/schemas/request-cache.schema';
import { YearAndHtml } from '../types';
import { Model } from 'mongoose';
import * as cheerio from 'cheerio';
import { SummaryDocument } from '../schemas/summary.schema';

export const extractSummary = ($: Root, year: number): { [key: string]: string | Link | number } => {
  const returnVal = { year };

  [
    { attribute: 'leagueChampion', selector: 'League Champion' },
    { attribute: 'mostValuablePlayer', selector: 'Most Valuable Player' },
    { attribute: 'rookieOfTheYear', selector: 'Rookie of the Year' },
    { attribute: 'ppgLeader', selector: 'PPG Leader' },
    { attribute: 'rpgLeader', selector: 'RPG Leader' },
    { attribute: 'apgLeader', selector: 'APG Leader' },
    { attribute: 'wsLeader', selector: 'WS Leader' },
  ].forEach(v => {
    const segment = extractSegment($, v.selector);
    if (segment !== null) {
      returnVal[v.attribute] = segment;
    }
  });
  returnVal['lastSyncedAt'] = new Date();
  return returnVal;
};

export const extractSegment = ($: Root, selector: string): Link | null => {

  const element = $(`strong:contains('${selector}')`).next('a').first();
  if (element.length === 1) {
    const linkTitle = element.text();
    const linkHref = element.attr('href');
    return new Link(linkTitle, linkHref, stringInBrackets(element.parent().text()));
  }

  return null;
};

export const cacheDuration = (year: number) => year === new Date().getFullYear() ? configuration().currentSeasonCacheDurationInSeconds : configuration().pageCacheDurationInSeconds;

export const findYearToSync = (allYears: number[]) => fp.pipe(notIn(allYears), headOrMax(allYears));

export const fetchSummaryWithCache = (requestCache: RequestCacheService, httpRequestFunc, year: number): Promise<YearAndHtml> => requestCache.request(httpRequestFunc, generateSummaryURL(year), RequestCacheMethod.GET, fp.prop('data'), cacheDuration(year)).then(html => ({
  year,
  html,
}));

export const findOneSummaryAndUpdate = (summaryModel: Model<SummaryDocument>, yah: YearAndHtml) => summaryModel.findOneAndUpdate({ year: yah.year }, extractSummary(cheerio.load(yah.html), yah.year), {
  new: true,
  upsert: true,
});
