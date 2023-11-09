import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import * as td from 'testdouble';

const __dirname = dirname(fileURLToPath(import.meta.url));        // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

let lift, test;

Before(async function () {
  this.existingBranches = any.listOf(any.word);

  this.jsCore = await td.replaceEsm('@form8ion/javascript-core');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({lift, test} = await import('@form8ion/github-actions-node-ci'));

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
  const projectRoot = process.cwd();

  if (await test({projectRoot})) {
    this.vcsOwner = any.word();
    this.vcsName = any.word();

    this.results = await lift({
      projectRoot,
      results: {branchesToVerify: this.additionalBranches},
      vcs: {owner: this.vcsOwner, name: this.vcsName}
    });
  }
});
