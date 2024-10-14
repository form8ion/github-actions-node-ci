import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import scaffoldJob from './scaffolder.js';

describe('job scaffolder', () => {
  const steps = any.listOf(any.simpleObject);

  it('should define `runs-on` and use the passed steps', () => {
    expect(scaffoldJob({steps})).toStrictEqual({'runs-on': 'ubuntu-latest', steps});
  });

  it('should use an alternative runner when defined', () => {
    const runner = any.word();

    expect(scaffoldJob({steps, runner})).toStrictEqual({'runs-on': runner, steps});
  });

  it('should define the `strategy` if it is provided', () => {
    const strategy = any.simpleObject();

    expect(scaffoldJob({steps, strategy})).toEqual({'runs-on': 'ubuntu-latest', strategy, steps});
  });

  it('should define the `needs` dependencies if any are provided', () => {
    const dependencies = any.listOf(any.word);

    expect(scaffoldJob({steps, needs: dependencies})).toEqual({'runs-on': 'ubuntu-latest', needs: dependencies, steps});
  });

  it('should define the `if` conditional if provided', () => {
    const conditional = any.string();

    expect(scaffoldJob({steps, if: conditional})).toEqual({'runs-on': 'ubuntu-latest', if: conditional, steps});
  });
});
