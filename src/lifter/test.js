import {fileExists} from '@form8ion/core';

export default function ({projectRoot}) {
  return fileExists(`${projectRoot}/.github/workflows/node-ci.yml`);
}
