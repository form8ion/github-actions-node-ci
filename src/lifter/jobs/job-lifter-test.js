import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import * as stepsLifter from './steps-lifter';
import liftJob from './job-lifter';

suite('job lifter', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(stepsLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the steps of the job are lifted', async () => {
    const jobName = any.word();
    const jobWithoutSteps = any.simpleObject();
    const jobSteps = any.listOf(any.simpleObject);
    const liftedSteps = any.listOf(any.simpleObject);
    stepsLifter.default.withArgs(jobSteps).returns(liftedSteps);

    assert.deepEqual(
      liftJob([jobName, {...jobWithoutSteps, steps: jobSteps}]),
      [jobName, {...jobWithoutSteps, steps: liftedSteps}]
    );
  });
});
