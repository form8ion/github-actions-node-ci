import semver from 'semver';
import * as jsCore from '@form8ion/javascript-core';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import buildNodeVersionMatrix from './node-version-matrix-builder';

suite('node version matrix builder', () => {
  let sandbox;
  const nodeVersionRange = any.string();
  const minimumNodeVersion = any.string();
  const inRangeLtsNodeMajorVersions = any.listOf(any.integer);

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(semver, 'minVersion');
    sandbox.stub(jsCore, 'determineActiveLtsNodeMajorVersions');

    semver.minVersion.withArgs(nodeVersionRange).returns({version: minimumNodeVersion});
    jsCore.determineActiveLtsNodeMajorVersions
      .withArgs({withinRange: nodeVersionRange})
      .returns(inRangeLtsNodeMajorVersions);
  });

  teardown(() => sandbox.restore());

  test('that the list of node versions is built based on the engines definition', async () => {
    assert.deepEqual(
      buildNodeVersionMatrix({node: nodeVersionRange}),
      [minimumNodeVersion, ...inRangeLtsNodeMajorVersions]
    );
  });

  test('that the list of node versions is built considering multiple ranges separated by ` || `', async () => {
    const secondNodeVersionRange = any.string();
    const nodeVersionDefinition = `${nodeVersionRange} || ${secondNodeVersionRange}`;
    const secondMinimumNodeVersion = any.string();
    const inSecondRangeLtsNodeMajorVersions = any.listOf(any.integer);
    semver.minVersion.withArgs(secondNodeVersionRange).returns({version: secondMinimumNodeVersion});
    jsCore.determineActiveLtsNodeMajorVersions
      .withArgs({withinRange: secondNodeVersionRange})
      .returns(inSecondRangeLtsNodeMajorVersions);

    assert.deepEqual(
      buildNodeVersionMatrix({node: nodeVersionDefinition}),
      [
        minimumNodeVersion,
        ...inRangeLtsNodeMajorVersions,
        secondMinimumNodeVersion,
        ...inSecondRangeLtsNodeMajorVersions
      ]
    );
  });

  test('that `undefined` is returned if `engines` is not defined', async () => {
    assert.isUndefined(buildNodeVersionMatrix(undefined));
  });

  test('that `undefined` is returned if `engines.node` is not defined', async () => {
    assert.isUndefined(buildNodeVersionMatrix({}));
  });
});
