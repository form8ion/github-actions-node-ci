import {it, expect, describe, vi} from 'vitest';
import {when} from 'jest-when';
import any from '@travi/any';

import {scaffold as scaffoldJob} from '../../job/index.js';
import scaffoldWorkflowResultJob from './scaffolder.js';

vi.mock('../../job/index.js');
describe('workflow-result job scaffolder', () => {
  it('should determine exit code based on previous job results', () => {
    const runner = any.word();
    const job = any.simpleObject();
    when(scaffoldJob)
      .calledWith({
        runner,
        needs: ['verify'],
        // eslint-disable-next-line no-template-curly-in-string
        if: '${{ !cancelled() }}',
        steps: [
          {
            name: 'All matrix versions passed',
            // eslint-disable-next-line no-template-curly-in-string
            if: "${{ !(contains(needs.*.result, 'failure')) }}",
            run: 'exit 0'
          },
          {
            name: 'Some matrix version failed',
            // eslint-disable-next-line no-template-curly-in-string
            if: "${{ contains(needs.*.result, 'failure') }}",
            run: 'exit 1'
          }
        ]
      })
      .mockReturnValue(job);

    expect(scaffoldWorkflowResultJob({runner})).toEqual(job);
  });
});
