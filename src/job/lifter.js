import {lift as liftSteps} from '../steps/index.js';

function enginesShouldBeUpdated(inRangeNodeVersions, job) {
  return inRangeNodeVersions && job.strategy?.matrix?.node;
}

export default function ([jobName, job], inRangeNodeVersions) {
  return [
    jobName,
    {
      ...job,
      ...job.steps && {steps: liftSteps(job.steps)},
      ...enginesShouldBeUpdated(inRangeNodeVersions, job) && {strategy: {matrix: {node: inRangeNodeVersions}}}
    }
  ];
}
