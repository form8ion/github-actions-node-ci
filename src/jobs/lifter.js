import buildNodeVersionMatrix from './node-version-matrix-builder.js';
import insertMissingJobs from './missing-job-inserter.js';
import * as matrixVerificationJobEnhancer from './verify-matrix/index.js';
import * as workflowResultJobEnhancer from './workflow-result/index.js';
import {lift as liftJob} from '../job/index.js';

export default function ({jobs, engines, runner}) {
  const nodeEnginesMatrix = buildNodeVersionMatrix(engines);

  const jobEntries = Object.entries(jobs);
  const jobsWithMissingInserted = insertMissingJobs({versions: nodeEnginesMatrix, jobs: jobEntries, runner});

  return Object.fromEntries(jobsWithMissingInserted.map(([jobName, job]) => liftJob(
    [jobName, job],
    [matrixVerificationJobEnhancer, workflowResultJobEnhancer],
    {inRangeNodeVersions: nodeEnginesMatrix, jobs}
  )));
}
