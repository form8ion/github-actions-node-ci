import {fileExists} from '@form8ion/core';

import {afterEach, describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import testThatCiWorkflowExists from './tester.js';

vi.mock('@form8ion/core');

describe('predicate', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return `false` when no ci workflow file exists', async () => {
    fileExists.mockResolvedValue(false);

    expect(await testThatCiWorkflowExists({projectRoot})).toBe(false);
  });

  it('should return `true` when a ci workflow file exists', async () => {
    when(fileExists).calledWith(`${projectRoot}/.github/workflows/node-ci.yml`).mockResolvedValue(true);

    expect(await testThatCiWorkflowExists({projectRoot})).toBe(true);
  });
});
