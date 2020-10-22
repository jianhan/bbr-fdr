import * as moment from 'moment';

export const dateDiff = (start: Date, end: Date): moment.Duration => moment.duration(moment(start).diff(moment(end)));
