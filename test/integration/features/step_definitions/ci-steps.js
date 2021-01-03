import {promises as fs} from 'fs';
import makeDir from 'make-dir';
import {Given, Then} from '@cucumber/cucumber';
import {dump, load} from 'js-yaml';
import {assert} from 'chai';

Given('a CI workflow exists', async function () {
  const workflowsDirectory = await makeDir(`${process.cwd()}/.github/workflows`);

  await fs.writeFile(
    `${workflowsDirectory}/node-ci.yml`,
    dump({on: {push: {branches: this.existingBranches}}})
  );
});

Then('the ci config remains unchanged', async function () {
  assert.deepEqual(
    load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`)).on.push.branches,
    this.existingBranches
  );
});
