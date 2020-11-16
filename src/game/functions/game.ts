import * as S from 'sanctuary';
import { cheerioSelect, filterFunc, lengthNotEqualTo } from '../../common/functions';
import * as fp from 'lodash/fp';
import Cheerio = cheerio.Cheerio;
import Element = cheerio.Element;
import * as _ from 'lodash';
import * as moment from 'moment';

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
  S.either(fp.identity)(fp.identity)
]);


// return ;
// S.map((filterDiv: Cheerio) => filterDiv.find('div > a').toArray().map(e => $(e).attr('href'))
