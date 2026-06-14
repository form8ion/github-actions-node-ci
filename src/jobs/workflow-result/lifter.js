export default function liftWorkflowResult(job, {jobs}) {
  if (!Object.keys(jobs).includes('verify-matrix')) return job;

  const requiredNeeds = ['verify', 'verify-matrix'];

  return {...job, needs: [...new Set([...job.needs || [], ...requiredNeeds])]};
}
