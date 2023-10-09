import {matrixVerification} from '../../jobs/scaffolder.js';

function noMatrixJobExistsIn(jobs) {
  return !jobs.filter(([, job]) => job.strategy?.matrix?.node).length;
}

export default function (matrixOfNodeVersions, jobs) {
  if (matrixOfNodeVersions && noMatrixJobExistsIn(jobs)) {
    return [['verify-matrix', matrixVerification(matrixOfNodeVersions)], ...jobs];
  }

  return jobs;
}
