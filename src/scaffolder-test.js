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

    assert.deepEqual(await scaffold({projectRoot}), {});

    assert.calledWith(configScaffolder.default, {projectRoot});
  });
});
