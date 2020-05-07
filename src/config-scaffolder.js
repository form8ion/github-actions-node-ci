import mkdir from '../thirdparty-wrappers/make-dir';
import writeYaml from '../thirdparty-wrappers/write-yaml';

export default async function ({projectRoot}) {
  return writeYaml(
    `${await mkdir(`${projectRoot}/.github/workflows`)}/node-ci.yml`,
    {
      name: 'Node.js CI'
    }
  );
}
