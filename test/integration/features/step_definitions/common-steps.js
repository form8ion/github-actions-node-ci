import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import * as td from 'testdouble';

const __dirname = dirname(fileURLToPath(import.meta.url));        // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

let lift, test, scaffold;

Before(async function () {
  this.existingBranches = any.listOf(any.word);
  this.projectRoot = process.cwd();
  this.vcsOwner = any.word();
  this.vcsName = any.word();

  this.jsCore = await td.replaceEsm('@form8ion/javascript-core');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, test, scaffold} = await import('@form8ion/github-actions-node-ci'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    'package.json': JSON.stringify({})
  });
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

When('the project is scaffolded', async function () {
  this.results = await scaffold({
    projectRoot: this.projectRoot,
    vcs: {owner: this.vcsOwner, name: this.vcsName},
    ...this.preferredRunner && {runner: this.preferredRunner}
  });
});

When('the project is lifted', async function () {
  if (await test({projectRoot: this.projectRoot})) {
    this.results = await lift({
      projectRoot: this.projectRoot,
      results: {branchesToVerify: this.additionalBranches},
      vcs: {owner: this.vcsOwner, name: this.vcsName},
      ...this.preferredRunner && {runner: this.preferredRunner}
    });
  }
});
