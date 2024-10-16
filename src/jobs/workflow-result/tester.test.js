import any from '@travi/any';
import {it, describe, expect} from 'vitest';

import jobIsMatrixVerification from './tester.js';

describe('workflow-result predicate', () => {
  it('should return `true` when the job name is `workflow-result`', () => {
    expect(jobIsMatrixVerification({jobName: 'workflow-result'})).toBe(true);
  });

  it('should return `false` when the job name is not `workflow-result`', () => {
    expect(jobIsMatrixVerification({jobName: any.word()})).toBe(false);
  });
});
