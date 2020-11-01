import { extractYears, notIn, range, stringInBrackets } from './functions';
import * as _ from 'lodash';

describe('functions', () => {

  describe('stringInBrackets', () => {
    it('should extract string between brackets', () => {
      const actual = stringInBrackets('test test (1,2,34,5) test test');
      expect(actual).toEqual('1,2,34,5');
    });
    it('should return empty string when matche not found', () => {
      const actual = stringInBrackets('test');
      expect(actual).toEqual('');
    });
  });

  describe('extractYears', () => {

    it('should extract years', () => {
      const yearRange = range(2000, 2010);
      const objects = yearRange.map(year => ({
        name: `year object ${year}`,
        year,
      }));

      const actual = extractYears(objects);
      expect(actual).toEqual(yearRange);
    });

    it('should return empty array when there are not years to be found', () => {
      const yearRange = range(2000, 2010);
      const objects = yearRange.map(year => ({ name: `year object ${year}` }));

      const actual = extractYears(objects);
      expect(actual).toEqual([]);
    });

  });

  describe('extractYears', () => {

    it('should extract years', () => {
      const yearRange = range(2000, 2010);
      const objects = yearRange.map(year => ({
        name: `year object ${year}`,
        year,
      }));

      const actual = extractYears(objects);
      expect(actual).toEqual(yearRange);
    });

  });

  describe('notIn', () => {

    it('should find differences', () => {
      const actual = notIn([2000, 2001, 2002])([2000, 2003]);
      expect(actual).toEqual([2003]);
    });

  });

});
