import any from '@travi/any';
import {assert} from 'chai';

import liftStep from './step-lifter.js';

suite('step lifter', () => {
  const otherWithProperties = any.simpleObject();

  test('that the job is returned unchanged if the step is not for setting up node', async () => {
    const step = any.simpleObject();

    assert.deepEqual(liftStep(step), step);
  });

  test('that the nvmrc reference is updated to the modern property', async () => {
    const step = {
      ...any.simpleObject(),
      name: 'Setup node',
      // eslint-disable-next-line no-template-curly-in-string
      with: {...otherWithProperties, 'node-version': '${{ steps.nvm.outputs.NVMRC }}'}
    };

    assert.deepEqual(
      liftStep(step),
      {...step, with: {...otherWithProperties, 'node-version-file': '.nvmrc', cache: 'npm'}}
    );
  });

  test('that a static node version definition is updated to reference the .nvmrc', async () => {
    const step = {...any.simpleObject(), name: 'Setup node', with: {...otherWithProperties, 'node-version': '12.x'}};

    assert.deepEqual(
      liftStep(step),
      {...step, with: {...otherWithProperties, 'node-version-file': '.nvmrc', cache: 'npm'}}
    );
  });

  test('that the nvmrc file is not read for matrix jobs', async () => {
    const step = {
      ...any.simpleObject(),
      name: 'Setup node',
      with: {
        ...otherWithProperties,
        // eslint-disable-next-line no-template-curly-in-string
        'node-version': '${{ matrix.node }}',
        cache: 'npm'
      }
    };

    assert.deepEqual(liftStep(step), step);
  });

  test('that the legacy install action is replaced with directly executing the install command', async () => {
    assert.deepEqual(
      liftStep({uses: `bahmutov/npm-install@${any.string()}`}),
      [{run: 'npm clean-install'}, {run: 'npm audit signatures'}]
    );
  });
});
