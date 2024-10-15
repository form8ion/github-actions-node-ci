import {scaffold as scaffoldWorkflowResultJob} from './workflow-result/index.js';
import {scaffold as scaffoldMatrixVerificationJob} from './verify-matrix/index.js';

function noMatrixJobExistsIn(jobs) {
  return !jobs.filter(([, job]) => job.strategy?.matrix?.node).length;
}

function resultJobAlreadyExists(jobs) {
  return jobs.some(([jobName]) => 'workflow-result' === jobName);
}

export default function ({versions: matrixOfNodeVersions, jobs, runner}) {
  if (matrixOfNodeVersions && noMatrixJobExistsIn(jobs)) {
    return [['verify-matrix', scaffoldMatrixVerificationJob({versions: matrixOfNodeVersions, runner})], ...jobs];
  }

  if (!resultJobAlreadyExists(jobs)) return [...jobs, ['workflow-result', scaffoldWorkflowResultJob({runner})]];

  return jobs;
}
