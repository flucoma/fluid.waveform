import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

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
            replace({
              preventAssignment:true, 
              'Float32Array':'Array'        
            }), 
            getBabelOutputPlugin({
              presets: ['@babel/preset-env']
            })]
};
