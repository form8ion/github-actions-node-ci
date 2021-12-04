import * as jsCore from '@form8ion/javascript-core';
import {promises as fs} from 'fs';
import jsYaml from 'js-yaml';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import * as mkdir from '../../thirdparty-wrappers/make-dir';
import scaffoldConfig from './config-scaffolder';

suite('config scaffolder', () => {
  let sandbox;
  const projectType = any.word();
  const tests = any.simpleObject();
  const visibility = any.word();
  const dumpedYaml = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(jsYaml, 'dump');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(jsCore, 'projectTypeShouldBePublished');
    sandbox.stub(jsCore, 'coverageShouldBeReported');
  });

  teardown(() => sandbox.restore());

  test('that the workflow file is defined', async () => {
    const projectRoot = any.string();
    const pathToCreatedWorkflowsDirectory = any.string();
    mkdir.default.withArgs(`${projectRoot}/.github/workflows`).resolves(pathToCreatedWorkflowsDirectory);
    jsCore.projectTypeShouldBePublished.returns(false);
    jsCore.coverageShouldBeReported.returns(false);
    jsYaml.dump
      .withArgs({
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
            steps: [
              {uses: 'actions/checkout@v2'},
              {name: 'Setup node', uses: 'actions/setup-node@v2', with: {'node-version-file': '.nvmrc'}},
              {uses: 'bahmutov/npm-install@v1'},
              {run: 'npm test'}
            ]
          }
        }
      })
      .returns(dumpedYaml);

    await scaffoldConfig({projectRoot, projectType});

    assert.calledWith(fs.writeFile, `${pathToCreatedWorkflowsDirectory}/node-ci.yml`, dumpedYaml);
  });

  test('that package publishing happens for appropriate project types', async () => {
    const projectRoot = any.string();
    const pathToCreatedWorkflowsDirectory = any.string();
    mkdir.default.withArgs(`${projectRoot}/.github/workflows`).resolves(pathToCreatedWorkflowsDirectory);
    jsCore.projectTypeShouldBePublished.withArgs(projectType).returns(true);
    jsCore.coverageShouldBeReported.returns(false);
    jsYaml.dump
      .withArgs({
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
          verify: {
            'runs-on': 'ubuntu-latest',
            steps: [
              {uses: 'actions/checkout@v2'},
              {name: 'Setup node', uses: 'actions/setup-node@v2', with: {'node-version-file': '.nvmrc'}},
              {uses: 'bahmutov/npm-install@v1'},
              {run: 'npm test'}
            ]
          },
          release: {
            needs: 'verify',
            'runs-on': 'ubuntu-latest',
            steps: [
              {uses: 'actions/checkout@v2'},
              {
                name: 'Setup node',
                uses: 'actions/setup-node@v2',
                with: {'node-version': 'lts/*'}
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
      })
      .returns(dumpedYaml);

    await scaffoldConfig({projectRoot, projectType});

    assert.calledWith(fs.writeFile, `${pathToCreatedWorkflowsDirectory}/node-ci.yml`, dumpedYaml);
  });

  test('that coverage is reported when appropriate', async () => {
    const projectRoot = any.string();
    const pathToCreatedWorkflowsDirectory = any.string();
    mkdir.default.withArgs(`${projectRoot}/.github/workflows`).resolves(pathToCreatedWorkflowsDirectory);
    jsCore.projectTypeShouldBePublished.returns(false);
    jsCore.coverageShouldBeReported.withArgs(visibility, tests).returns(true);
    jsYaml.dump
      .withArgs({
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
            steps: [
              {uses: 'actions/checkout@v2'},
              {name: 'Setup node', uses: 'actions/setup-node@v2', with: {'node-version-file': '.nvmrc'}},
              {uses: 'bahmutov/npm-install@v1'},
              {run: 'npm test'},
              {
                name: 'Upload coverage data to Codecov',
                run: 'npm run coverage:report'
              }
            ]
          }
        }
      })
      .returns(dumpedYaml);

    await scaffoldConfig({projectRoot, projectType, tests, visibility});

    assert.calledWith(fs.writeFile, `${pathToCreatedWorkflowsDirectory}/node-ci.yml`, dumpedYaml);
  });
});
