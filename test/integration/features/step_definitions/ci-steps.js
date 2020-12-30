import {promises as fs} from 'fs';
import {Then} from '@cucumber/cucumber';
import {safeLoad} from 'js-yaml';
import {assert} from 'chai';

Then('the ci config remains unchanged', async function () {
  assert.deepEqual(
    safeLoad(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`)).on.push.branches,
    this.existingBranches
  );
});
