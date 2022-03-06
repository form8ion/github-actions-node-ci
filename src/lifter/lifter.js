import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';

import {lift as liftJobs} from './jobs';
import mergeBranches from './branches/merge-branches';

export default async function ({projectRoot, results: {branchesToVerify}}) {
  const pathToConfig = `${projectRoot}/.github/workflows/node-ci.yml`;
  const existingConfig = load(await fs.readFile(pathToConfig, 'utf-8'));
  const existingBranches = existingConfig.on.push.branches;

  await fs.writeFile(
    pathToConfig,
    dump({
      ...existingConfig,
      ...branchesToVerify && {
        on: {...existingConfig.on, push: {branches: mergeBranches(existingBranches, branchesToVerify)}}
      },
      jobs: liftJobs(existingConfig.jobs)
    })
  );

  return {};
}
