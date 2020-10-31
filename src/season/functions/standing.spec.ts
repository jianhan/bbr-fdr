import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { extractStandings } from './standing';
import * as _ from 'lodash'

describe('standing', () => {
  describe('extractStandings function', () => {

    it('should extract standings information', () => {
      const year = 2020;
      const summary2020Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_2020.html')).toString();
      const standings = extractStandings(cheerio.load(summary2020Html), year);
      expect(standings.year).toEqual(year);
      expect(standings.divisionStandings.easternConference).toHaveLength(15);
      expect(standings.divisionStandings.westernConference).toHaveLength(15);
      expect(standings.conferenceStandings.easternConference).toHaveLength(15);
      expect(standings.conferenceStandings.westernConference).toHaveLength(15);

      expect(standings.divisionStandings.easternConference[0].gamesBehind).toBe(null);
      expect(standings.divisionStandings.westernConference[0].gamesBehind).toBe(null);
      expect(standings.conferenceStandings.easternConference[0].gamesBehind).toBe(null);
      expect(standings.conferenceStandings.westernConference[0].gamesBehind).toBe(null);
    });

  });

  it('should extract standings without conference standings', () => {
    const year = 2000;
    const summary2000Html = fs.readFileSync(path.join(__dirname, '__tests__', 'summary_2000.html')).toString();
    const standings = extractStandings(cheerio.load(summary2000Html), year);
    expect(standings.year).toEqual(year);
    expect(standings.divisionStandings.easternConference).toHaveLength(15);
    expect(standings.divisionStandings.westernConference).toHaveLength(14);
    expect(standings.conferenceStandings.easternConference).toHaveLength(0);
    expect(standings.conferenceStandings.westernConference).toHaveLength(0);
  });
  it('test', () => {
    const t = _.difference([], [])
  })

});
