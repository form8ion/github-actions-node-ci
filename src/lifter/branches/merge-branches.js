export default function mergeBranches(existingBranches, additionalBranches) {
  return [...existingBranches, ...additionalBranches.filter(branch => !existingBranches.includes(branch))];
}
