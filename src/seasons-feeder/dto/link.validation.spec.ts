import { Link } from './link';
import { validateSync } from 'class-validator';

describe('Link', () => {

  it('should validate title', () => {
    // empty title
    const link = new Link('', 'http://test.com');
    const validationErrors = validateSync(link);
    expect(validationErrors).toHaveLength(1)
  })
});
