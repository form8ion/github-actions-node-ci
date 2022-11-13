import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';

import {Given} from '@cucumber/cucumber';
import any from '@travi/any';

import {pathToWorkflowsDirectory} from './ci-steps';

Given('a reusable workflow is called', async function () {
  const pathToCiWorkflow = `${pathToWorkflowsDirectory}/node-ci.yml`;

  const existingWorkflowDetails = load(await fs.readFile(pathToCiWorkflow, 'utf-8'));

  await fs.writeFile(
    pathToCiWorkflow,
    dump({...existingWorkflowDetails, jobs: {...existingWorkflowDetails.jobs, [any.word()]: {uses: any.string()}}})
  );
});
