import scaffoldConfig from './config-scaffolder';

export default async function ({projectRoot, vcs}) {
  await scaffoldConfig({projectRoot});

  return {
    badges: {
      status: {
        text: 'Node CI Workflow Status',
        img: `https://github.com/${vcs.owner}/${vcs.name}/workflows/Node.js%20CI/badge.svg`
      }
    }
  };
}
