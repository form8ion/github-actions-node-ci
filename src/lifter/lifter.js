import {promises as fs} from 'fs';
import {safeDump, safeLoad} from 'js-yaml';
import mergeBranches from './merge-branches';

export default async function ({projectRoot, branchesToVerify}) {
  if (branchesToVerify) {
    const pathToConfig = `${projectRoot}/.github/workflows/node-ci.yml`;
    const existingConfig = safeLoad(await fs.readFile(pathToConfig, 'utf-8'));
    const existingBranches = existingConfig.on.push.branches;

    await fs.writeFile(
      pathToConfig,
      safeDump({...existingConfig, on: {push: {branches: mergeBranches(existingBranches, branchesToVerify)}}})
    );
  }
}
