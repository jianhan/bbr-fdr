import { stringInBrackets } from './functions';

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
});
