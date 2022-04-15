import {resolve} from 'path';

import {After, Before, Then, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {assert} from 'chai';
import td from 'testdouble';

const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(async function () {
  this.existingBranches = any.listOf(any.word);

  this.jsCore = td.replace('@form8ion/javascript-core');

  stubbedFs({
    node_modules: stubbedNodeModules,
    'package.json': JSON.stringify({})
  });
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

When('the project is lifted', async function () {
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  const {lift, test} = require('@form8ion/github-actions-node-ci');

  const projectRoot = process.cwd();

  if (await test({projectRoot})) {
    this.results = await lift({projectRoot, results: {branchesToVerify: this.additionalBranches}});
  }
});

Then('empty results are returned', async function () {
  assert.deepEqual(this.results, {});
});
