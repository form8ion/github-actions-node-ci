import {promises as fs} from 'node:fs';
import {
  loadWorkflowFile,
  scaffoldCheckoutStep,
  scaffoldDependencyInstallationStep,
  scaffoldNodeSetupStep,
  scaffoldVerificationStep,
  writeWorkflowFile
} from '@form8ion/github-workflows-core';

import {Before, Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import any from '@travi/any';

const ciWorkflowName = 'node-ci';

Before(async function () {
  this.prTriggerConfig = any.simpleObject();

  this.injectedJobs = [];
});

Given('a CI workflow exists', async function () {
  await fs.mkdir(`${process.cwd()}/.github/workflows`, {recursive: true});

  await writeWorkflowFile({
    projectRoot: this.projectRoot,
    name: ciWorkflowName,
    config: {
      on: {
        push: {branches: this.existingBranches},
        pull_request: this.prTriggerConfig
      },
      jobs: {}
    }
  });
});

Given('a {string} job exists', async function (jobName) {
  const existingWorkflowContents = await loadWorkflowFile({projectRoot: this.projectRoot, name: ciWorkflowName});
  const job = any.simpleObject();

  this.injectedJobs[jobName] = job;

  await writeWorkflowFile({
    projectRoot: this.projectRoot,
    name: ciWorkflowName,
    config: {
      ...existingWorkflowContents,
      jobs: {
        ...existingWorkflowContents.jobs,
        [jobName]: job
      }
    }
  });
});

Then('the ci config remains unchanged', async function () {
  const {on: triggers, jobs} = await loadWorkflowFile({projectRoot: this.projectRoot, name: ciWorkflowName});

  assert.deepEqual(triggers.push.branches, this.existingBranches);
  assert.deepEqual(triggers.pull_request, this.prTriggerConfig);

  if (this.existingJobName) {
    assert.deepEqual(jobs[this.existingJobName].steps, this.existingJobSteps);
  }
});

Then('dependency caching is enabled', async function () {
  const {jobs} = await loadWorkflowFile({projectRoot: this.projectRoot, name: ciWorkflowName});

  const setupNodeStep = jobs[this.existingJobName].steps.find(step => 'Setup node' === step.name);
  assert.equal(setupNodeStep.with.cache, 'npm');
});

Then('the verification workflow is created', async function () {
  const {
    name,
    on: triggers,
    env,
    permissions,
    jobs
  } = await loadWorkflowFile({projectRoot: this.projectRoot, name: ciWorkflowName});

  assert.equal(name, 'Node.js CI');
  assert.deepEqual(
    triggers,
    {
      push: {branches: ['master']},
      pull_request: {types: ['opened', 'synchronize']}
    }
  );
  assert.deepEqual(env, {FORCE_COLOR: 1, NPM_CONFIG_COLOR: 'always'});
  assert.deepEqual(permissions, {contents: 'read'});
  assert.deepEqual(
    jobs.verify.steps,
    [
      scaffoldCheckoutStep(),
      scaffoldNodeSetupStep({versionDeterminedBy: 'nvmrc'}),
      ...scaffoldDependencyInstallationStep(),
      scaffoldVerificationStep()
    ]
  );
});

Then('the workflow-result job exists', async function () {
  const {jobs} = await loadWorkflowFile({projectRoot: this.projectRoot, name: ciWorkflowName});

  assert.include(Object.keys(jobs), 'workflow-result');
});

Then('the {string} job is unchanged', async function (jobName) {
  const {jobs} = await loadWorkflowFile({projectRoot: this.projectRoot, name: ciWorkflowName});

  assert.deepEqual(jobs[jobName], this.injectedJobs[jobName]);
});

Then('the workflow-result job depends on {string}', async function (jobName) {
  const {jobs} = await loadWorkflowFile({projectRoot: this.projectRoot, name: ciWorkflowName});

  assert.include(jobs['workflow-result'].needs, jobName);
});

Then('the workflow-result job uses {string} as the runner', async function (runner) {
  const {jobs} = await loadWorkflowFile({projectRoot: this.projectRoot, name: ciWorkflowName});
  const {'workflow-result': resultJob} = jobs;

  assert.equal(resultJob['runs-on'], runner);
});
