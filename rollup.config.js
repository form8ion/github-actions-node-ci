/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import nodeResolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';

export default {
  input: 'src/index.js',
  plugins: [
    autoExternal(),
    nodeResolve({mainFields: ['module']})
  ],
  output: [
    {file: './lib/index.js', format: 'esm', sourcemap: true}
  ]
};
