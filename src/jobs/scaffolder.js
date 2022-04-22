import {checkout, executeVerification, installDependencies, setupNode} from '../steps/scaffolders';

export function nvmrcVerification() {
  return {
    'runs-on': 'ubuntu-latest',
    steps: [checkout(), setupNode({versionDeterminedBy: 'nvmrc'}), installDependencies(), executeVerification()]
  };
}

export function matrixVerification(nodeEnginesMatrix) {
  return {
    'runs-on': 'ubuntu-latest',
    strategy: {matrix: {node: nodeEnginesMatrix}},
    steps: [checkout(), setupNode({versionDeterminedBy: 'matrix'}), installDependencies(), executeVerification()]
  };
}
