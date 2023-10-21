import {promises as fs} from 'fs';
import makeDir from 'make-dir';
import {dump} from 'js-yaml';

import any from '@travi/any';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import scaffoldConfig from './config-scaffolder.js';

vi.mock('fs');
vi.mock('make-dir');
vi.mock('js-yaml');

describe('config scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should define the workflow file', async () => {
    const projectRoot = any.string();
    const projectType = any.word();
    const pathToCreatedWorkflowsDirectory = any.string();
    const dumpedYaml = any.string();
    when(makeDir).calledWith(`${projectRoot}/.github/workflows`).mockResolvedValue(pathToCreatedWorkflowsDirectory);
    when(dump).calledWith({
      name: 'Node.js CI',
      on: {
        push: {branches: ['master']},
        pull_request: {types: ['opened', 'synchronize']}
      },
      env: {
        FORCE_COLOR: 1,
        NPM_CONFIG_COLOR: 'always'
      },
      permissions: {contents: 'read'},
      jobs: {
        verify: {
          'runs-on': 'ubuntu-latest',
          steps: [
            {uses: 'actions/checkout@v3'},
            {name: 'Setup node', uses: 'actions/setup-node@v3', with: {'node-version-file': '.nvmrc', cache: 'npm'}},
            {run: 'npm clean-install'},
            {run: 'npm audit signatures'},
            {run: 'npm test'}
          ]
        }
      }
    }).mockReturnValue(dumpedYaml);

    await scaffoldConfig({projectRoot, projectType});

    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedWorkflowsDirectory}/node-ci.yml`, dumpedYaml);
  });
});
