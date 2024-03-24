import {afterEach, describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {scaffold as scaffoldBadges} from '../badges/index.js';
import scaffoldConfig from './config-scaffolder.js';
import scaffold from './scaffolder.js';

vi.mock('../badges');
vi.mock('./config-scaffolder');

describe('scaffolder', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should generate the ci config for a node project', async () => {
    const projectRoot = any.string();
    const projectType = any.string();
    const tests = any.simpleObject();
    const visibility = any.word();
    const vcs = any.simpleObject();
    const badgesResults = any.simpleObject();
    const runner = any.word();
    when(scaffoldBadges).calledWith({vcs}).mockReturnValue(badgesResults);

    expect(await scaffold({projectRoot, projectType, vcs, tests, visibility, runner}))
      .toEqual({
        badges: badgesResults,
        nextSteps: [{summary: 'Enable building branches in GitHub Actions for the chosen dependency updater'}]
      });
    expect(scaffoldConfig).toHaveBeenCalledWith({projectRoot, projectType, tests, visibility, runner});
  });
});
