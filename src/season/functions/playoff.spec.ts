import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { extractPlayoff, extractPlayoffSeries } from './playoff';

describe('playoff', () => {

  describe('extractPlayoffSeries', () => {
    it('should extract playoff series', () => {
      const summary2000Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_with_play_off_2000.html')).toString();
      const $ = cheerio.load(summary2000Html);
      const series = extractPlayoffSeries($);
      expect(series).toHaveLength(15);
    });
  });

  describe('extractPlayoff', () => {
    it('should extract playoff', () => {
      const summary2000Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_with_play_off_2000.html')).toString();
      const $ = cheerio.load(summary2000Html);
      const series = extractPlayoff($, 2000);
      expect(series).toHaveProperty('year');
      expect(series.year).toEqual(2000);
    });
  });

});
