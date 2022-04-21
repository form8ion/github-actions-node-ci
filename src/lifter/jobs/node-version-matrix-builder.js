import {minVersion} from 'semver';
import {determineActiveLtsNodeMajorVersions} from '@form8ion/javascript-core';

export default function (engines) {
  if (!engines || !engines.node) {
    return undefined;
  }

  const nodeVersionRanges = engines.node.split(' || ');

  return nodeVersionRanges.reduce((acc, range) => ([
    ...acc,
    minVersion(range).version,
    ...determineActiveLtsNodeMajorVersions({withinRange: range})
  ]), []);
}
