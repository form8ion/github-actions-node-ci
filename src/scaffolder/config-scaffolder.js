import {promises as fs} from 'node:fs';
import {writeWorkflowFile} from '@form8ion/github-workflows-core';

import {nvmrcVerification} from '../jobs/scaffolder.js';

export default async function ({projectRoot, runner}) {
  await fs.mkdir(`${projectRoot}/.github/workflows`, {recursive: true});

  return writeWorkflowFile({
    projectRoot,
    name: 'node-ci',
    config: {
      name: 'Node.js CI',
      on: {
        push: {branches: ['master']},
        pull_request: {types: ['opened', 'synchronize']}
      },
      env: {
        FORCE_COLOR: 1,
        NPM_CONFIG_COLOR: 'always'
      },
      permissions: {contents: 'read'},
      jobs: {verify: nvmrcVerification({runner})}
    }
  });
}
