import {test as workflowsConfigured} from '@form8ion/github-workflows-core';

export default function qualify({projectRoot}) {
  return workflowsConfigured({projectRoot});
}
