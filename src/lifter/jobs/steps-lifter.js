import stepLifter from './step-lifter';

export default function (steps) {
  return steps.filter(step => 'nvm' !== step.id).map(stepLifter);
}
