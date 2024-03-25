import zip from 'lodash.zip';

import {describe, it, expect, afterEach, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import insertMissingJob from './missing-job-inserter.js';
import buildNodeVersionMatrix from './node-version-matrix-builder.js';
import {lift as liftJob} from '../job/index.js';
import liftJobs from './lifter.js';

vi.mock('./missing-job-inserter.js');
vi.mock('./node-version-matrix-builder.js');
vi.mock('../job/index.js');

describe('steps lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the steps', async () => {
    const jobNames = any.listOf(any.word);
    const jobDefinitions = jobNames.map(any.simpleObject);
    const liftedJobDefinitions = jobDefinitions.map(any.simpleObject);
    const supportedNodeVersionRange = any.string();
    const supportedNodeVersions = any.listOf(any.integer);
    const jobPairsWithMissingInjected = zip(any.listOf(any.word), any.listOf(any.simpleObject));
    const runner = any.word();
    when(buildNodeVersionMatrix).calledWith(supportedNodeVersionRange).mockReturnValue(supportedNodeVersions);
    when(insertMissingJob)
      .calledWith({versions: supportedNodeVersions, jobs: zip(jobNames, liftedJobDefinitions), runner})
      .mockReturnValue(jobPairsWithMissingInjected);
    zip(jobDefinitions, liftedJobDefinitions, jobNames).forEach(
      ([job, liftedJob, jobName]) => when(liftJob)
        .calledWith([jobName, job], supportedNodeVersions)
        .mockReturnValue([jobName, liftedJob])
    );

    expect(await liftJobs({
      jobs: Object.fromEntries(zip(jobNames, jobDefinitions)),
      engines: supportedNodeVersionRange,
      runner
    })).toEqual(Object.fromEntries(jobPairsWithMissingInjected));
  });
});
