// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {projectTypes} from '@form8ion/javascript-core';
import {scaffold} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

(async () => {
  await scaffold({
    projectRoot: process.cwd(),
    projectType: projectTypes.PACKAGE,
    vcs: {
      owner: 'repo-owner',
      name: 'repo-name'
    }
  });
})();
