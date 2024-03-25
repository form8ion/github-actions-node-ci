import {
  scaffoldCheckoutStep,
  scaffoldNodeSetupStep,
  scaffoldDependencyInstallationStep,
  scaffoldVerificationStep
} from '@form8ion/github-workflows-core';

import {scaffold as scaffoldJob} from '../job/index.js';

export function nvmrcVerification({runner}) {
  return scaffoldJob({
    runner,
    steps: [
      scaffoldCheckoutStep(),
      scaffoldNodeSetupStep({versionDeterminedBy: 'nvmrc'}),
      ...scaffoldDependencyInstallationStep(),
      scaffoldVerificationStep()
    ]
  });
}

export function matrixVerification({versions: nodeEnginesMatrix, runner}) {
  return scaffoldJob({
    strategy: {matrix: {node: nodeEnginesMatrix}},
    runner,
    steps: [
      scaffoldCheckoutStep(),
      scaffoldNodeSetupStep({versionDeterminedBy: 'matrix'}),
      ...scaffoldDependencyInstallationStep(),
      scaffoldVerificationStep()
    ]
  });
}
