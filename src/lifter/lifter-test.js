import {promises as fs} from 'fs';
import jsYaml from 'js-yaml';

import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';

import * as jobsLifter from './jobs/lifter';
import * as branchListMerger from './branches/merge-branches';
import lift from './lifter';

suite('lifter', () => {
  let sandbox;
  const projectRoot = any.string();
  const rawExistingConfig = any.string();
  const dumpedConfig = any.string();
  const existingJobs = any.listOf(any.simpleObject);
  const liftedJobs = any.listOf(any.simpleObject);

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(jsYaml, 'load');
    sandbox.stub(jsYaml, 'dump');
    sandbox.stub(branchListMerger, 'default');
    sandbox.stub(jobsLifter, 'default');

    fs.readFile.withArgs(`${projectRoot}/.github/workflows/node-ci.yml`, 'utf-8').resolves(rawExistingConfig);
    jobsLifter.default.withArgs(existingJobs).returns(liftedJobs);
  });

  teardown(() => sandbox.restore());

  test('that the config is not updated when no additional branches are provided', async () => {
    const existingConfig = {
      ...any.simpleObject(),
      on: {...any.simpleObject(), push: {branches: any.listOf(any.word)}},
      jobs: existingJobs
    };
    jsYaml.load.withArgs(rawExistingConfig).returns(existingConfig);
    jsYaml.dump.withArgs({...existingConfig, jobs: liftedJobs}).returns(dumpedConfig);

    assert.deepEqual(await lift({projectRoot, results: any.simpleObject()}), {});

    assert.called(jobsLifter.default);
    assert.calledWith(fs.writeFile, `${projectRoot}/.github/workflows/node-ci.yml`, dumpedConfig);
  });

  test('that the additional branches are appended to the existing list', async () => {
    const branchesToVerify = any.listOf(any.word);
    const existingBranches = any.listOf(any.word);
    const existingConfig = {
      ...any.simpleObject(),
      on: {...any.simpleObject(), push: {branches: existingBranches}},
      jobs: existingJobs
    };
    const mergedBranches = any.listOf(any.word);
    jsYaml.load.withArgs(rawExistingConfig).returns(existingConfig);
    branchListMerger.default.withArgs(existingBranches, branchesToVerify).returns(mergedBranches);
    jsYaml.dump
      .withArgs({...existingConfig, on: {...existingConfig.on, push: {branches: mergedBranches}}, jobs: liftedJobs})
      .returns(dumpedConfig);

    assert.deepEqual(await lift({projectRoot, results: {...any.simpleObject(), branchesToVerify}}), {});

    assert.calledWith(fs.writeFile, `${projectRoot}/.github/workflows/node-ci.yml`, dumpedConfig);
  });
});
