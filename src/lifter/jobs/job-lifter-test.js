import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import * as stepsLifter from './steps-lifter.js';
import liftJob from './job-lifter.js';

suite('job lifter', () => {
  let sandbox;
  const jobName = any.word();
  const updatedSupportedNodeVersions = any.listOf(any.simpleObject);

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(stepsLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the steps of the job are lifted', async () => {
    const jobWithoutSteps = any.simpleObject();
    const jobSteps = any.listOf(any.simpleObject);
    const liftedSteps = any.listOf(any.simpleObject);
    stepsLifter.default.withArgs(jobSteps).returns(liftedSteps);

    assert.deepEqual(
      liftJob([jobName, {...jobWithoutSteps, steps: jobSteps}]),
      [jobName, {...jobWithoutSteps, steps: liftedSteps}]
    );
  });

  test('that a job that calls a reusable workflow is lifted', async () => {
    const jobThatCallsReusableWorkflow = {...any.simpleObject(), uses: any.string()};
    const liftedJob = liftJob([jobName, jobThatCallsReusableWorkflow]);

    assert.notCalled(stepsLifter.default);
    assert.deepEqual(liftedJob, [jobName, jobThatCallsReusableWorkflow]);
  });

  test('that the provided node versions are replaced in the matrix definition for an existing matrix job', async () => {
    const [, updatedJobDefinition] = liftJob(
      [jobName, {...any.simpleObject(), strategy: {matrix: {node: any.listOf(any.integer)}}}],
      updatedSupportedNodeVersions
    );

    assert.deepEqual(updatedJobDefinition.strategy.matrix.node, updatedSupportedNodeVersions);
  });

  test('that a test strategy is not added to a job that does not already have one defined', async () => {
    const [, updatedJobDefinition] = liftJob([jobName, any.simpleObject()], updatedSupportedNodeVersions);

    assert.isUndefined(updatedJobDefinition.strategy);
  });

  test('that a test matrix is not added to a job that does not already have one defined', async () => {
    const [, updatedJobDefinition] = liftJob(
      [jobName, {...any.simpleObject(), strategy: any.simpleObject()}],
      updatedSupportedNodeVersions
    );

    assert.isUndefined(updatedJobDefinition.strategy.matrix);
  });

  test(
    'that a list of supported node versions is not added to a job that does not already have one defined',
    async () => {
      const [, updatedJobDefinition] = liftJob(
        [jobName, {...any.simpleObject(), strategy: {...any.simpleObject(), matrix: any.simpleObject()}}],
        updatedSupportedNodeVersions
      );

      assert.isUndefined(updatedJobDefinition.strategy.matrix.node);
    }
  );
});
