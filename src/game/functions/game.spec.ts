import { extractMonthHrefs, filterMonthHrefs, getAllValidMonthHrefsByYear, getGameUrlByYear } from './game';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import * as fp from 'lodash/fp';
import * as S from 'sanctuary';

describe('test game functions', () => {

  describe('generateGameUrlByYear function', () => {

    it('should generate url by year', async () => {
      const url = getGameUrlByYear('http://test.com', 2000);
      expect(url).toBe('http://test.com/leagues/NBA_2000_games.html');
    });

  });

  describe('extractMonthLinks function', () => {

    it('should extract links for all months', async () => {
      const t = moment.months().map(fp.toLower);
      const games2000Html = fs.readFileSync(path.join(__dirname, '__tests__', 'NBA_2000_games.html')).toString();
      const filterFunc = fp.curry(filterMonthHrefs)(getAllValidMonthHrefsByYear(2000));
      const monthLinks = extractMonthHrefs(filterFunc)(cheerio.load(games2000Html));
    });

    it('should throw when more than one filter div found', async () => {
    });

    it('should return empty array when selector did not find any element', async () => {
    });

  });

});
