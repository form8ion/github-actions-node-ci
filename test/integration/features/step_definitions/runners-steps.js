import {promises as fs} from 'node:fs';
import {load} from 'js-yaml';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Given('the project prefers to use the {string} runner', async function (runner) {
  this.preferredRunner = runner;
});

Then('the jobs use {string} as the runners', async function (runner) {
  const {jobs} = load(await fs.readFile(
    `${process.cwd()}/.github/workflows/node-ci.yml`,
    'utf-8'
  ));

  Object.values(jobs).forEach(job => {
    assert.equal(job['runs-on'], runner);
  });
});
