import {promises as fs} from 'fs';
import {dump} from 'js-yaml';
import {projectTypeShouldBePublished} from '@form8ion/javascript-core';
import mkdir from '../../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, projectType}) {
  return fs.writeFile(
    `${await mkdir(`${projectRoot}/.github/workflows`)}/node-ci.yml`,
    dump({
      name: 'Node.js CI',
      on: {
        push: {branches: ['master', ...projectTypeShouldBePublished(projectType) ? ['alpha', 'beta'] : []]},
        pull_request: {types: ['opened', 'synchronize']}
      },
      env: {
        FORCE_COLOR: 1,
        NPM_CONFIG_COLOR: 'always'
      },
      jobs: {
        verify: {
          'runs-on': 'ubuntu-latest',
          steps: [
            {uses: 'actions/checkout@v2'},
            {name: 'Setup node', uses: 'actions/setup-node@v2', with: {'node-version-file': '.nvmrc', cache: 'npm'}},
            {run: 'npm clean-install'},
            {run: 'npm test'}
          ]
        },
        ...projectTypeShouldBePublished(projectType) && {
          release: {
            needs: 'verify',
            'runs-on': 'ubuntu-latest',
            steps: [
              {uses: 'actions/checkout@v2'},
              {name: 'Setup node', uses: 'actions/setup-node@v2', with: {'node-version': 'lts/*', cache: 'npm'}},
              {run: 'npm clean-install'},
              {
                name: 'semantic-release',
                run: 'npx semantic-release',
                env: {
                  GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',        // eslint-disable-line no-template-curly-in-string
                  NPM_TOKEN: '${{ secrets.NPM_PUBLISH_TOKEN }}'       // eslint-disable-line no-template-curly-in-string
                }
              }
            ]
          }
        }
      }
    })
  );
}
