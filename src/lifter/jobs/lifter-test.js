import any from '@travi/any';
import {assert} from 'chai';

import liftJobs from './lifter';

suite('jobs lifter', () => {
  test('that reading of `.nvmrc` is modernized', async () => {
    const jobs = any.listOf(any.simpleObject);

    assert.equal(await liftJobs({jobs}), jobs);
  });
});
