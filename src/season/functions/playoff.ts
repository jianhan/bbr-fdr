import Root = cheerio.Root;
import Element = cheerio.Element;
import Cheerio = cheerio.Cheerio;
import * as _ from 'lodash';
import { Link } from '../../common/schemas/link';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

const extractSerie = ($: Root, row: Cheerio) => {
  const children = row.children('td');

  if (children.length !== 3) {
    throw new Error(`serie must contain 3 columns, ${children.length} number of column(s) found`);
  }

  // extract serie name
  const name = $(children[0]).find('span > strong').first().html();
  if (_.isNull(name)) {
    throw new Error(`serie unable to find serie name by selector span > strong`);
  }

  // extract final result
  const finalResultChildren = $(children[1]).children('a');
  if (finalResultChildren.length !== 2) {
    throw new Error(`final result of serie must have 2 children, ${finalResultChildren.length} of children found`);
  }

  // extract win team and lose team
  const [winTeam, loseTeam] = finalResultChildren.map((i: number, el: Element) => new Link($(el).html(), $(el).attr('href'))).toArray();

  // extract status
  const statusNode = $(children[2]).children('a').first();
  const status = new Link($(statusNode).html(), $(statusNode).attr('href'));

  return {
    name,
    winTeam,
    loseTeam,
    status
  }
};

export const extractPlayoff = ($: Root, year: number) => {
  $('table#all_playoffs > tbody > tr.toggleable').map((i, el: Element): any => {
    const playOffSerie = extractSerie($, $(el).prev('tr'));
    return 'test';
  });
};

export const fetchPlayoffHtml = async (url: string): Promise<string> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('table#all_playoffs');
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  await browser.close();
  return bodyHTML;
};
