import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import * as configScaffolder from './config-scaffolder';
import scaffold from './scaffolder';

suite('scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(configScaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the ci config is generated for a node project', async () => {
    const projectRoot = any.string();
    const projectType = any.string();
    const vcsOwner = any.word();
    const vcsName = any.word();

    assert.deepEqual(await scaffold({projectRoot, projectType, vcs: {owner: vcsOwner, name: vcsName}}), {
      badges: {
        status: {
          'github-actions-ci': {
            text: 'Node CI Workflow Status',
            img: `https://github.com/${vcsOwner}/${vcsName}/workflows/Node.js%20CI/badge.svg`,
            link: `https://github.com/${vcsOwner}/${vcsName}/actions?query=workflow%3A%22Node.js+CI%22`
          }
        }
      },
      nextSteps: [{summary: 'Enable building branches in GitHub Actions for the chosen dependency updater'}]
    });

    assert.calledWith(configScaffolder.default, {projectRoot, projectType});
  });
});
