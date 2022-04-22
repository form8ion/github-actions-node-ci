import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as jobsScaffolder from '../../jobs/scaffolder';
import insertMissingJobs from './missing-job-inserter';

suite('missing job inserter', () => {
  suite('matrix verification', () => {
    let sandbox;
    const matrixOfNodeVersions = any.listOf(any.integer);
    const matrixVerificationJobName = 'verify-matrix';
    const matrixVerificationJob = any.simpleObject();

    setup(() => {
      sandbox = sinon.createSandbox();

      sandbox.stub(jobsScaffolder, 'matrixVerification');

      jobsScaffolder.matrixVerification.withArgs(matrixOfNodeVersions).returns(matrixVerificationJob);
    });

    teardown(() => sandbox.restore());

    test('that a matrix verification job is inserted if none exists', async () => {
      const jobs = any.listOf(() => ([any.word(), any.simpleObject()]));

      assert.deepEqual(
        insertMissingJobs(matrixOfNodeVersions, jobs),
        [[matrixVerificationJobName, matrixVerificationJob], ...jobs]
      );
    });

    test(
      'that a matrix verification job is inserted if a job strategy already exists but not with a matrix for node',
      () => {
        const jobs = [...any.listOf(() => ([any.word(), any.simpleObject()])), [any.word(), {strategy: {}}]];

        assert.deepEqual(
          insertMissingJobs(matrixOfNodeVersions, jobs),
          [[matrixVerificationJobName, matrixVerificationJob], ...jobs]
        );
      }
    );

    test('that a matrix verification job is inserted if a matrix job already exists but not for node', async () => {
      const jobs = [...any.listOf(() => ([any.word(), any.simpleObject()])), [any.word(), {strategy: {matrix: {}}}]];

      assert.deepEqual(
        insertMissingJobs(matrixOfNodeVersions, jobs),
        [[matrixVerificationJobName, matrixVerificationJob], ...jobs]
      );
    });

    test('that a matrix verification job is not inserted if a matrix job already exists for node', async () => {
      const jobs = [
        ...any.listOf(() => ([any.word(), any.simpleObject()])),
        [any.word(), {strategy: {matrix: {node: {}}}}]
      ];

      assert.deepEqual(insertMissingJobs(matrixOfNodeVersions, jobs), jobs);
    });

    test('that a matrix verification job is not inserted if no matrix of node versions is provided', async () => {
      const jobs = any.listOf(() => ([any.word(), any.simpleObject()]));

      assert.deepEqual(insertMissingJobs(undefined, jobs), jobs);
    });
  });
});
