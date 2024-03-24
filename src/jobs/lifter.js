import buildNodeVersionMatrix from './node-version-matrix-builder.js';
import insertMissingJobs from './missing-job-inserter.js';
import {lift as liftJob} from '../job/index.js';

export default function (jobs, engines) {
  const nodeEnginesMatrix = buildNodeVersionMatrix(engines);

  const liftedJobs = Object.entries(jobs).map(([jobName, job]) => liftJob([jobName, job], nodeEnginesMatrix));

  return Object.fromEntries(insertMissingJobs(nodeEnginesMatrix, liftedJobs));
}
