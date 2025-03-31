import {workflowFileExists} from '@form8ion/github-workflows-core';

import {afterEach, describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import testThatCiWorkflowExists from './tester.js';

vi.mock('@form8ion/github-workflows-core');

describe('predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `false` when no ci workflow file exists', async () => {
    workflowFileExists.mockResolvedValue(false);

    expect(await testThatCiWorkflowExists({projectRoot})).toBe(false);
  });

  it('should return `true` when a ci workflow file exists', async () => {
    when(workflowFileExists).calledWith({projectRoot, name: 'node-ci'}).thenResolve(true);

    expect(await testThatCiWorkflowExists({projectRoot})).toBe(true);
  });
});
