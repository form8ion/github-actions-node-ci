import zip from 'lodash.zip';

import {describe, it, expect, afterEach, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import insertMissingJob from './missing-job-inserter.js';
import buildNodeVersionMatrix from './node-version-matrix-builder.js';
import liftJob from './job-lifter.js';
import liftJobs from './lifter.js';

vi.mock('./missing-job-inserter.js');
vi.mock('./node-version-matrix-builder.js');
vi.mock('./job-lifter.js');

describe('jobs lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the jobs', async () => {
    const jobNames = any.listOf(any.word);
    const jobDefinitions = jobNames.map(any.simpleObject);
    const liftedJobDefinitions = jobDefinitions.map(any.simpleObject);
    const supportedNodeVersionRange = any.string();
    const supportedNodeVersions = any.listOf(any.integer);
    const jobPairsWithMissingInjected = zip(any.listOf(any.word), any.listOf(any.simpleObject));
    when(buildNodeVersionMatrix).calledWith(supportedNodeVersionRange).mockReturnValue(supportedNodeVersions);
    when(insertMissingJob)
      .calledWith(supportedNodeVersions, zip(jobNames, liftedJobDefinitions))
      .mockReturnValue(jobPairsWithMissingInjected);
    zip(jobDefinitions, liftedJobDefinitions, jobNames).forEach(
      ([job, liftedJob, jobName]) => when(liftJob)
        .calledWith([jobName, job], supportedNodeVersions)
        .mockReturnValue([jobName, liftedJob])
    );

    expect(await liftJobs(Object.fromEntries(zip(jobNames, jobDefinitions)), supportedNodeVersionRange))
      .toEqual(Object.fromEntries(jobPairsWithMissingInjected));
  });
});