import * as jsCore from '@form8ion/javascript-core';
import {promises as fs} from 'fs';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import * as yamlWriter from '../thirdparty-wrappers/write-yaml';
import scaffoldConfig from './config-scaffolder';

suite('config scaffolder', () => {
  let sandbox;
  const projectType = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(yamlWriter, 'default');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(jsCore, 'projectTypeShouldBePublished');
  });

  teardown(() => sandbox.restore());

  test('that the workflow file is defined', async () => {
    const projectRoot = any.string();
    const pathToCreatedWorkflowsDirectory = any.string();
    mkdir.default.withArgs(`${projectRoot}/.github/workflows`).resolves(pathToCreatedWorkflowsDirectory);
    jsCore.projectTypeShouldBePublished.withArgs(projectType).returns(false);

    await scaffoldConfig({projectRoot, projectType});

    assert.calledWith(
      yamlWriter.default,
      `${pathToCreatedWorkflowsDirectory}/node-ci.yml`,
      {
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
              {run: 'npm test'}
            ]
          }
        }
      }
    );
  });

  test('that publishing for appropriate project types', async () => {
    const projectRoot = any.string();
    const pathToCreatedWorkflowsDirectory = any.string();
    mkdir.default.withArgs(`${projectRoot}/.github/workflows`).resolves(pathToCreatedWorkflowsDirectory);
    jsCore.projectTypeShouldBePublished.withArgs(projectType).returns(true);

    await scaffoldConfig({projectRoot, projectType});

    assert.calledWith(
      yamlWriter.default,
      `${pathToCreatedWorkflowsDirectory}/node-ci.yml`,
      {
        name: 'Node.js CI',
        on: {
          push: {branches: ['master', 'alpha', 'beta']},
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
              {
                name: 'semantic-release',
                uses: 'cycjimmy/semantic-release-action@v2',
                env: {
                  GITHUB_TOKEN: '${{ secrets.GH_TOKEN }}',            // eslint-disable-line no-template-curly-in-string
                  NPM_TOKEN: '${{ secrets.NPM_PUBLISH_TOKEN }}'       // eslint-disable-line no-template-curly-in-string
                }
              }
            ]
          }
        }
      }
    );
  });
});
