import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import liftStep from './lifter.js';

describe('step lifter', () => {
  const otherWithProperties = any.simpleObject();

  it('should return the job unchanged if the step is not for setting up node', () => {
    const step = any.simpleObject();

    expect(liftStep(step)).toEqual(step);
  });

  it('should update the nvmrc reference to the modern property', () => {
    const step = {
      ...any.simpleObject(),
      name: 'Setup node',
      // eslint-disable-next-line no-template-curly-in-string
      with: {...otherWithProperties, 'node-version': '${{ steps.nvm.outputs.NVMRC }}'}
    };

    expect(liftStep(step))
      .toEqual({...step, with: {...otherWithProperties, 'node-version-file': '.nvmrc', cache: 'npm'}});
  });

  it('should update a static node version definition to reference the .nvmrc', () => {
    const step = {...any.simpleObject(), name: 'Setup node', with: {...otherWithProperties, 'node-version': '12.x'}};

    expect(liftStep(step))
      .toEqual({...step, with: {...otherWithProperties, 'node-version-file': '.nvmrc', cache: 'npm'}});
  });

  it('should not read the nvmrc file for matrix steps', () => {
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

    expect(liftStep(step)).toEqual(step);
  });

  it('should replace the legacy install action with directly executing the install command', () => {
    expect(liftStep({uses: `bahmutov/npm-install@${any.string()}`})).toEqual([
      {run: 'npm clean-install'},
      {run: 'npm install --global corepack@latest'},
      {run: 'corepack npm audit signatures'}
    ]);
  });
});
