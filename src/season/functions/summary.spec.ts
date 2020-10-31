import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { extractSummary } from './summary';
import { Link } from '../../common/schemas/link';

describe('summary', () => {

  describe('test extractSummaryHtml', () => {

    it('should extract summary information from html page', () => {
      const year = 2020;
      const summary2020Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_2020.html')).toString();
      const summary = extractSummary(cheerio.load(summary2020Html), year);

      expect(summary.year).toEqual(year);
      expect(summary.leagueChampion).toEqual(new Link('Los Angeles Lakers', '/teams/LAL/2020.html'));
      expect(summary.mostValuablePlayer).toEqual(new Link('Giannis Antetokounmpo', '/players/a/antetgi01.html', '29.5/13.6/5.6'));
      expect(summary.rookieOfTheYear).toEqual(new Link('Ja Morant', '/players/m/moranja01.html', '17.8/3.9/7.3'));
      expect(summary.ppgLeader).toEqual(new Link('James Harden', '/players/h/hardeja01.html', '34.3'));
      expect(summary.rpgLeader).toEqual(new Link('Andre Drummond', '/players/d/drumman01.html', '15.2'));
      expect(summary.apgLeader).toEqual(new Link('LeBron James', '/players/j/jamesle01.html', '10.2'));
      expect(summary.wsLeader).toEqual(new Link('James Harden', '/players/h/hardeja01.html', '13.1'));
    });

    it('should not throw error when html is not valid', () => {
      const year = 2020;
      const summary = extractSummary(cheerio.load('invalid html'), year);
      expect(summary.year).toEqual(year);
    });

  });

  // describe('extractStandings', () => {
  //
  //   it('should extract standings data', () => {
  //     const summary2020Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_2020.html')).toString();
  //     const $ = cheerio.load(summary2020Html);
  //   });
  //
  // });

});
