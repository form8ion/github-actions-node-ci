import {describe, it, vi, expect} from 'vitest';
import any from '@travi/any';

import scaffoldConfig from './config-scaffolder';
import scaffold from './scaffolder';

vi.mock('./config-scaffolder');

describe('scaffolder', () => {
  it('should generate the ci config for a node project', async () => {
    const projectRoot = any.string();
    const projectType = any.string();
    const vcsOwner = any.word();
    const vcsName = any.word();
    const tests = any.simpleObject();
    const visibility = any.word();

    expect(await scaffold({projectRoot, projectType, vcs: {owner: vcsOwner, name: vcsName}, tests, visibility}))
      .toEqual({
        badges: {
          status: {
            'github-actions-ci': {
              text: 'Node CI Workflow Status',
              img: `https://img.shields.io/github/actions/workflow/status/${vcsOwner}/${
                vcsName
              }/node-ci.yml.svg?branch=master&logo=github`,
              link:
                `https://github.com/${vcsOwner}/${vcsName}/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster`
            }
          }
        },
        nextSteps: [{summary: 'Enable building branches in GitHub Actions for the chosen dependency updater'}]
      });
    expect(scaffoldConfig).toHaveBeenCalledWith({projectRoot, projectType, tests, visibility});
  });
});
