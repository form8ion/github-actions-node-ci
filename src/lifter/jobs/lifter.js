import buildNodeVersionMatrix from './node-version-matrix-builder';
import insertMissingJobs from './missing-job-inserter';
import liftJob from './job-lifter';

export default function (jobs, engines) {
  const nodeEnginesMatrix = buildNodeVersionMatrix(engines);

  const liftedJobs = Object.entries(jobs).map(([jobName, job]) => liftJob([jobName, job], nodeEnginesMatrix));

  return Object.fromEntries(insertMissingJobs(nodeEnginesMatrix, liftedJobs));
}
