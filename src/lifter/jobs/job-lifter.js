import liftSteps from './steps-lifter';

function enginesShouldBeUpdated(inRangeNodeVersions, job) {
  return inRangeNodeVersions && job.strategy?.matrix?.node;
}

export default function ([jobName, job], inRangeNodeVersions) {
  return [
    jobName,
    {
      ...job,
      steps: liftSteps(job.steps),
      ...enginesShouldBeUpdated(inRangeNodeVersions, job) && {strategy: {matrix: {node: inRangeNodeVersions}}}
    }
  ];
}
