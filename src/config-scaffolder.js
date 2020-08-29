import {projectTypeShouldBePublished} from '@form8ion/javascript-core';
import mkdir from '../thirdparty-wrappers/make-dir';
import writeYaml from '../thirdparty-wrappers/write-yaml';

export default async function ({projectRoot, projectType}) {
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
        build: {
          'runs-on': 'ubuntu-latest',
          steps: [
            {uses: 'actions/checkout@v2'},
            {
              name: 'Setup node',
              uses: 'actions/setup-node@v1',
              with: {'node-version': '12.x'}
            },
            {uses: 'bahmutov/npm-install@v1'},
            {run: 'npm test'},
            ...projectTypeShouldBePublished(projectType)
              ? [{
                name: 'semantic-release',
                uses: 'cycjimmy/semantic-release-action@v2',
                env: {
                  GITHUB_TOKEN: '${{ secrets.GH_TOKEN }}',            // eslint-disable-line no-template-curly-in-string
                  NPM_TOKEN: '${{ secrets.NPM_PUBLISH_TOKEN }}'       // eslint-disable-line no-template-curly-in-string
                }
              }]
              : []
          ]
        }
      }
    }
  );
}
