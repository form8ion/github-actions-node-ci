import {expect, describe, it} from 'vitest';
import any from '@travi/any';

import scaffoldBadges from './scaffolder.js';

describe('badges scaffolder', () => {
  it('should define the ci status badge', () => {
    const vcsOwner = any.word();
    const vcsName = any.word();

    expect(scaffoldBadges({vcs: {owner: vcsOwner, name: vcsName}})).toEqual({
      status: {
        'github-actions-ci': {
          text: 'Node CI Workflow Status',
          img: `https://img.shields.io/github/actions/workflow/status/${vcsOwner}/${
            vcsName
          }/node-ci.yml.svg?branch=master&logo=github`,
          link: `https://github.com/${vcsOwner}/${vcsName}/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster`
        }
      }
    });
  });
});
