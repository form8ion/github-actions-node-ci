import {loadWorkflowFile, writeWorkflowFile} from '@form8ion/github-workflows-core';

import {Given} from '@cucumber/cucumber';
import any from '@travi/any';

Given('a reusable workflow is called', async function () {
  const existingWorkflowDetails = await loadWorkflowFile({projectRoot: this.projectRoot, name: 'node-ci'});

  await writeWorkflowFile({
    projectRoot: this.projectRoot,
    name: 'node-ci',
    config: {...existingWorkflowDetails, jobs: {...existingWorkflowDetails.jobs, [any.word()]: {uses: any.string()}}}
  });
});
