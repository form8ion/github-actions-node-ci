import {
  scaffoldCheckoutStep,
  scaffoldNodeSetupStep,
  scaffoldDependencyInstallationStep,
  scaffoldVerificationStep
} from '@form8ion/github-workflows-core';

export function nvmrcVerification() {
  return {
    'runs-on': 'ubuntu-latest',
    steps: [
      scaffoldCheckoutStep(),
      scaffoldNodeSetupStep({versionDeterminedBy: 'nvmrc'}),
      scaffoldDependencyInstallationStep(),
      scaffoldVerificationStep()
    ]
  };
}

export function matrixVerification(nodeEnginesMatrix) {
  return {
    'runs-on': 'ubuntu-latest',
    strategy: {matrix: {node: nodeEnginesMatrix}},
    steps: [
      scaffoldCheckoutStep(),
      scaffoldNodeSetupStep({versionDeterminedBy: 'matrix'}),
      scaffoldDependencyInstallationStep(),
      scaffoldVerificationStep()
    ]
  };
}
