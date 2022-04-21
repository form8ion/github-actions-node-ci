import {assert} from 'chai';

import {checkout, installDependencies, executeVerification, setupNode} from './scaffolders';

suite('step scaffolders', () => {
  test('that the checkout step details are scaffolded', async () => {
    assert.deepEqual(checkout(), {uses: 'actions/checkout@v3'});
  });

  test('that node is set up correctly when version is determined from the `.nvmrc`', async () => {
    assert.deepEqual(
      setupNode({versionDeterminedBy: 'nvmrc'}),
      {name: 'Setup node', uses: 'actions/setup-node@v3', with: {'node-version-file': '.nvmrc', cache: 'npm'}}
    );
  });

  test('that node is set up correctly when the version is determined based on a matrix', async () => {
    assert.deepEqual(
      setupNode({versionDeterminedBy: 'matrix'}),
      // eslint-disable-next-line no-template-curly-in-string
      {name: 'Setup node', uses: 'actions/setup-node@v3', with: {'node-version': '${{ matrix.node }}', cache: 'npm'}}
    );
  });

  test('that dependencies are installed correctly', async () => {
    assert.deepEqual(installDependencies(), {run: 'npm clean-install'});
  });

  test('that verification is executed correctly', async () => {
    assert.deepEqual(executeVerification(), {run: 'npm test'});
  });
});
