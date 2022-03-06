import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import zip from 'lodash.zip';

import * as jobLifter from './job-lifter';
import liftJobs from './lifter';

suite('jobs lifter', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jobLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that jobs are lifted', async () => {
    const jobNames = any.listOf(any.word);
    const jobDefinitions = jobNames.map(any.simpleObject);
    const liftedJobDefinitions = jobDefinitions.map(any.simpleObject);
    zip(jobDefinitions, liftedJobDefinitions, jobNames).forEach(
      ([job, liftedJob, jobName]) => jobLifter.default.withArgs([jobName, job]).returns([jobName, liftedJob])
    );

    assert.deepEqual(
      await liftJobs(Object.fromEntries(zip(jobNames, jobDefinitions))),
      Object.fromEntries(zip(jobNames, liftedJobDefinitions))
    );
  });
});
