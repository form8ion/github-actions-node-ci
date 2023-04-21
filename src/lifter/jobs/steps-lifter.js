import stepLifter from './step-lifter';

export default function (steps) {
  return steps
    .filter(step => 'nvm' !== step.id)
    .reduce((acc, step) => {
      const liftedStep = stepLifter(step);

      return ([...acc, ...Array.isArray(liftedStep) ? liftedStep : [liftedStep]]);
    }, []);
}
