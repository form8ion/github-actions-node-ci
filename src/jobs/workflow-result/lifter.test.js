import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import liftWorkflowResultJob from './lifter.js';

describe('workflow-result job lifter', () => {
  const existingJobDetails = any.simpleObject();

  it('should not modify the job if no `verify-matrix` job exists', () => {
    expect(liftWorkflowResultJob(existingJobDetails, {jobs: any.simpleObject()})).toEqual(existingJobDetails);
  });

  it('should make the job depend on the `verify-matrix` job if it exists', () => {
    expect(liftWorkflowResultJob(
      existingJobDetails,
      {jobs: {...any.simpleObject(), 'verify-matrix': any.simpleObject()}}
    )).toEqual({...existingJobDetails, needs: ['verify', 'verify-matrix']});
  });
});
