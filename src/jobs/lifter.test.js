import zip from 'lodash.zip';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {lift as liftJob} from '../job/index.js';
import * as matrixVerificationJobEnhancer from './verify-matrix/index.js';
import * as workflowResultJobEnhancer from './workflow-result/index.js';
import insertMissingJob from './missing-job-inserter.js';
import buildNodeVersionMatrix from './node-version-matrix-builder.js';
import liftJobs from './lifter.js';

vi.mock('./missing-job-inserter.js');
vi.mock('./node-version-matrix-builder.js');
vi.mock('../job/index.js');

describe('steps lifter', () => {
  it('should lift the steps', async () => {
    const jobNames = any.listOf(any.word);
    const jobNamesWithMissingInjected = any.listOf(any.word);
    const jobDefinitions = jobNames.map(any.simpleObject);
    const jobDefinitionsWithMissingInjected = jobNamesWithMissingInjected.map(any.simpleObject);
    const liftedJobDefinitions = jobDefinitionsWithMissingInjected.map(any.simpleObject);
    const supportedNodeVersionRange = any.string();
    const supportedNodeVersions = any.listOf(any.integer);
    const runner = any.word();
    const jobs = Object.fromEntries(zip(jobNames, jobDefinitions));
    when(buildNodeVersionMatrix).calledWith(supportedNodeVersionRange).thenReturn(supportedNodeVersions);
    when(insertMissingJob)
      .calledWith({versions: supportedNodeVersions, jobs: zip(jobNames, jobDefinitions), runner})
      .thenReturn(zip(jobNamesWithMissingInjected, jobDefinitionsWithMissingInjected));
    zip(jobDefinitionsWithMissingInjected, liftedJobDefinitions, jobNamesWithMissingInjected).forEach(
      ([job, liftedJob, jobName]) => when(liftJob)
        .calledWith(
          [jobName, job],
          [matrixVerificationJobEnhancer, workflowResultJobEnhancer],
          {inRangeNodeVersions: supportedNodeVersions, jobs}
        )
        .thenReturn([jobName, liftedJob])
    );

    expect(await liftJobs({jobs, engines: supportedNodeVersionRange, runner}))
      .toEqual(Object.fromEntries(zip(jobNamesWithMissingInjected, liftedJobDefinitions)));
  });
});
