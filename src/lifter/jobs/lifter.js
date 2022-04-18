import buildNodeVersionMatrix from './node-version-matrix-builder';
import liftJob from './job-lifter';

export default function (jobs, engines) {
  const nodeEnginesMatrix = buildNodeVersionMatrix(engines);

  return Object.fromEntries(Object.entries(jobs).map(([jobName, job]) => liftJob([jobName, job], nodeEnginesMatrix)));
}
