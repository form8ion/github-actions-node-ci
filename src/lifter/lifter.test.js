import {promises as fs} from 'node:fs';
import jsYaml from 'js-yaml';
import {writeWorkflowFile} from '@form8ion/github-workflows-core';

import {afterEach, beforeEach, describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as scaffoldBadges} from '../badges/index.js';
import mergeBranchList from './branches/merge-branches.js';
import {lift as liftJobs} from '../jobs/index.js';
import lift from './lifter.js';

vi.mock('node:fs');
vi.mock('js-yaml');
vi.mock('@form8ion/github-workflows-core');
vi.mock('./branches/merge-branches');
vi.mock('../jobs/index.js');
vi.mock('../badges');

describe('lifter', () => {
  const projectRoot = any.string();
  const rawExistingConfig = any.string();
  const existingJobs = any.listOf(any.simpleObject);
  const liftedJobs = any.listOf(any.simpleObject);
  const enginesDefinition = any.simpleObject();
  const badgesResults = any.simpleObject();
  const vcs = any.simpleObject();
  const runner = any.word();

  beforeEach(() => {
    when(fs.readFile)
      .calledWith(`${projectRoot}/.github/workflows/node-ci.yml`, 'utf-8')
      .mockResolvedValue(rawExistingConfig);
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify({engines: enginesDefinition}));
    when(liftJobs).calledWith({jobs: existingJobs, engines: enginesDefinition, runner}).mockReturnValue(liftedJobs);
    when(scaffoldBadges).calledWith({vcs}).mockReturnValue(badgesResults);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not update the config no additional branches are provided', async () => {
    const existingConfig = {
      ...any.simpleObject(),
      on: {...any.simpleObject(), push: {branches: any.listOf(any.word)}},
      jobs: existingJobs
    };
    when(jsYaml.load).calledWith(rawExistingConfig).mockReturnValue(existingConfig);

    expect(await lift({projectRoot, results: any.simpleObject(), vcs, runner})).toEqual({badges: badgesResults});
    expect(writeWorkflowFile).toHaveBeenCalledWith({
      projectRoot,
      name: 'node-ci',
      config: {...existingConfig, permissions: {contents: 'read'}, jobs: liftedJobs}
    });
  });

  it('should append the additional branches to the existing list', async () => {
    const branchesToVerify = any.listOf(any.word);
    const existingBranches = any.listOf(any.word);
    const existingConfig = {
      ...any.simpleObject(),
      on: {...any.simpleObject(), push: {branches: existingBranches}},
      jobs: existingJobs
    };
    const mergedBranches = any.listOf(any.word);
    when(jsYaml.load).calledWith(rawExistingConfig).mockReturnValue(existingConfig);
    when(mergeBranchList).calledWith(existingBranches, branchesToVerify).mockReturnValue(mergedBranches);

    expect(await lift({projectRoot, results: {...any.simpleObject(), branchesToVerify}, vcs, runner}))
      .toEqual({badges: badgesResults});
    expect(writeWorkflowFile).toHaveBeenCalledWith({
      projectRoot,
      name: 'node-ci',
      config: {
        ...existingConfig,
        on: {...existingConfig.on, push: {branches: mergedBranches}},
        permissions: {contents: 'read'},
        jobs: liftedJobs
      }
    });
  });
});
