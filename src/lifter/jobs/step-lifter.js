import semver from 'semver';
import {scaffoldDependencyInstallationStep} from '@form8ion/github-workflows-core';

function stepIsForSettingUpNode(step) {
  return 'Setup node' === step.name;
}

function nvmrcReadWithLegacyApproach(step) {
  // eslint-disable-next-line no-template-curly-in-string
  return '${{ steps.nvm.outputs.NVMRC }}' === step.with['node-version'];
}

function nodeVersionIsDefinedStatically(step) {
  return !!semver.coerce(step.with['node-version']);
}

function stepIsLegacyInstallAction(step) {
  return step.uses?.startsWith('bahmutov/npm-install@');
}

function versionShouldBeDeterminedFromNvmrc(step) {
  return nvmrcReadWithLegacyApproach(step) || nodeVersionIsDefinedStatically(step);
}

export default function (step) {
  if (stepIsForSettingUpNode(step)) {
    const {'node-version': nodeVersion, ...otherWithProperties} = step.with;

    return {
      ...step,
      with: {
        ...otherWithProperties,
        ...versionShouldBeDeterminedFromNvmrc(step) ? {'node-version-file': '.nvmrc'} : {'node-version': nodeVersion},
        cache: 'npm'
      }
    };
  }

  if (stepIsLegacyInstallAction(step)) {
    return scaffoldDependencyInstallationStep();
  }

  return step;
}
