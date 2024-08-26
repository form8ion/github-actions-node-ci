import {promises as fs} from 'fs';
import {load} from 'js-yaml';
import {writeWorkflowFile} from '@form8ion/github-workflows-core';

import {Given} from '@cucumber/cucumber';
import any from '@travi/any';

import {pathToWorkflowsDirectory} from './ci-steps.js';

Given('a reusable workflow is called', async function () {
  const pathToCiWorkflow = `${pathToWorkflowsDirectory}/node-ci.yml`;

  const existingWorkflowDetails = load(await fs.readFile(pathToCiWorkflow, 'utf-8'));

  await writeWorkflowFile({
    projectRoot: this.projectRoot,
    name: 'node-ci',
    config: {...existingWorkflowDetails, jobs: {...existingWorkflowDetails.jobs, [any.word()]: {uses: any.string()}}}
  });
});
