import * as fs from "fs";
import * as path from "path";
import * as cheerio from 'cheerio';
import { extractPlayoff } from './playoff';

describe('playoff', () => {

  describe('extractPlayoff', () => {
    it('should extract playoff', () => {
      const year = 2020;
      const summary2020Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_2020.html')).toString();
      const $ = cheerio.load(summary2020Html);
      extractPlayoff($, 2020);
    })
  });

});
