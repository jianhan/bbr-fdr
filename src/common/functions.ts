import * as moment from 'moment';
import configuration from '../config/configuration';
import * as _ from 'lodash';
import * as fp from 'lodash/fp';

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
    if (_.has(v, 'year')) {
      years.push(v.year);
    }
  });
  return years;
};

export const notIn = target => source => _.difference(source, target);
