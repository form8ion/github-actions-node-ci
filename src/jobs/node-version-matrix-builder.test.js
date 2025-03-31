import semver from 'semver';
import {determineSupportedNodeMajorVersions} from '@form8ion/javascript-core';

import {describe, it, expect, afterEach, beforeEach, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import buildNodeVersionMatrix from './node-version-matrix-builder.js';

vi.mock('semver');
vi.mock('@form8ion/javascript-core');

describe('node version matrix builder', () => {
  const nodeVersionRange = any.string();
  const minimumNodeVersion = any.string();
  const inRangeLtsNodeMajorVersions = any.listOf(any.integer);

  beforeEach(() => {
    when(semver.minVersion).calledWith(nodeVersionRange).thenReturn({version: minimumNodeVersion});
    when(determineSupportedNodeMajorVersions)
      .calledWith({withinRange: nodeVersionRange})
      .thenReturn(inRangeLtsNodeMajorVersions);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should build a list of node versions based on the engines definition', () => {
    expect(buildNodeVersionMatrix({node: nodeVersionRange}))
      .toEqual([minimumNodeVersion, ...inRangeLtsNodeMajorVersions]);
  });

  it('should build the list of node versions considering multiple ranges separated by ` || `', () => {
    const secondNodeVersionRange = any.string();
    const nodeVersionDefinition = `${nodeVersionRange} || ${secondNodeVersionRange}`;
    const secondMinimumNodeVersion = any.string();
    const inSecondRangeLtsNodeMajorVersions = any.listOf(any.integer);
    when(semver.minVersion).calledWith(secondNodeVersionRange).thenReturn({version: secondMinimumNodeVersion});
    when(determineSupportedNodeMajorVersions)
      .calledWith({withinRange: secondNodeVersionRange})
      .thenReturn(inSecondRangeLtsNodeMajorVersions);

    expect(buildNodeVersionMatrix({node: nodeVersionDefinition})).toEqual([
      minimumNodeVersion,
      ...inRangeLtsNodeMajorVersions,
      secondMinimumNodeVersion,
      ...inSecondRangeLtsNodeMajorVersions
    ]);
  });

  it('should return `undefined` if `engines` is not defined', () => {
    expect(buildNodeVersionMatrix(undefined)).toBe(undefined);
  });

  it('should return `undefined` if `engines.node` is not defined', () => {
    expect(buildNodeVersionMatrix({})).toBe(undefined);
  });
});
