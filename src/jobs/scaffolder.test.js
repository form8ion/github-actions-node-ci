import {
  scaffoldCheckoutStep,
  scaffoldDependencyInstallationStep,
  scaffoldNodeSetupStep,
  scaffoldVerificationStep
} from '@form8ion/github-workflows-core';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {scaffold as scaffoldJob} from '../job/index.js';
import {nvmrcVerification} from './scaffolder.js';

vi.mock('@form8ion/github-workflows-core');
vi.mock('../job/index.js');

describe('steps scaffolder', () => {
  const checkoutStep = any.simpleObject();
  const setupNodeStep = any.simpleObject();
  const installDependenciesStep = any.listOf(any.simpleObject);
  const executeVerificationStep = any.simpleObject();
  const job = any.simpleObject();

  beforeEach(() => {
    scaffoldCheckoutStep.mockReturnValue(checkoutStep);
    scaffoldDependencyInstallationStep.mockReturnValue(installDependenciesStep);
    scaffoldVerificationStep.mockReturnValue(executeVerificationStep);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create an nvmrc verification job', () => {
    const runner = any.word();
    when(scaffoldNodeSetupStep).calledWith({versionDeterminedBy: 'nvmrc'}).thenReturn(setupNodeStep);
    when(scaffoldJob)
      .calledWith({runner, steps: [checkoutStep, setupNodeStep, ...installDependenciesStep, executeVerificationStep]})
      .thenReturn(job);

    expect(nvmrcVerification({runner})).toEqual(job);
  });
});
