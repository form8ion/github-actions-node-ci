import semver from 'semver';
import * as jsCore from '@form8ion/javascript-core';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import buildNodeVersionMatrix from './node-version-matrix-builder';

suite('node version matrix builder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(semver, 'minVersion');
    sandbox.stub(jsCore, 'determineActiveLtsNodeMajorVersions');
  });

  teardown(() => sandbox.restore());

  test('that the list of node versions is built based on the engines definition', async () => {
    const nodeVersionRange = any.string();
    const minimumNodeVersion = any.string();
    const inRangeLtsNodeMajorVersions = any.listOf(any.integer);
    semver.minVersion.withArgs(nodeVersionRange).returns({version: minimumNodeVersion});
    jsCore.determineActiveLtsNodeMajorVersions
      .withArgs({withinRange: nodeVersionRange})
      .returns(inRangeLtsNodeMajorVersions);

    assert.deepEqual(
      buildNodeVersionMatrix({node: nodeVersionRange}),
      [minimumNodeVersion, ...inRangeLtsNodeMajorVersions]
    );
  });

  test('that `undefined` is returned if `engines` is not defined', async () => {
    assert.isUndefined(buildNodeVersionMatrix(undefined));
  });

  test('that `undefined` is returned if `engines.node` is not defined', async () => {
    assert.isUndefined(buildNodeVersionMatrix({}));
  });
});
