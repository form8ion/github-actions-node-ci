import {
  scaffoldCheckoutStep,
  scaffoldNodeSetupStep,
  scaffoldDependencyInstallationStep,
  scaffoldVerificationStep
} from '@form8ion/github-workflows-core';

import {afterEach, beforeEach, describe, vi, it, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as scaffoldJob} from '../job/index.js';
import {matrixVerification, nvmrcVerification} from './scaffolder.js';

vi.mock('@form8ion/github-workflows-core');
vi.mock('../job/index.js');

describe('jobs scaffolder', () => {
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
    when(scaffoldNodeSetupStep).calledWith({versionDeterminedBy: 'nvmrc'}).mockReturnValue(setupNodeStep);
    when(scaffoldJob)
      .calledWith({steps: [checkoutStep, setupNodeStep, ...installDependenciesStep, executeVerificationStep]})
      .mockReturnValue(job);

    expect(nvmrcVerification()).toEqual(job);
  });

  it('should create a matrix verification job', () => {
    const nodeEnginesMatrix = any.listOf(any.integer);
    when(scaffoldNodeSetupStep).calledWith({versionDeterminedBy: 'matrix'}).mockReturnValue(setupNodeStep);
    when(scaffoldJob)
      .calledWith({
        strategy: {matrix: {node: nodeEnginesMatrix}},
        steps: [checkoutStep, setupNodeStep, ...installDependenciesStep, executeVerificationStep]
      })
      .mockReturnValue(job);

    expect(matrixVerification(nodeEnginesMatrix)).toEqual(job);
  });
});
