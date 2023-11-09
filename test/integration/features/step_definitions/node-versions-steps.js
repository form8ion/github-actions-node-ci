import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';
import * as td from 'testdouble';

import {pathToWorkflowsDirectory} from './ci-steps.js';

const pathToCiWorkflow = `${pathToWorkflowsDirectory}/node-ci.yml`;

Given('the nvmrc is referenced using the modern property {string} caching enabled', async function (cachingEnabled) {
  this.existingJobName = any.word();
  this.existingJobSteps = [
    {uses: 'actions/checkout@v3'},
    {
      name: 'Setup node',
      uses: 'actions/setup-node@v3',
      with: {
        'node-version-file': '.nvmrc',
        ...'with' === cachingEnabled && {cache: 'npm'}
      }
    },
    {run: 'npm clean-install'}
  ];

  const ciWorkflow = load(await fs.readFile(pathToCiWorkflow, 'utf-8'));

  ciWorkflow.jobs[this.existingJobName] = {steps: this.existingJobSteps};

  await fs.writeFile(pathToCiWorkflow, dump(ciWorkflow));
});

Given('the version is read from the nvmrc and passed as a value to the setup-node step', async function () {
  this.existingJobName = any.word();
  this.existingJobSteps = [
    {uses: 'actions/checkout@v3'},
    {
      name: 'Read .nvmrc',
      run: 'echo ::set-output name=NVMRC::$(cat .nvmrc)',
      id: 'nvm'
    },
    {
      name: 'Setup node',
      uses: 'actions/setup-node@v3',
      with: {'node-version': '${{ steps.nvm.outputs.NVMRC }}'}    // eslint-disable-line no-template-curly-in-string
    },
    {run: 'npm clean-install'}
  ];

  const ciWorkflow = load(await fs.readFile(pathToCiWorkflow, 'utf-8'));

  ciWorkflow.jobs[this.existingJobName] = {steps: this.existingJobSteps};

  await fs.writeFile(pathToCiWorkflow, dump(ciWorkflow));
});

Given('the node version is based on a matrix {string} caching enabled', async function (cachingEnabled) {
  this.existingJobName = any.word();
  this.existingNodeVersions = any.listOf(any.integer);
  this.existingJobSteps = [
    {uses: 'actions/checkout@v3'},
    {
      name: 'Setup node',
      uses: 'actions/setup-node@v3',
      with: {
        'node-version': '${{ matrix.node }}',               // eslint-disable-line no-template-curly-in-string
        ...'with' === cachingEnabled && {cache: 'npm'}
      }
    },
    {run: 'npm clean-install'}
  ];

  const ciWorkflow = load(await fs.readFile(pathToCiWorkflow, 'utf-8'));

  ciWorkflow.jobs[this.existingJobName] = {
    strategy: {matrix: {node: this.existingNodeVersions}},
    steps: this.existingJobSteps
  };

  await fs.writeFile(pathToCiWorkflow, dump(ciWorkflow));
});

Given('the version is defined statically', async function () {
  this.existingJobName = any.word();
  this.existingJobSteps = [
    {uses: 'actions/checkout@v3'},
    {name: 'Setup node', uses: 'actions/setup-node@v3', with: {'node-version': '12.x'}},
    {run: 'npm clean-install'}
  ];

  const ciWorkflow = load(await fs.readFile(pathToCiWorkflow, 'utf-8'));

  ciWorkflow.jobs[this.existingJobName] = {steps: this.existingJobSteps};

  await fs.writeFile(pathToCiWorkflow, dump(ciWorkflow));
});

Given('a greater-than-minimum node version range is defined', async function () {
  this.minimumNodeVersion = `${any.integer()}.${any.integer()}`;
  this.inRangeNodeLtsMajorVersions = any.listOf(any.integer);
  const nodeVersionRange = `>=${this.minimumNodeVersion}`;

  const packageContents = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({...packageContents, engines: {node: nodeVersionRange}})
  );

  td.when(this.jsCore.determineSupportedNodeMajorVersions({withinRange: nodeVersionRange}))
    .thenReturn(this.inRangeNodeLtsMajorVersions);
});

Given('multiple node version ranges are defined', async function () {
  this.caretNodeVersion = `${any.integer()}.${any.integer()}.${any.integer()}`;
  this.minimumNodeVersion = `${any.integer()}.${any.integer()}`;
  this.inRangeNodeLtsMajorVersions = any.listOf(any.integer);
  const caretNodeVersionRange = `^${this.caretNodeVersion}`;
  const minimumNodeVersionRange = `>=${this.minimumNodeVersion}`;
  const nodeVersionRange = `${caretNodeVersionRange} || ${minimumNodeVersionRange}`;

  const packageContents = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({...packageContents, engines: {node: nodeVersionRange}})
  );

  td.when(this.jsCore.determineSupportedNodeMajorVersions({withinRange: caretNodeVersionRange}))
    .thenReturn([]);
  td.when(this.jsCore.determineSupportedNodeMajorVersions({withinRange: minimumNodeVersionRange}))
    .thenReturn(this.inRangeNodeLtsMajorVersions);
});

Then('the setup-node step is updated to reference the nvmrc file using the modern property', async function () {
  const {
    jobs: {[this.existingJobName]: existingJob}
  } = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.isEmpty(existingJob.steps.filter(step => 'nvm' === step.id));

  const setupNodeStep = existingJob.steps.find(step => 'Setup node' === step.name);
  assert.equal(setupNodeStep.with['node-version-file'], '.nvmrc');
  assert.isUndefined(setupNodeStep.with['node-version']);
});

Then('no matrix job is configured', async function () {
  const {jobs} = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.equal(Object.values(jobs).filter(job => job.strategy?.matrix).length, 0);
});

Then('the matrix job is unchanged', async function () {
  const {jobs} = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.deepEqual(
    jobs[this.existingJobName],
    {strategy: {matrix: {node: this.existingNodeVersions}}, steps: this.existingJobSteps}
  );
});

Then('a matrix job is added', async function () {
  const {jobs} = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));
  const {'verify-matrix': verifyMatrixJob} = jobs;
  const jobDefinitions = Object.values(jobs);

  assert.equal(jobDefinitions.length, 2);
  assert.equal(jobDefinitions.filter(job => job.strategy?.matrix).length, 1);
  assert.deepEqual(
    verifyMatrixJob,
    {
      'runs-on': 'ubuntu-latest',
      strategy: {matrix: {node: [`${this.minimumNodeVersion}.0`, ...this.inRangeNodeLtsMajorVersions]}},
      steps: [
        {uses: 'actions/checkout@v3'},
        {
          name: 'Setup node',
          uses: 'actions/setup-node@v3',
          with: {
            'node-version': '${{ matrix.node }}',             // eslint-disable-line no-template-curly-in-string
            cache: 'npm'
          }
        },
        {run: 'npm clean-install'},
        {run: 'npm audit signatures'},
        {run: 'npm test'}
      ]
    }
  );
});

Then('the matrix job is updated', async function () {
  const {jobs} = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.equal(Object.values(jobs).filter(job => job.strategy?.matrix).length, 1);
  assert.deepEqual(
    jobs[this.existingJobName].strategy.matrix.node,
    [
      ...this.caretNodeVersion ? [this.caretNodeVersion] : [],
      `${this.minimumNodeVersion}.0`,
      ...this.inRangeNodeLtsMajorVersions
    ]
  );
});
