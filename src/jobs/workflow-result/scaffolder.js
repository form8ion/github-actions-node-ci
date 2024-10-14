export default function () {
  return {
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
  };
}
