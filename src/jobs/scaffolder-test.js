import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as stepsScaffolders from '../steps/scaffolders';
import {nvmrcVerification, matrixVerification} from './scaffolder';

suite('jobs scaffolder', () => {
  let sandbox;
  const checkoutStep = any.simpleObject();
  const setupNodeStep = any.simpleObject();
  const installDependenciesStep = any.simpleObject();
  const executeVerificationStep = any.simpleObject();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(stepsScaffolders, 'checkout');
    sandbox.stub(stepsScaffolders, 'setupNode');
    sandbox.stub(stepsScaffolders, 'executeVerification');
    sandbox.stub(stepsScaffolders, 'installDependencies');

    stepsScaffolders.checkout.returns(checkoutStep);
    stepsScaffolders.installDependencies.returns(installDependenciesStep);
    stepsScaffolders.executeVerification.returns(executeVerificationStep);
  });

  teardown(() => sandbox.restore());

  test('that an nvmrc verification job is created', async () => {
    stepsScaffolders.setupNode.withArgs({versionDeterminedBy: 'nvmrc'}).returns(setupNodeStep);

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
    stepsScaffolders.setupNode.withArgs({versionDeterminedBy: 'matrix'}).returns(setupNodeStep);

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
