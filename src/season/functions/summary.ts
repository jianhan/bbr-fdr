import { Link } from '../../common/schemas/link';
import { stringInBrackets } from '../../common/functions';
import Root = cheerio.Root;

export const extractSummary = ($: Root, year: number): { [key: string]: string | Link | number } => {
  const returnVal = { year };

  [
    { attribute: 'leagueChampion', selector: 'League Champion' },
    { attribute: 'mostValuablePlayer', selector: 'Most Valuable Player' },
    { attribute: 'rookieOfTheYear', selector: 'Rookie of the Year' },
    { attribute: 'ppgLeader', selector: 'PPG Leader' },
    { attribute: 'rpgLeader', selector: 'RPG Leader' },
    { attribute: 'apgLeader', selector: 'APG Leader' },
    { attribute: 'wsLeader', selector: 'WS Leader' },
  ].forEach(v => {
    const segment = extractSegment($, v.selector);
    if (segment !== null) {
      returnVal[v.attribute] = segment;
    }
  });
  returnVal['lastSyncedAt'] = new Date();
  return returnVal;
};

export const extractSegment = ($: Root, selector: string): Link | null => {

  const element = $(`strong:contains('${selector}')`).next('a').first();
  if (element.length === 1) {
    const linkTitle = element.text();
    const linkHref = element.attr('href');
    return new Link(linkTitle, linkHref, stringInBrackets(element.parent().text()));
  }

  return null;
};
