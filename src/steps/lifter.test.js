import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {lift as liftStep} from '../step/index.js';
import liftSteps from './lifter.js';

vi.mock('../step/index.js');

describe('steps lifter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should remove the step for reading the `.nvmrc` and apply the step lifter to each step', () => {
    const nvmrcReadStep = {...any.simpleObject(), id: 'nvm'};
    const firstStep = any.simpleObject();
    const lastStep = any.simpleObject();
    const liftedFirstStep = any.simpleObject();
    const liftedLastStep = any.listOf(any.simpleObject);
    const liftedNvmrcReadStep = any.listOf(any.simpleObject);
    const steps = [firstStep, nvmrcReadStep, lastStep];
    when(liftStep).calledWith(firstStep).mockReturnValue(liftedFirstStep);
    when(liftStep).calledWith(nvmrcReadStep).mockReturnValue(liftedNvmrcReadStep);
    when(liftStep).calledWith(lastStep).mockReturnValue(liftedLastStep);

    const liftedSteps = liftSteps(steps);

    expect(liftedSteps).not.toContain(liftedNvmrcReadStep);
    expect(liftedSteps).toEqual([liftedFirstStep, ...liftedLastStep]);
  });
});
