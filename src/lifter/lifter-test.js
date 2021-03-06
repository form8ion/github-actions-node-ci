import {promises as fs} from 'fs';
import jsYaml from 'js-yaml';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as branchListMerger from './merge-branches';
import lift from './lifter';

suite('lifter', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(jsYaml, 'load');
    sandbox.stub(jsYaml, 'dump');
    sandbox.stub(branchListMerger, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the config is not updated when no additional branches are provided', async () => {
    assert.deepEqual(await lift({projectRoot, results: any.simpleObject()}), {});

    assert.notCalled(fs.readFile);
    assert.notCalled(jsYaml.load);
  });

  test('that the additional branches are appended to the existing list', async () => {
    const existingBranches = any.listOf(any.word);
    const branchesToVerify = any.listOf(any.word);
    const existingConfig = {...any.simpleObject(), on: {push: {branches: existingBranches}}};
    const rawExistingConfig = any.string();
    const dumpedConfig = any.string();
    const mergedBranches = any.listOf(any.word);
    fs.readFile.withArgs(`${projectRoot}/.github/workflows/node-ci.yml`, 'utf-8').resolves(rawExistingConfig);
    jsYaml.load.withArgs(rawExistingConfig).returns(existingConfig);
    branchListMerger.default.withArgs(existingBranches, branchesToVerify).returns(mergedBranches);
    jsYaml.dump
      .withArgs({...existingConfig, on: {push: {branches: mergedBranches}}})
      .returns(dumpedConfig);

    assert.deepEqual(await lift({projectRoot, results: {...any.simpleObject(), branchesToVerify}}), {});

    assert.calledWith(fs.writeFile, `${projectRoot}/.github/workflows/node-ci.yml`, dumpedConfig);
  });
});
