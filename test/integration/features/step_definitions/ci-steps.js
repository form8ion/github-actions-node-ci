import {promises as fs} from 'fs';
import makeDir from 'make-dir';
import {Before, Given, Then} from '@cucumber/cucumber';
import {dump, load} from 'js-yaml';
import {assert} from 'chai';
import any from '@travi/any';

export const pathToWorkflowsDirectory = `${process.cwd()}/.github/workflows`;

Before(async function () {
  this.prTriggerConfig = any.simpleObject();
});

Given('a CI workflow exists', async function () {
  const workflowsDirectory = await makeDir(pathToWorkflowsDirectory);

  await fs.writeFile(
    `${workflowsDirectory}/node-ci.yml`,
    dump({
      on: {
        push: {branches: this.existingBranches},
        pull_request: this.prTriggerConfig
      },
      jobs: {}
    })
  );
});

Then('the ci config remains unchanged', async function () {
  const {on: triggers, jobs} = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.deepEqual(triggers.push.branches, this.existingBranches);
  assert.deepEqual(triggers.pull_request, this.prTriggerConfig);

  if (this.existingJobName) {
    assert.deepEqual(jobs[this.existingJobName].steps, this.existingJobSteps);
  }
});
