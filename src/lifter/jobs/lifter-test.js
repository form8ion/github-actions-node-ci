import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import zip from 'lodash.zip';

import * as missingJobInserter from './missing-job-inserter.js';
import * as nodeVersionMatrixBuilder from './node-version-matrix-builder.js';
import * as jobLifter from './job-lifter.js';
import liftJobs from './lifter.js';

suite('jobs lifter', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jobLifter, 'default');
    sandbox.stub(nodeVersionMatrixBuilder, 'default');
    sandbox.stub(missingJobInserter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that jobs are lifted', async () => {
    const jobNames = any.listOf(any.word);
    const jobDefinitions = jobNames.map(any.simpleObject);
    const liftedJobDefinitions = jobDefinitions.map(any.simpleObject);
    const supportedNodeVersionRange = any.string();
    const supportedNodeVersions = any.listOf(any.integer);
    const jobPairsWithMissingInjected = zip(any.listOf(any.word), any.listOf(any.simpleObject));
    nodeVersionMatrixBuilder.default.withArgs(supportedNodeVersionRange).returns(supportedNodeVersions);
    missingJobInserter.default
      .withArgs(supportedNodeVersions, zip(jobNames, liftedJobDefinitions))
      .returns(jobPairsWithMissingInjected);
    zip(jobDefinitions, liftedJobDefinitions, jobNames).forEach(
      ([job, liftedJob, jobName]) => jobLifter.default
        .withArgs([jobName, job], supportedNodeVersions)
        .returns([jobName, liftedJob])
    );

    assert.deepEqual(
      await liftJobs(Object.fromEntries(zip(jobNames, jobDefinitions)), supportedNodeVersionRange),
      Object.fromEntries(jobPairsWithMissingInjected)
    );
  });
});
