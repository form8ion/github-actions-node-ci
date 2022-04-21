export function setupNode() {
  return {name: 'Setup node', uses: 'actions/setup-node@v3', with: {'node-version-file': '.nvmrc', cache: 'npm'}};
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
