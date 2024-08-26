import {workflowFileExists} from '@form8ion/github-workflows-core';

export default function ({projectRoot}) {
  return workflowFileExists({projectRoot, name: 'node-ci'});
}
