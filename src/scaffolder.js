import scaffoldConfig from './config-scaffolder';

export default async function ({projectRoot, vcs}) {
  await scaffoldConfig({projectRoot});

  return {
    badges: {
      status: {
        ci: {
          text: 'Node CI Workflow Status',
          img: `https://github.com/${vcs.owner}/${vcs.name}/workflows/Node.js%20CI/badge.svg`,
          link: `https://github.com/${vcs.owner}/${vcs.name}/actions?query=workflow%3A%22Node.js+CI%22`
        }
      }
    }
  };
}
