import buildNodeVersionMatrix from './node-version-matrix-builder.js';
import insertMissingJobs from './missing-job-inserter.js';
import * as matrixVerificationJobEnhancer from './verify-matrix/index.js';
import {lift as liftJob} from '../job/index.js';

export default function ({jobs, engines, runner}) {
  const nodeEnginesMatrix = buildNodeVersionMatrix(engines);

  const liftedJobs = Object.entries(jobs).map(([jobName, job]) => liftJob(
    [jobName, job],
    [matrixVerificationJobEnhancer],
    {inRangeNodeVersions: nodeEnginesMatrix}
  ));

  return Object.fromEntries(insertMissingJobs({versions: nodeEnginesMatrix, jobs: liftedJobs, runner}));
}
