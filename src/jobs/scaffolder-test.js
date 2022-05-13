import * as githubWorkflowsCore from '@form8ion/github-workflows-core';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import {nvmrcVerification, matrixVerification} from './scaffolder';

suite('jobs scaffolder', () => {
  let sandbox;
  const checkoutStep = any.simpleObject();
  const setupNodeStep = any.simpleObject();
  const installDependenciesStep = any.simpleObject();
  const executeVerificationStep = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(githubWorkflowsCore, 'scaffoldCheckoutStep');
    sandbox.stub(githubWorkflowsCore, 'scaffoldNodeSetupStep');
    sandbox.stub(githubWorkflowsCore, 'scaffoldVerificationStep');
    sandbox.stub(githubWorkflowsCore, 'scaffoldDependencyInstallationStep');

    githubWorkflowsCore.scaffoldCheckoutStep.returns(checkoutStep);
    githubWorkflowsCore.scaffoldDependencyInstallationStep.returns(installDependenciesStep);
    githubWorkflowsCore.scaffoldVerificationStep.returns(executeVerificationStep);
  });

  teardown(() => sandbox.restore());

  test('that an nvmrc verification job is created', async () => {
    githubWorkflowsCore.scaffoldNodeSetupStep.withArgs({versionDeterminedBy: 'nvmrc'}).returns(setupNodeStep);

    assert.deepEqual(
      nvmrcVerification(),
      {
        'runs-on': 'ubuntu-latest',
        steps: [checkoutStep, setupNodeStep, installDependenciesStep, executeVerificationStep]
      }
    );
  });

  test('that a matrix verification job is created', async () => {
    const nodeEnginesMatrix = any.listOf(any.integer);
    githubWorkflowsCore.scaffoldNodeSetupStep.withArgs({versionDeterminedBy: 'matrix'}).returns(setupNodeStep);

    assert.deepEqual(
      matrixVerification(nodeEnginesMatrix),
      {
        'runs-on': 'ubuntu-latest',
        strategy: {matrix: {node: nodeEnginesMatrix}},
        steps: [checkoutStep, setupNodeStep, installDependenciesStep, executeVerificationStep]
      }
    );
  });
});
