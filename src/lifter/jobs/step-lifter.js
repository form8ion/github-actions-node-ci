import semver from 'semver';

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
  return 'bahmutov/npm-install@v1' === step.uses;
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
    return {run: 'npm clean-install'};
  }

  return step;
}
