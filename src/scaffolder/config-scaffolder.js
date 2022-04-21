import {promises as fs} from 'fs';
import {dump} from 'js-yaml';

import mkdir from '../../thirdparty-wrappers/make-dir';
import {checkout, setupNode, installDependencies, executeVerification} from '../steps/scaffolders';

export default async function ({projectRoot}) {
  return fs.writeFile(
    `${await mkdir(`${projectRoot}/.github/workflows`)}/node-ci.yml`,
    dump({
      name: 'Node.js CI',
      on: {
        push: {branches: ['master']},
        pull_request: {types: ['opened', 'synchronize']}
      },
      env: {
        FORCE_COLOR: 1,
        NPM_CONFIG_COLOR: 'always'
      },
      jobs: {
        verify: {
          'runs-on': 'ubuntu-latest',
          steps: [checkout(), setupNode({versionDeterminedBy: 'nvmrc'}), installDependencies(), executeVerification()]
        }
      }
    })
  );
}
