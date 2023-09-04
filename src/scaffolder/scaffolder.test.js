import {afterEach, describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as scaffoldBadges} from '../badges';
import scaffoldConfig from './config-scaffolder';
import scaffold from './scaffolder';

vi.mock('../badges');
vi.mock('./config-scaffolder');

describe('scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should generate the ci config for a node project', async () => {
    const projectRoot = any.string();
    const projectType = any.string();
    const vcsOwner = any.word();
    const vcsName = any.word();
    const tests = any.simpleObject();
    const visibility = any.word();
    const vcs = {owner: vcsOwner, name: vcsName};
    const badgesResults = any.simpleObject();
    when(scaffoldBadges).calledWith({vcs}).mockReturnValue(badgesResults);

    expect(await scaffold({projectRoot, projectType, vcs, tests, visibility}))
      .toEqual({
        badges: badgesResults,
        nextSteps: [{summary: 'Enable building branches in GitHub Actions for the chosen dependency updater'}]
      });
    expect(scaffoldConfig).toHaveBeenCalledWith({projectRoot, projectType, tests, visibility});
  });
});
