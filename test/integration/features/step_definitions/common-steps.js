import {resolve} from 'path';
import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import {safeDump} from 'js-yaml';
import any from '@travi/any';
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {lift} from '@form8ion/github-actions-node-ci';

const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(async function () {
  this.existingBranches = any.listOf(any.word);

  stubbedFs({
    node_modules: stubbedNodeModules,
    '.github': {
      workflows: {
        'node-ci.yml': safeDump({on: {push: {branches: this.existingBranches}}})
      }
    }
  });
});

After(function () {
  stubbedFs.restore();
});

When('the project is lifted', async function () {
  await lift({projectRoot: process.cwd(), branchesToVerify: this.additionalBranches});
});
