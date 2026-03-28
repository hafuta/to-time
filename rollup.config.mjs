import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const umd = { format: 'umd', name: 'toTime' };

const plugins = [resolve(), commonjs()];

export default [
    {
        input: 'src/index.js',
        output: { ...umd, file: 'lib/to-time.js' },
        plugins: [...plugins]
    },
    {
        input: 'src/index.js',
        output: { ...umd, file: 'lib/to-time.min.js' },
        plugins: [...plugins, terser()]
    }
];
