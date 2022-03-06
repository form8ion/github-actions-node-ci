import liftJob from './job-lifter';

export default function (jobs) {
  return Object.fromEntries(Object.entries(jobs).map(liftJob));
}
