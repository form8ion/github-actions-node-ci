import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {loadWorkflowFile} from '@form8ion/github-workflows-core';

Given('the project prefers to use the {string} runner', async function (runner) {
  this.preferredRunner = runner;
});

Then('the jobs use {string} as the runners', async function (runner) {
  const {jobs} = await loadWorkflowFile({projectRoot: this.projectRoot, name: 'node-ci'});

  Object.values(jobs).forEach(job => {
    assert.equal(job['runs-on'], runner);
  });
});
