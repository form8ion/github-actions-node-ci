import {promises as fs} from 'fs';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import * as yamlWriter from '../thirdparty-wrappers/write-yaml';
import scaffoldConfig from './config-scaffolder';

suite('config scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(yamlWriter, 'default');
    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that the workflow file is defined', async () => {
    const projectRoot = any.string();
    const pathToCreatedWorkflowsDirectory = any.string();
    mkdir.default.withArgs(`${projectRoot}/.github/workflows`).resolves(pathToCreatedWorkflowsDirectory);

    await scaffoldConfig({projectRoot});

    assert.calledWith(
      yamlWriter.default,
      `${pathToCreatedWorkflowsDirectory}/node-ci.yml`,
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
              {uses: 'bahmutov/npm-install@v1'},
              {
                run: 'npm test',
                env: {CI: true}
              }
            ]
          }
        }
      }
    );
  });
});
