import scaffoldConfig from './config-scaffolder.js';
import {scaffold as scaffoldBadges} from '../badges/index.js';

export default async function ({projectRoot, projectType, vcs, tests, visibility}) {
  await scaffoldConfig({projectRoot, projectType, tests, visibility});

  return {
    badges: scaffoldBadges({vcs}),
    nextSteps: [{summary: 'Enable building branches in GitHub Actions for the chosen dependency updater'}]
  };
}
