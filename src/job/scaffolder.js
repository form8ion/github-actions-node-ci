export default function ({steps, strategy, runner = 'ubuntu-latest'}) {
  return {
    'runs-on': runner,
    ...strategy && {strategy},
    steps
  };
}
