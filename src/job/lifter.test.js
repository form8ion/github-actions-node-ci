import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {lift as liftSteps} from '../steps/index.js';
import liftJob from './lifter.js';

vi.mock('../steps/index.js');

describe('job lifter', () => {
  const jobName = any.word();
  const jobSteps = any.listOf(any.simpleObject);
  const liftedSteps = any.listOf(any.simpleObject);
  const enhancerOptions = any.simpleObject();
  const nonApplicableEnhancerFactory = () => ({test: () => false});

  it('should lift the steps of a job', () => {
    const jobWithoutSteps = any.simpleObject();
    when(liftSteps).calledWith(jobSteps).thenReturn(liftedSteps);

    expect(liftJob([jobName, {...jobWithoutSteps, steps: jobSteps}], any.listOf(nonApplicableEnhancerFactory)))
      .toEqual([jobName, {...jobWithoutSteps, steps: liftedSteps}]);
  });

  it('should lift a job that calls a reusable workflow', () => {
    const jobThatCallsReusableWorkflow = {...any.simpleObject(), uses: any.string()};
    const liftedJob = liftJob([jobName, jobThatCallsReusableWorkflow], any.listOf(nonApplicableEnhancerFactory));

    expect(liftSteps).not.toHaveBeenCalled();
    expect(liftedJob).toEqual([jobName, jobThatCallsReusableWorkflow]);
  });

  it('should apply a related enhancer', () => {
    const jobLifter = vi.fn();
    const applicableEnhancer = {test: () => true, lift: jobLifter};
    const enhancers = [
      ...any.listOf(nonApplicableEnhancerFactory),
      applicableEnhancer,
      ...any.listOf(nonApplicableEnhancerFactory)
    ];
    const existingJobDetails = {...any.simpleObject(), steps: jobSteps};
    const liftedJobDetails = any.simpleObject();
    when(liftSteps).calledWith(jobSteps).thenReturn(liftedSteps);
    when(jobLifter)
      .calledWith({...existingJobDetails, steps: liftedSteps}, enhancerOptions)
      .thenReturn(liftedJobDetails);

    const [, updatedJobDefinition] = liftJob(['verify-matrix', existingJobDetails], enhancers, enhancerOptions);

    expect(updatedJobDefinition).toEqual(liftedJobDetails);
  });
});
