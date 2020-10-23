import * as moment from 'moment';

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
