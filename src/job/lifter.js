import {lift as liftSteps} from '../steps/index.js';

export default function ([jobName, job], enhancers, options) {
  const enhancer = enhancers.find(({test}) => test({jobName}));

  const jobWithLiftedSteps = {...job, ...job.steps && {steps: liftSteps(job.steps)}};

  return [jobName, enhancer ? enhancer.lift(jobWithLiftedSteps, options) : jobWithLiftedSteps];
}
