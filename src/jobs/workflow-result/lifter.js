export default function (job, {jobs}) {
  if (!Object.keys(jobs).includes('verify-matrix')) return job;

  return {...job, needs: ['verify', 'verify-matrix']};
}
