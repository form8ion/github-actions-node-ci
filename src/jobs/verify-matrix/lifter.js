export default function (job, {inRangeNodeVersions}) {
  if (!inRangeNodeVersions) return job;

  return {...job, strategy: {matrix: {node: inRangeNodeVersions}}};
}
