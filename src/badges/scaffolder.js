export default function ({vcs}) {
  return {
    status: {
      'github-actions-ci': {
        text: 'Node CI Workflow Status',
        img: `https://img.shields.io/github/actions/workflow/status/${vcs.owner}/${
          vcs.name
        }/node-ci.yml.svg?branch=master&logo=github`,
        link: `https://github.com/${vcs.owner}/${vcs.name}/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster`
      }
    }
  };
}
