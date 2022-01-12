// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffold, lift, test} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

(async () => {
  await scaffold({
    projectRoot: process.cwd(),
    vcs: {
      owner: 'repo-owner',
      name: 'repo-name'
    }
  });

  await test({projectRoot: process.cwd()});

  await lift({projectRoot: process.cwd(), results: {branchesToVerify: ['foo', 'bar']}});
})();
