import liftSteps from './steps-lifter';

export default function ([jobName, job]) {
  return [jobName, {...job, steps: liftSteps(job.steps)}];
}
