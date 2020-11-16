import * as moment from 'moment';
import configuration from '../config/configuration';
import * as _ from 'lodash';
import axios, { AxiosResponse } from 'axios';
import Root = cheerio.Root;
import * as S from 'sanctuary';
import Cheerio = cheerio.Cheerio;
import validator from 'validator';

export type simpleFetch = (url: string) => Promise<string>;

export type filterFunc = <T>(inputs: T[]) => T[];

export const simpleAxiosRequest: simpleFetch = (url: string) => axios.get(url).then((r: AxiosResponse) => r.data);

export const dateDiff = (start: Date, end: Date): moment.Duration => moment.duration(moment(start).diff(moment(end)));

export const stringInBrackets = (str: string): string => {
  const match = /\((.*?)\)/gm.exec(str);

  if (match === null) {
    return '';
  }

  if (match.length > 0) {
    return match[1];
  }

  return '';
};

export const isPageCacheExpired = (target: Date, duration: number = configuration().pageCacheDurationInSeconds) => dateDiff(target, new Date()).asSeconds() > duration;

export const generateSummaryURL = (year: number): string => `${configuration().domainURL}/leagues/NBA_${year}.html`;

export const range = (min: number, max: number): number[] => {
  const retVal = [];
  while (min <= max) {
    retVal.push(min);
    min++;
  }

  return retVal;
};

export const headOrMax = (inputArr: number[]) => (output: number[]) => _.size(output) > 0 ? _.head(output) : _.max(inputArr);

export const extractYears = objs => {
  const years = [];
  objs.forEach(v => {
    const year = v.year;
    if (year !== undefined) {
      years.push(v.year);
    }
  });
  return years;
};

export const notIn = source => target => _.difference(source, target);

export const cheerioSelect = (selector: string) => ($: Root): Cheerio => $(selector);

export const lengthNotEqualTo = (expectedLength: number) => x => _.size(x) !== expectedLength;

export const validateUrl = S.ifElse(validator.isURL)(S.Right)((s: string) => S.Left(new Error(`"${s}" is not a valid url`)));
