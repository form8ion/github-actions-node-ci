export function setupNode({versionDeterminedBy}) {
  return {
    name: 'Setup node',
    uses: 'actions/setup-node@v3',
    with: {
      ...'nvmrc' === versionDeterminedBy && {'node-version-file': '.nvmrc'},
      // eslint-disable-next-line no-template-curly-in-string
      ...'matrix' === versionDeterminedBy && {'node-version': '${{ matrix.node }}'},
      cache: 'npm'
    }
  };
}

export function executeVerification() {
  return {run: 'npm test'};
}

export function installDependencies() {
  return {run: 'npm clean-install'};
}

export function checkout() {
  return {uses: 'actions/checkout@v3'};
}
