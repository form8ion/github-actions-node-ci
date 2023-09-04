import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the status badge is returned', async function () {
  const {vcsOwner, vcsName} = this;

  assert.deepEqual(this.results.badges.status, {
    'github-actions-ci': {
      text: 'Node CI Workflow Status',
      img: `https://img.shields.io/github/actions/workflow/status/${vcsOwner}/${
        vcsName
      }/node-ci.yml.svg?branch=master&logo=github`,
      link: `https://github.com/${vcsOwner}/${vcsName}/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster`
    }
  });
});
