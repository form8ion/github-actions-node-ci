import scaffoldConfig from './config-scaffolder';

export default async function ({projectRoot, projectType, vcs, tests, visibility}) {
  await scaffoldConfig({projectRoot, projectType, tests, visibility});

  return {
    badges: {
      status: {
        'github-actions-ci': {
          text: 'Node CI Workflow Status',
          img: `https://github.com/${vcs.owner}/${vcs.name}/workflows/Node.js%20CI/badge.svg`,
          link: `https://github.com/${vcs.owner}/${vcs.name}/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster`
        }
      }
    },
    nextSteps: [{summary: 'Enable building branches in GitHub Actions for the chosen dependency updater'}]
  };
}
