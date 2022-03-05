import any from '@travi/any';
import {assert} from 'chai';
import merge from './merge-branches';

suite('merge branch lists', () => {
  test('that additional branches are appended to the list', () => {
    const existingBranches = any.listOf(any.word);
    const additionalBranches = any.listOf(any.word);
    const commonBranches = any.listOf(any.word);

    assert.deepEqual(
      merge([...existingBranches, ...commonBranches], [...additionalBranches, ...commonBranches]),
      [...existingBranches, ...commonBranches, ...additionalBranches]
    );
  });
});
