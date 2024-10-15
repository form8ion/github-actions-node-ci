import any from '@travi/any';
import {it, describe, expect} from 'vitest';

import jobIsMatrixVerification from './tester.js';

describe('verify-matrix predicate', () => {
  it('should return `true` when the job name is `verify-matrix`', () => {
    expect(jobIsMatrixVerification({jobName: 'verify-matrix'})).toBe(true);
  });

  it('should return `false` when the job name is not `verify-matrix`', () => {
    expect(jobIsMatrixVerification({jobName: any.word()})).toBe(false);
  });
});
