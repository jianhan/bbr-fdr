import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { extractPlayoffSeries } from './playoff';

describe('playoff', () => {

  describe('extractPlayoff', () => {
    it('should extract playoff', () => {
      const summary2000Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_with_play_off_2000.html')).toString();
      const $ = cheerio.load(summary2000Html);
      const playofS = extractPlayoffSeries($);
    });
  });

});
