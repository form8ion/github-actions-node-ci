import {matrixVerification} from './scaffolder.js';

function noMatrixJobExistsIn(jobs) {
  return !jobs.filter(([, job]) => job.strategy?.matrix?.node).length;
}

export default function ({versions: matrixOfNodeVersions, jobs, runner}) {
  if (matrixOfNodeVersions && noMatrixJobExistsIn(jobs)) {
    return [['verify-matrix', matrixVerification({versions: matrixOfNodeVersions, runner})], ...jobs];
  }

  return jobs;
}
