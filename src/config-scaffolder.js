import mkdir from '../thirdparty-wrappers/make-dir';
import writeYaml from '../thirdparty-wrappers/write-yaml';

export default async function ({projectRoot}) {
  return writeYaml(
    `${await mkdir(`${projectRoot}/.github/workflows`)}/node-ci.yml`,
    {
      name: 'Node.js CI',
      on: {
        push: {branches: ['master']},
        pull_request: {branches: ['master']}
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
            {run: 'npm clean-install'},
            {
              run: 'npm test',
              env: {CI: true}
            }
          ]
        }
      }
    }
  );
}
