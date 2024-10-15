import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import liftMatrixVerificationJob from './lifter.js';

describe('matrix verification job lifter', () => {
  const existingJobDetails = any.simpleObject();

  it('should define the node version matrix for the job', () => {
    const inRangeNodeVersions = any.listOf(any.simpleObject);

    expect(liftMatrixVerificationJob(existingJobDetails, {inRangeNodeVersions}))
      .toEqual({...existingJobDetails, strategy: {matrix: {node: inRangeNodeVersions}}});
  });

  it('should not modify the job if node versions are not provided', () => {
    expect(liftMatrixVerificationJob(existingJobDetails, {})).toEqual(existingJobDetails);
  });
});
