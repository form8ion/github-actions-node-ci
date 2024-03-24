import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import scaffoldJob from './scaffolder.js';

describe('job scaffolder', () => {
  it('should define `runs-on` and use the passed steps', () => {
    const steps = any.listOf(any.simpleObject);

    expect(scaffoldJob({steps})).toEqual({'runs-on': 'ubuntu-latest', steps});
  });
});
