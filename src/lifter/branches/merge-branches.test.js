import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import merge from './merge-branches.js';

describe('merge branch lists', () => {
  it('should append additional branches to the list', () => {
    const existingBranches = any.listOf(any.word);
    const additionalBranches = any.listOf(any.word);
    const commonBranches = any.listOf(any.word);

    expect(merge([...existingBranches, ...commonBranches], [...additionalBranches, ...commonBranches]))
      .toEqual([...existingBranches, ...commonBranches, ...additionalBranches]);
  });
});
