import {scaffold as scaffoldWorkflowResultJob} from './workflow-result/index.js';
import {matrixVerification} from './scaffolder.js';

function noMatrixJobExistsIn(jobs) {
  return !jobs.filter(([, job]) => job.strategy?.matrix?.node).length;
}

function resultJobAlreadyExists(jobs) {
  return jobs.some(([jobName]) => 'workflow-result' === jobName);
}

export default function ({versions: matrixOfNodeVersions, jobs, runner}) {
  if (matrixOfNodeVersions && noMatrixJobExistsIn(jobs)) {
    return [['verify-matrix', matrixVerification({versions: matrixOfNodeVersions, runner})], ...jobs];
  }

  if (!resultJobAlreadyExists(jobs)) return [...jobs, ['workflow-result', scaffoldWorkflowResultJob()]];

  return jobs;
}
