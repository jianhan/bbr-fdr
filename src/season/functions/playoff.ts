import Root = cheerio.Root;
import Element = cheerio.Element;
import Cheerio = cheerio.Cheerio;
import * as _ from 'lodash';
import { Link } from '../../common/schemas/link';
import { PlayoffSerie } from '../schemas/playoff-serie';
import { PlayoffGame } from '../schemas/playoff-game';
import { Playoff, PlayoffDocument } from '../schemas/playoff.schema';
import { Model } from "mongoose";
import { YearAndHtml } from '../types';
import * as cheerio from "cheerio";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

const extractSerie = ($: Root, row: Cheerio): PlayoffSerie => {
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
    status,
    games: [],
  };
};

const extractSerieGames = ($: Root, el: Element): PlayoffGame[] => $(el).find('td > div > table > tbody > tr').toArray().map((trEl: Element): PlayoffGame => {
  const tdElements = $(trEl).children('td');
  if (tdElements.length !== 6) {
    throw new Error(`serie game must have 6 columns, ${tdElements.length} of columns found`);
  }

  // extract game element
  const gameElement = $(tdElements[0]).children('a');
  if (gameElement.length === 0) {
    throw new Error(`unable to find serie game`);
  }
  const game = new Link($(gameElement[0]).html(), $(gameElement[0]).attr('href'));

  // extract date
  const date = $(tdElements[1]).html();

  // extract away team
  const awayTeam = {
    name: $(tdElements[2]).html(),
    score: parseInt($(tdElements[3]).html(), 10),
  };

  // extract home team
  const homeTeam = {
    name: _.replace($(tdElements[4]).html(), '@', ''),
    score: parseInt($(tdElements[5]).html(), 10),
  };

  return {
    game,
    date,
    homeTeam,
    awayTeam,
  };
});

export const extractPlayoff = ($: Root, year: number): Playoff => {
  return {
    year: year,
    series: extractPlayoffSeries($),
    lastSyncedAt: new Date(),
  }
};

export const extractPlayoffSeries = ($: Root): PlayoffSerie[] => $('table#all_playoffs > tbody > tr.toggleable').toArray().map((el: Element): any => {
  const playOffSerie = extractSerie($, $(el).prev('tr'));
  playOffSerie.games = extractSerieGames($, el);
  return playOffSerie;
});

export const fetchPlayoffHtml = async (url: string): Promise<string> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('table#all_playoffs');
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  await browser.close();
  return bodyHTML;
};

export const findOnePlayoffAndUpdate = (playoffModel: Model<PlayoffDocument>, yah: YearAndHtml) => playoffModel.findOneAndUpdate({ year: yah.year }, extractPlayoff(cheerio.load(yah.html), yah.year), { new: true, upsert: true });
