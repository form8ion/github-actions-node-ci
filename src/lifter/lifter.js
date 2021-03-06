import {promises as fs} from 'fs';
import {dump, load} from 'js-yaml';
import mergeBranches from './merge-branches';

export default async function ({projectRoot, results: {branchesToVerify}}) {
  if (branchesToVerify) {
    const pathToConfig = `${projectRoot}/.github/workflows/node-ci.yml`;
    const existingConfig = load(await fs.readFile(pathToConfig, 'utf-8'));
    const existingBranches = existingConfig.on.push.branches;

    await fs.writeFile(
      pathToConfig,
      dump({...existingConfig, on: {push: {branches: mergeBranches(existingBranches, branchesToVerify)}}})
    );

    return {};
  }

  return {};
}
