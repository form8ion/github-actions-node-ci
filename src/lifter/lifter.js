import {promises as fs} from 'fs';
import {loadWorkflowFile, writeWorkflowFile} from '@form8ion/github-workflows-core';

import {scaffold as scaffoldBadges} from '../badges/index.js';
import {lift as liftJobs} from '../jobs/index.js';
import mergeBranches from './branches/merge-branches.js';

export default async function ({projectRoot, results: {branchesToVerify}, vcs, runner}) {
  const existingConfig = await loadWorkflowFile({projectRoot, name: 'node-ci'});
  const {engines} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));
  const existingBranches = existingConfig.on.push.branches;

  await writeWorkflowFile({
    projectRoot,
    name: 'node-ci',
    config: {
      ...existingConfig,
      ...branchesToVerify && {
        on: {...existingConfig.on, push: {branches: mergeBranches(existingBranches, branchesToVerify)}}
      },
      permissions: {contents: 'read'},
      jobs: liftJobs({jobs: existingConfig.jobs, engines, runner})
    }
  });

  return {badges: scaffoldBadges({vcs})};
}
