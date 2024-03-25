import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';

import {scaffold as scaffoldBadges} from '../badges/index.js';
import {lift as liftJobs} from '../jobs/index.js';
import mergeBranches from './branches/merge-branches.js';

export default async function ({projectRoot, results: {branchesToVerify}, vcs, runner}) {
  const pathToConfig = `${projectRoot}/.github/workflows/node-ci.yml`;
  const existingConfig = load(await fs.readFile(pathToConfig, 'utf-8'));
  const {engines} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));
  const existingBranches = existingConfig.on.push.branches;

  await fs.writeFile(
    pathToConfig,
    dump({
      ...existingConfig,
      ...branchesToVerify && {
        on: {...existingConfig.on, push: {branches: mergeBranches(existingBranches, branchesToVerify)}}
      },
      permissions: {contents: 'read'},
      jobs: liftJobs({jobs: existingConfig.jobs, engines, runner})
    })
  );

  return {badges: scaffoldBadges({vcs})};
}
