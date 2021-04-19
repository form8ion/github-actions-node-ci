import {promises as fs} from 'fs';
import makeDir from 'make-dir';
import {Before, Given, Then} from '@cucumber/cucumber';
import {dump, load} from 'js-yaml';
import {assert} from 'chai';
import any from '@travi/any';

Before(async function () {
  this.prTriggerConfig = any.simpleObject();
});

Given('a CI workflow exists', async function () {
  const workflowsDirectory = await makeDir(`${process.cwd()}/.github/workflows`);

  await fs.writeFile(
    `${workflowsDirectory}/node-ci.yml`,
    dump({
      on: {
        push: {branches: this.existingBranches},
        pull_request: this.prTriggerConfig
      }
    })
  );
});

Then('the ci config remains unchanged', async function () {
  const triggers = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`)).on;

  assert.deepEqual(triggers.push.branches, this.existingBranches);
  assert.deepEqual(triggers.pull_request, this.prTriggerConfig);
});
