import * as _ from 'lodash';
import { Link } from '../../common/schemas/link';
import Root = cheerio.Root;
import { StandingRecord } from '../schemas/standing-record';
import { Standing } from '../schemas/standing.schema';

const extractStandingRecords = ($: Root, tableRowsSelector: string): StandingRecord[] => $(`#${tableRowsSelector}`).toArray().map(trEl => {
  const standingRecord = new StandingRecord();
  $(trEl).children().toArray().forEach(tdEl => {
    const dataStat = $(tdEl).attr('data-stat');
    const tdText = $(tdEl).text();

    switch (dataStat) {
      case 'team_name': {
        const teamNameLink = $(tdEl).children('a').first();
        if (teamNameLink.length === 1) {
          standingRecord.isPlayoffTeam = _.includes(tdText, '*');
          standingRecord.team = new Link(teamNameLink.text(), teamNameLink.attr('href'));
        }
        break;
      }
      case 'wins': {
        standingRecord.wins = parseInt(tdText, 10);
        break;
      }
      case 'losses': {
        standingRecord.losses = parseInt(tdText, 10);
        break;
      }
      case 'win_loss_pct': {
        standingRecord.winLossPercentage = parseFloat(tdText);
        break;
      }
      case 'gb': {
        const gamesBehind = parseInt(tdText, 10);
        standingRecord.gamesBehind = _.isNaN(gamesBehind) ? null : gamesBehind;
        break;
      }
      case 'pts_per_g': {
        standingRecord.pointsPerGame = parseFloat(tdText);
        break;
      }
      case 'opp_pts_per_g': {
        standingRecord.opponentPointsPerGame = parseFloat(tdText);
        break;
      }
      case 'srs': {
        standingRecord.simpleRatingSystem = parseFloat(tdText);
        break;
      }
    }
  });

  return standingRecord;
});

export const extractStandings = ($: Root, year: number) => {
  const standing = new Standing();
  standing.year = year;

  standing.conferenceStandings = {
    easternConference: extractStandingRecords($, 'confs_standings_E > tbody > tr.full_table'),
    westernConference: extractStandingRecords($, 'confs_standings_E > tbody > tr.full_table'),
  };

  standing.divisionStandings = {
    easternConference: extractStandingRecords($, 'divs_standings_E > tbody > tr.full_table'),
    westernConference: extractStandingRecords($, 'divs_standings_W > tbody > tr.full_table'),
  };

  standing.lastSyncedAt = new Date();
  return standing;
};
