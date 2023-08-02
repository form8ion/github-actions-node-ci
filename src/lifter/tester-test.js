import core from '@form8ion/core';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import testThatCiWorkflowExists from './tester';

suite('match predicate', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(core, 'fileExists');
  });

  teardown(() => sandbox.restore());

  test('that `false` is returned when no ci workflow file exists', async () => {
    core.fileExists.resolves(false);

    assert.isFalse(await testThatCiWorkflowExists({projectRoot}));
  });

  test('that `true` is returned when a ci workflow file exists', async () => {
    core.fileExists.withArgs(`${projectRoot}/.github/workflows/node-ci.yml`).resolves(true);

    assert.isTrue(await testThatCiWorkflowExists({projectRoot}));
  });
});
