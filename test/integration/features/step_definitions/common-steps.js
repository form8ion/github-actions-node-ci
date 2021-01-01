import {resolve} from 'path';
import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {lift, test} from '@form8ion/github-actions-node-ci';

const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(async function () {
  this.existingBranches = any.listOf(any.word);

  stubbedFs({
    node_modules: stubbedNodeModules
  });
});

After(function () {
  stubbedFs.restore();
});

When('the project is lifted', async function () {
  const projectRoot = process.cwd();

  if (await test({projectRoot})) {
    await lift({projectRoot, results: {branchesToVerify: this.additionalBranches}});
  }
});
