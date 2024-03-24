export default function ({steps, strategy}) {
  return {
    'runs-on': 'ubuntu-latest',
    ...strategy && {strategy},
    steps
  };
}
