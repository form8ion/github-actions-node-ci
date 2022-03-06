function stepIsForSettingUpNode(step) {
  return 'Setup node' === step.name;
}

function nvmrcReadWithLegacyApproach(step) {
  // eslint-disable-next-line no-template-curly-in-string
  return '${{ steps.nvm.outputs.NVMRC }}' === step.with['node-version'];
}

function stepIsLegacyInstallAction(step) {
  return 'bahmutov/npm-install@v1' === step.uses;
}

export default function (step) {
  if (stepIsForSettingUpNode(step) && nvmrcReadWithLegacyApproach(step)) {
    const {'node-version': nodeVersion, ...otherWithProperties} = step.with;

    return {...step, with: {...otherWithProperties, 'node-version-file': '.nvmrc'}};
  }

  if (stepIsLegacyInstallAction(step)) {
    return {run: 'npm clean-install'};
  }

  return step;
}
