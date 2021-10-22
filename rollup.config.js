import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { getBabelOutputPlugin }  from '@rollup/plugin-babel';

export default {
  input: 'src/api-max.js',
  output: {
    file: 'max-package/javascript/fav-max.js',
    format: 'cjs',
    exports: 'named'
  },
  watch: {
    include: 'src/**'
  },
  plugins: [resolve(), 
            commonjs(),
            getBabelOutputPlugin({
              presets: ['@babel/preset-env']
            })]
};
