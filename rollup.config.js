import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default {
  input: "custom-templates/image-grids/flex-dest/dev/js/index.js",
  output: {
    file: "custom-templates/image-grids/flex-dest/dev/js/bundle.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      extensions: [".js", ".jsx"],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ["@babel/preset-react"],
    }),
    commonjs()
  ]
};