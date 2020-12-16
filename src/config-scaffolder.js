import {coverageShouldBeReported, projectTypeShouldBePublished} from '@form8ion/javascript-core';
import mkdir from '../thirdparty-wrappers/make-dir';
import writeYaml from '../thirdparty-wrappers/write-yaml';

export default async function ({projectRoot, projectType, tests, visibility}) {
  return writeYaml(
    `${await mkdir(`${projectRoot}/.github/workflows`)}/node-ci.yml`,
    {
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
            {
              name: 'Read .nvmrc',
              run: 'echo ::set-output name=NVMRC::$(cat .nvmrc)',
              id: 'nvm'
            },
            {
              name: 'Setup node',
              uses: 'actions/setup-node@v2',
              with: {
                'node-version': '${{ steps.nvm.outputs.NVMRC }}'      // eslint-disable-line no-template-curly-in-string
              }
            },
            {uses: 'bahmutov/npm-install@v1'},
            {run: 'npm test'},
            ...coverageShouldBeReported(visibility, tests)
              ? [{
                name: 'Upload coverage data to Codecov',
                run: 'npm run coverage:report'
              }] : []
          ]
        },
        ...projectTypeShouldBePublished(projectType) && {
          release: {
            needs: 'verify',
            'runs-on': 'ubuntu-latest',
            steps: [
              {uses: 'actions/checkout@v2'},
              {
                name: 'Read .nvmrc',
                run: 'echo ::set-output name=NVMRC::$(cat .nvmrc)',
                id: 'nvm'
              },
              {
                name: 'Setup node',
                uses: 'actions/setup-node@v2',
                with: {
                  'node-version': '${{ steps.nvm.outputs.NVMRC }}'    // eslint-disable-line no-template-curly-in-string
                }
              },
              {uses: 'bahmutov/npm-install@v1'},
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
    }
  );
}
