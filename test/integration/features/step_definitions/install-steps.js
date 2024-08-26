import {promises as fs} from 'fs';
import {load} from 'js-yaml';
import {writeWorkflowFile} from '@form8ion/github-workflows-core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

import {pathToWorkflowsDirectory} from './ci-steps.js';

const pathToCiWorkflow = `${pathToWorkflowsDirectory}/node-ci.yml`;

Given('the legacy action is in use for installing dependencies', async function () {
  this.existingJobName = any.word();
  this.existingJobSteps = [
    {uses: 'actions/checkout@v3'},
    {
      name: 'Setup node',
      uses: 'actions/setup-node@v3',
      with: {'node-version-file': '.npmrc'}
    },
    {uses: 'bahmutov/npm-install@v1'}
  ];

  const ciWorkflow = load(await fs.readFile(pathToCiWorkflow, 'utf-8'));

  ciWorkflow.jobs[this.existingJobName] = {steps: this.existingJobSteps};

  await writeWorkflowFile({projectRoot: this.projectRoot, name: 'node-ci', config: ciWorkflow});
});

Then('the legacy action is replaced with direct installation', async function () {
  const {
    jobs: {[this.existingJobName]: existingJob}
  } = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.notDeepInclude(existingJob.steps, {uses: 'bahmutov/npm-install@v1'});
  assert.deepInclude(existingJob.steps, {run: 'npm clean-install'});
});
