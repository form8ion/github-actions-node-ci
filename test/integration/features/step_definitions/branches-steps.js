import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';
import {safeLoad} from 'js-yaml';
import {promises as fs} from 'fs';

Given('additional branches are provided', async function () {
  this.additionalBranches = any.listOf(any.word);
});

Given('no additional branches are defined', async function () {
  this.additionalBranches = undefined;
});

Given('existing branches are provided as additional branches', async function () {
  this.additionalBranches = this.existingBranches;
});

Then('the branches are added to the ci config', async function () {
  assert.deepEqual(
    safeLoad(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`)).on.push.branches,
    [...this.existingBranches, ...this.additionalBranches]
  );
});
