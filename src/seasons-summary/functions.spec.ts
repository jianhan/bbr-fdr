import * as fs from 'fs';
import * as path from 'path';
import { extractSummaryHtml } from './functions';
import { Link } from '../common/dto/link';

describe('test functions', () => {

  describe('test extractSummaryHtml', () => {

    it('should extract create summary DTO from html page', () => {
      const year = 2020;
      const summary2020Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_2020.html')).toString();
      const createSeasonSummaryDTO = extractSummaryHtml(year, summary2020Html);

      expect(createSeasonSummaryDTO.rawHtml).toEqual(summary2020Html);
      expect(createSeasonSummaryDTO.year).toEqual(year);
      expect(createSeasonSummaryDTO.leagueChampion).toEqual(new Link('Los Angeles Lakers', '/teams/LAL/2020.html'));
      expect(createSeasonSummaryDTO.mostValuablePlayer).toEqual(new Link('Giannis Antetokounmpo', '/players/a/antetgi01.html', '29.5/13.6/5.6'));
      expect(createSeasonSummaryDTO.rookieOfTheYear).toEqual(new Link('Ja Morant', '/players/m/moranja01.html', '17.8/3.9/7.3'));
      expect(createSeasonSummaryDTO.ppgLeader).toEqual(new Link('James Harden', '/players/h/hardeja01.html', '34.3'));
      expect(createSeasonSummaryDTO.rpgLeader).toEqual(new Link('Andre Drummond', '/players/d/drumman01.html', '15.2'));
      expect(createSeasonSummaryDTO.apgLeader).toEqual(new Link('LeBron James', '/players/j/jamesle01.html', '10.2'));
      expect(createSeasonSummaryDTO.wsLeader).toEqual(new Link('James Harden', '/players/h/hardeja01.html', '13.1'));
    });

  });

});
