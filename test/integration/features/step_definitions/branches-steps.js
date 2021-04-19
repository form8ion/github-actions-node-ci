import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';
import {load} from 'js-yaml';
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
  const triggers = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`)).on;

  assert.deepEqual(triggers.push.branches, [...this.existingBranches, ...this.additionalBranches]);
  assert.deepEqual(triggers.pull_request, this.prTriggerConfig);
});
