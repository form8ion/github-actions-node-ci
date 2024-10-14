import {describe, it, expect, afterEach, beforeEach, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {matrixVerification} from './scaffolder.js';
import insertMissingJobs from './missing-job-inserter.js';
import {scaffold as scaffoldWorkflowResultJob} from './workflow-result/index.js';

vi.mock('./scaffolder.js');
vi.mock('./workflow-result/index.js');

describe('missing job inserter', () => {
  describe('matrix verification', () => {
    const matrixOfNodeVersions = any.listOf(any.integer);
    const matrixVerificationJobName = 'verify-matrix';
    const matrixVerificationJob = any.simpleObject();
    const runner = any.word();

    beforeEach(() => {
      when(matrixVerification)
        .calledWith({versions: matrixOfNodeVersions, runner})
        .mockReturnValue(matrixVerificationJob);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should insert a matrix verification job if none exists', async () => {
      const jobs = any.listOf(() => ([any.word(), any.simpleObject()]));

      expect(insertMissingJobs({versions: matrixOfNodeVersions, jobs, runner}))
        .toEqual([[matrixVerificationJobName, matrixVerificationJob], ...jobs]);
    });

    it(
      'should insert a matrix verification job if a job strategy already exists but not with a matrix for node',
      async () => {
        const jobs = [...any.listOf(() => ([any.word(), any.simpleObject()])), [any.word(), {strategy: {}}]];

        expect(insertMissingJobs({versions: matrixOfNodeVersions, jobs, runner}))
          .toEqual([[matrixVerificationJobName, matrixVerificationJob], ...jobs]);
      }
    );

    it('should insert a matrix verification job if a matrix job already exists but not for node', async () => {
      const jobs = [...any.listOf(() => ([any.word(), any.simpleObject()])), [any.word(), {strategy: {matrix: {}}}]];

      expect(insertMissingJobs({versions: matrixOfNodeVersions, jobs, runner}))
        .toEqual([[matrixVerificationJobName, matrixVerificationJob], ...jobs]);
    });

    it('should not insert a matrix verification job if a matrix job already exists for node', async () => {
      const jobs = [
        ...any.listOf(() => ([any.word(), any.simpleObject()])),
        [any.word(), {strategy: {matrix: {node: {}}}}],
        ['workflow-result', any.simpleObject()]
      ];

      expect(insertMissingJobs({versions: matrixOfNodeVersions, jobs})).toEqual(jobs);
    });

    it('should not insert a matrix verification job if no matrix of node versions is provided', async () => {
      const jobs = [...any.listOf(() => ([any.word(), any.simpleObject()])), ['workflow-result', any.simpleObject()]];

      expect(insertMissingJobs({versions: undefined, jobs})).toEqual(jobs);
    });

    it('should insert a `workflow-result` job when one doesnt already exist', async () => {
      const jobs = any.listOf(() => ([any.word(), any.simpleObject()]));
      const resultJob = any.simpleObject();
      when(scaffoldWorkflowResultJob).calledWith({runner}).mockReturnValue(resultJob);

      expect(insertMissingJobs({jobs, runner}))
        .toEqual([...jobs, ['workflow-result', resultJob]]);
    });
  });
});
