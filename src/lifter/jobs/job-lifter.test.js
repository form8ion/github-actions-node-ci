import {describe, it, expect, afterEach, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import liftSteps from './steps-lifter.js';
import liftJob from './job-lifter.js';

vi.mock('./steps-lifter.js');

describe('job lifter', () => {
  const jobName = any.word();
  const updatedSupportedNodeVersions = any.listOf(any.simpleObject);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should lift the steps of a job', () => {
    const jobWithoutSteps = any.simpleObject();
    const jobSteps = any.listOf(any.simpleObject);
    const liftedSteps = any.listOf(any.simpleObject);
    when(liftSteps).calledWith(jobSteps).mockReturnValue(liftedSteps);

    expect(liftJob([jobName, {...jobWithoutSteps, steps: jobSteps}]))
      .toEqual([jobName, {...jobWithoutSteps, steps: liftedSteps}]);
  });

  it('should lift a job that calls a reusable workflow', () => {
    const jobThatCallsReusableWorkflow = {...any.simpleObject(), uses: any.string()};
    const liftedJob = liftJob([jobName, jobThatCallsReusableWorkflow]);

    expect(liftSteps).not.toHaveBeenCalled();
    expect(liftedJob).toEqual([jobName, jobThatCallsReusableWorkflow]);
  });

  it('should replace the node versions in an existing matrix job', () => {
    const [, updatedJobDefinition] = liftJob(
      [jobName, {...any.simpleObject(), strategy: {matrix: {node: any.listOf(any.integer)}}}],
      updatedSupportedNodeVersions
    );

    expect(updatedJobDefinition.strategy.matrix.node).toEqual(updatedSupportedNodeVersions);
  });

  it('should not add a test strategy to a job that does not already have one defined', () => {
    const [, updatedJobDefinition] = liftJob([jobName, any.simpleObject()], updatedSupportedNodeVersions);

    expect(updatedJobDefinition.strategy).toBe(undefined);
  });

  it('should not add a test matrix to a job that does not already have one defined', () => {
    const [, updatedJobDefinition] = liftJob(
      [jobName, {...any.simpleObject(), strategy: any.simpleObject()}],
      updatedSupportedNodeVersions
    );

    expect(updatedJobDefinition.strategy.matrix).toBe(undefined);
  });

  it('should not add a list of supported node versions to a job that does not already have one defined', () => {
    const [, updatedJobDefinition] = liftJob(
      [jobName, {...any.simpleObject(), strategy: {...any.simpleObject(), matrix: any.simpleObject()}}],
      updatedSupportedNodeVersions
    );

    expect(updatedJobDefinition.strategy.matrix.node).toBe(undefined);
  });
});
