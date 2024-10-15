import {
  scaffoldCheckoutStep,
  scaffoldDependencyInstallationStep,
  scaffoldNodeSetupStep, scaffoldVerificationStep
} from '@form8ion/github-workflows-core';

import {scaffold as scaffoldJob} from '../../job/index.js';

export default function ({versions: nodeEnginesMatrix, runner}) {
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
