import {loadWorkflowFile} from '@form8ion/github-workflows-core';

import {Given, Then} from '@cucumber/cucumber';
import any from '@travi/any';
import {assert} from 'chai';

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
  const {on: triggers} = await loadWorkflowFile({projectRoot: this.projectRoot, name: 'node-ci'});

  assert.deepEqual(triggers.push.branches, [...this.existingBranches, ...this.additionalBranches]);
  assert.deepEqual(triggers.pull_request, this.prTriggerConfig);
});
