export default function ({steps, strategy, needs, if: conditional, runner = 'ubuntu-latest'}) {
  return {
    'runs-on': runner,
    ...strategy && {strategy},
    ...needs && {needs},
    ...conditional && {if: conditional},
    steps
  };
}
