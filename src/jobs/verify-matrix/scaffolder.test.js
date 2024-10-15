import {
  scaffoldCheckoutStep,
  scaffoldDependencyInstallationStep,
  scaffoldNodeSetupStep, scaffoldVerificationStep
} from '@form8ion/github-workflows-core';

import {expect, it, vi, describe} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as scaffoldJob} from '../../job/index.js';
import scaffoldMatrixVerificationJob from './scaffolder.js';

vi.mock('@form8ion/github-workflows-core');
vi.mock('../../job/index.js');

describe('verify-matrix job scaffolder', () => {
  const checkoutStep = any.simpleObject();
  const setupNodeStep = any.simpleObject();
  const installDependenciesStep = any.listOf(any.simpleObject);
  const executeVerificationStep = any.simpleObject();
  const job = any.simpleObject();

  it('should create a matrix verification job', () => {
    const nodeEnginesMatrix = any.listOf(any.integer);
    const runner = any.word();
    scaffoldCheckoutStep.mockReturnValue(checkoutStep);
    scaffoldDependencyInstallationStep.mockReturnValue(installDependenciesStep);
    scaffoldVerificationStep.mockReturnValue(executeVerificationStep);
    when(scaffoldNodeSetupStep).calledWith({versionDeterminedBy: 'matrix'}).mockReturnValue(setupNodeStep);
    when(scaffoldJob)
      .calledWith({
        strategy: {matrix: {node: nodeEnginesMatrix}},
        steps: [checkoutStep, setupNodeStep, ...installDependenciesStep, executeVerificationStep],
        runner
      })
      .mockReturnValue(job);

    expect(scaffoldMatrixVerificationJob({versions: nodeEnginesMatrix, runner})).toEqual(job);
  });
});
