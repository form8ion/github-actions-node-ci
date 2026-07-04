import {test as workflowsConfigured} from '@form8ion/github-workflows-core';

import {describe, it, vi, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import qualify from './qualifier.js';

vi.mock('@form8ion/github-workflows-core');

describe('qualifier', () => {
  it('should qualify the use of this plugin based on the workflows-core predicate', async () => {
    const projectRoot = any.simpleObject();
    const workflowsAreConfigured = any.boolean();
    when(workflowsConfigured).calledWith({projectRoot}).thenResolve(workflowsAreConfigured);

    expect(await qualify({projectRoot})).toEqual(workflowsAreConfigured);
  });
});
