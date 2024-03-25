import {lift as liftStep} from '../step/index.js';

export default function (steps) {
  return steps
    .filter(step => 'nvm' !== step.id)
    .reduce((acc, step) => {
      const liftedStep = liftStep(step);

      return ([...acc, ...Array.isArray(liftedStep) ? liftedStep : [liftedStep]]);
    }, []);
}
