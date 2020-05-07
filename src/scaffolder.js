import scaffoldConfig from './config-scaffolder';

export default async function ({projectRoot}) {
  await scaffoldConfig({projectRoot});

  return {};
}
