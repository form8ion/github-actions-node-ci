import {minVersion} from 'semver';
import {determineActiveLtsNodeMajorVersions} from '@form8ion/javascript-core';

export default function (engines) {
  if (!engines || !engines.node) {
    return undefined;
  }

  const nodeVersionRange = engines.node;

  return [
    minVersion(nodeVersionRange).version,
    ...determineActiveLtsNodeMajorVersions({withinRange: nodeVersionRange})
  ];
}
