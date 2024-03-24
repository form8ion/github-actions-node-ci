import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import scaffoldJob from './scaffolder.js';

describe('job scaffolder', () => {
  const steps = any.listOf(any.simpleObject);

  it('should define `runs-on` and use the passed steps', () => {
    expect(scaffoldJob({steps})).toStrictEqual({'runs-on': 'ubuntu-latest', steps});
  });

  it('should define the `strategy` if it is provided', () => {
    const strategy = any.simpleObject();

    expect(scaffoldJob({steps, strategy})).toEqual({'runs-on': 'ubuntu-latest', strategy, steps});
  });
});
