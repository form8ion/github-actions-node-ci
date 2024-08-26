import {promises as fs} from 'node:fs';
import {writeWorkflowFile} from '@form8ion/github-workflows-core';

import any from '@travi/any';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {when} from 'jest-when';

import {nvmrcVerification} from '../jobs/scaffolder.js';
import scaffoldConfig from './config-scaffolder.js';

vi.mock('fs');
vi.mock('js-yaml');
vi.mock('@form8ion/github-workflows-core');
vi.mock('../jobs/scaffolder.js');

describe('config scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should define the workflow file', async () => {
    const projectRoot = any.string();
    const projectType = any.word();
    const runner = any.word();
    const verifyJob = any.simpleObject();
    when(nvmrcVerification).calledWith({runner}).mockReturnValue(verifyJob);

    await scaffoldConfig({projectRoot, projectType, runner});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github/workflows`, {recursive: true});
    expect(writeWorkflowFile).toHaveBeenCalledWith({
      projectRoot,
      name: 'node-ci',
      config: {
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
        jobs: {verify: verifyJob}
      }
    });
  });
});
