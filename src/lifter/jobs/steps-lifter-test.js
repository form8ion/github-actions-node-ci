import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';

import * as stepLifter from './step-lifter';
import liftSteps from './steps-lifter';

suite('steps lifter', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(stepLifter, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the step for reading the `.nvmrc` is removed and the step lifter is applied to each step', async () => {
    const nvmrcReadStep = {...any.simpleObject(), id: 'nvm'};
    const firstStep = any.simpleObject();
    const lastStep = any.simpleObject();
    const steps = [firstStep, nvmrcReadStep, lastStep];

    assert.notDeepInclude(liftSteps(steps), nvmrcReadStep);

    assert.calledWith(stepLifter.default, firstStep);
    assert.calledWith(stepLifter.default, lastStep);
  });
});
