import { Link } from './link';
import { validateSync, ValidationError } from 'class-validator';
import * as _ from 'lodash';
import { elements } from 'jsverify';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsc = require('jsverify');

describe('Link validations', () => {

  it('validation should fail when title is empty title', () => {
    const assertions = jsc.forall(elements([undefined, null, '']), 'nestring', 'nestring', (title, href: string, data: string) => {
      const validationErrors = validateSync(new Link(title, href, data));
      const findTitleErr = validationErrors.filter((err: ValidationError) => err.property === 'title');
      return _.size(findTitleErr) === 1;
    });
    jsc.assert(assertions);
  });

  it('validation should fail when href is invalid', () => {
    const assertions = jsc.forall('nestring', 'nestring', 'nestring', (title: string, href: string, data: string) => {
      const validationErrors = validateSync(new Link(title, href, data));
      const findTitleErr = validationErrors.filter((err: ValidationError) => err.property === 'href');
      return _.size(findTitleErr) === 1;
    });
    jsc.assert(assertions);
  });

  it('validation should pass when href is valid', () => {
    const assertions = jsc.forall(elements(['#', '/relative-url.com', 'https://full-url.com', 'http://full-url.com']), (href: string) => {
      return _.size(validateSync(new Link('valid title', href))) === 0;
    });
    jsc.assert(assertions);
  });

  it('should not be invalid when data is missing', () => {
    const assertions = jsc.forall('nestring', elements([undefined, null, '']), (title: string, data: string) => {
      // set data to null
      const link = new Link(title, 'http://www.abcdef.com', data);
      const validationErrors = validateSync(link);
      return _.size(validationErrors) === 0;
    });

    jsc.assert(assertions);
  });

});
