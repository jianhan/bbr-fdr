import * as S from 'sanctuary';
import { cheerioSelect, filterFunc, htmlToCheerioRoot, lengthNotEqualTo } from '../../common/functions';
import * as fp from 'lodash/fp';
import Cheerio = cheerio.Cheerio;
import Element = cheerio.Element;
import * as _ from 'lodash';
import * as moment from 'moment';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { game } from '../schemas/game';

export const getGameUrlByYear = (domainUrl: string, year: number) => `${domainUrl}/leagues/NBA_${year}_games.html`;

const generateMonthlyGameUrl = (year: number, month: string) => `/leagues/NBA_${year}_games-${month}.html`;

export const getAllValidMonthHrefsByYear = (year: number) => moment.months().map(m => generateMonthlyGameUrl(year, _.toLower(m)));

export const filterMonthHrefs = (validHrefs: string[], hrefs: string[]) => hrefs.filter(fp.curry(_.includes)(validHrefs));

export const extractMonthHrefs = (filterFunc: filterFunc) => S.pipe([
  cheerioSelect('div.filter'),
  S.ifElse(lengthNotEqualTo(1))(x => S.Left(new Error(`expected 1 div with class filter, found ${x.length}`)))(S.Right),
  S.map((filterDiv: Cheerio) => filterDiv.find('div > a').toArray().map((e: Element) => e.attribs['href'])),
  S.map(filterFunc),
  S.chain(S.ifElse(fp.isEmpty)(fp.constant(S.Left('empty hrefs, unable to proceed')))(S.Right)),
]);

// export const extractGamesByMonthHref = (href: string): Promise<game[]> => {
//
// };

const fetchByHref = (href: string) => axios.get(href).then();

// export const extractGamesFromHtml = (html: string): game[] => {
//   const $ = cheerio.load(html);
// };
const processTableRows = (c: Cheerio) => {
  const tdOrThs = c.children('tr').map((trIndex: number, trElement: Element) => {
    const children = trElement.children;
    if (children.length === 9) {
      // regular row
    }

    return null;
  });
  const ch = c.children('td, th').toArray().map((el: Element): game | null => {
    return null;
    if (_.has(el.attribs, 'data-stat')) {
      if (el.attribs['data-stat'] === 'date_game') {

      }
    }
  });
};

export const extractGamesFromHtml = S.pipe([
  htmlToCheerioRoot,
  cheerioSelect('#schedule > tbody'),
  processTableRows,
]);



