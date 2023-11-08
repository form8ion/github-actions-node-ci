import {describe, it, expect, afterEach, beforeEach, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {matrixVerification} from '../../jobs/scaffolder.js';
import insertMissingJobs from './missing-job-inserter.js';

vi.mock('../../jobs/scaffolder.js');

describe('missing job inserter', () => {
  describe('matrix verification', () => {
    const matrixOfNodeVersions = any.listOf(any.integer);
    const matrixVerificationJobName = 'verify-matrix';
    const matrixVerificationJob = any.simpleObject();

    beforeEach(() => {
      when(matrixVerification).calledWith(matrixOfNodeVersions).mockReturnValue(matrixVerificationJob);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should insert a matrix verification job if none exists', async () => {
      const jobs = any.listOf(() => ([any.word(), any.simpleObject()]));

      expect(insertMissingJobs(matrixOfNodeVersions, jobs))
        .toEqual([[matrixVerificationJobName, matrixVerificationJob], ...jobs]);
    });

    it(
      'should insert a matrix verification job if a job strategy already exists but not with a matrix for node',
      async () => {
        const jobs = [...any.listOf(() => ([any.word(), any.simpleObject()])), [any.word(), {strategy: {}}]];

        expect(insertMissingJobs(matrixOfNodeVersions, jobs))
          .toEqual([[matrixVerificationJobName, matrixVerificationJob], ...jobs]);
      }
    );

    it('should insert a matrix verification job if a matrix job already exists but not for node', async () => {
      const jobs = [...any.listOf(() => ([any.word(), any.simpleObject()])), [any.word(), {strategy: {matrix: {}}}]];

      expect(insertMissingJobs(matrixOfNodeVersions, jobs))
        .toEqual([[matrixVerificationJobName, matrixVerificationJob], ...jobs]);
    });

    it('should not insert a matrix verification job if a matrix job already exists for node', async () => {
      const jobs = [
        ...any.listOf(() => ([any.word(), any.simpleObject()])),
        [any.word(), {strategy: {matrix: {node: {}}}}]
      ];

      expect(insertMissingJobs(matrixOfNodeVersions, jobs)).toEqual(jobs);
    });

    it('should not insert a matrix verification job if no matrix of node versions is provided', async () => {
      const jobs = any.listOf(() => ([any.word(), any.simpleObject()]));

      expect(insertMissingJobs(undefined, jobs)).toEqual(jobs);
    });
  });
});
