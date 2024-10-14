import {it, expect, describe} from 'vitest';

import scaffoldWorkflowResultJob from './scaffolder.js';

describe('workflow-result job scaffolder', () => {
  it('should determine exit code based on previous job results', () => {
    expect(scaffoldWorkflowResultJob()).toEqual({
      'runs-on': 'ubuntu-latest',
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
    });
  });
});
