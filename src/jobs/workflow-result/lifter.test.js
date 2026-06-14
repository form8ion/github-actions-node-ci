import {describe, it, expect} from 'vitest';
import any from '@travi/any';

import liftWorkflowResultJob from './lifter.js';

describe('workflow-result job lifter', () => {
  const existingJobDetails = any.simpleObject();

  it('should not modify the job if no `verify-matrix` job exists', () => {
    expect(liftWorkflowResultJob(existingJobDetails, {jobs: any.simpleObject()})).toEqual(existingJobDetails);
  });

  it('should include the required dependencies if no existing needs are defined', () => {
    expect(liftWorkflowResultJob(
      existingJobDetails,
      {jobs: {'verify-matrix': {}}}
    )).toEqual({...existingJobDetails, needs: ['verify', 'verify-matrix']});
  });

  it('should update scaffolded needs to include verify-matrix', () => {
    expect(liftWorkflowResultJob(
      {...existingJobDetails, needs: ['verify']},
      {jobs: {'verify-matrix': {}}}
    )).toEqual({...existingJobDetails, needs: ['verify', 'verify-matrix']});
  });

  it('should keep existing needs and append missing required dependencies', () => {
    expect(liftWorkflowResultJob(
      {...existingJobDetails, needs: ['existing-dependency']},
      {jobs: {'verify-matrix': {}}}
    )).toEqual({...existingJobDetails, needs: ['existing-dependency', 'verify', 'verify-matrix']});
  });
});
