import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const umd = { format: 'umd', name: 'toTime' };

const dualPackagePlugins = [resolve(), commonjs()];
const umdPlugins = [resolve(), commonjs()];

export default [
    {
        input: 'src/index.js',
        output: [
            {
                file: 'dist/index.mjs',
                format: 'es',
                sourcemap: true
            },
            {
                file: 'dist/index.cjs',
                format: 'cjs',
                exports: 'auto',
                sourcemap: true
            }
        ],
        external: ['bignumber.js'],
        plugins: dualPackagePlugins
    },
    {
        input: 'src/index.js',
        output: { ...umd, file: 'lib/to-time.js' },
        plugins: [...umdPlugins]
    },
    {
        input: 'src/index.js',
        output: { ...umd, file: 'lib/to-time.min.js' },
        plugins: [...umdPlugins, terser()]
    }
];
