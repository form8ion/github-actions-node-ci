import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

import {pathToWorkflowsDirectory} from './ci-steps';

const pathToCiWorkflow = `${pathToWorkflowsDirectory}/node-ci.yml`;

Given('the nvmrc is referenced using the modern property', async function () {
  this.existingJobName = any.word();
  this.existingJobSteps = [
    {uses: 'actions/checkout@v3'},
    {
      name: 'Setup node',
      uses: 'actions/setup-node@v3',
      with: {'node-version-file': '.nvmrc'}
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

Given('the node version is based on a matrix', async function () {
  this.existingJobName = any.word();
  this.existingJobSteps = [
    {uses: 'actions/checkout@v3'},
    {
      name: 'Setup node',
      uses: 'actions/setup-node@v3',
      with: {'node-version': '${{ matrix.node_version }}'}      // eslint-disable-line no-template-curly-in-string
    },
    {run: 'npm clean-install'}
  ];

  const ciWorkflow = load(await fs.readFile(pathToCiWorkflow, 'utf-8'));

  ciWorkflow.jobs[this.existingJobName] = {steps: this.existingJobSteps};

  await fs.writeFile(pathToCiWorkflow, dump(ciWorkflow));
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
