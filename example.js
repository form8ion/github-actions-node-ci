// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffold, lift, test} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs({'package.json': JSON.stringify({})});

// #### Execute

(async () => {
  await scaffold({
    projectRoot: process.cwd(),
    vcs: {
      owner: 'repo-owner',
      name: 'repo-name'
    },
    runner: 'hosted-runner-name'    // optional. uses `ubuntu-latest` if not provided
  });

  await test({projectRoot: process.cwd()});

  await lift({
    projectRoot: process.cwd(),
    results: {branchesToVerify: ['foo', 'bar']},
    vcs: {owner: 'repo-owner', name: 'repo-name'}
  });
})();
