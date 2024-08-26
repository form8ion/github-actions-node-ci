import {loadWorkflowFile, writeWorkflowFile} from '@form8ion/github-workflows-core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

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

  const ciWorkflow = await loadWorkflowFile({projectRoot: this.projectRoot, name: 'node-ci'});

  ciWorkflow.jobs[this.existingJobName] = {steps: this.existingJobSteps};

  await writeWorkflowFile({projectRoot: this.projectRoot, name: 'node-ci', config: ciWorkflow});
});

Then('the legacy action is replaced with direct installation', async function () {
  const {
    jobs: {[this.existingJobName]: existingJob}
  } = await loadWorkflowFile({projectRoot: this.projectRoot, name: 'node-ci'});

  assert.notDeepInclude(existingJob.steps, {uses: 'bahmutov/npm-install@v1'});
  assert.deepInclude(existingJob.steps, {run: 'npm clean-install'});
});
