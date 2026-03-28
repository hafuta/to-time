import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

const stylisticRules = {
    '@stylistic/indent': ['error', 4, { SwitchCase: 1, VariableDeclarator: 2 }],
    '@stylistic/linebreak-style': ['error', 'unix'],
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/new-parens': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }]
};

export default [
    {
        ignores: ['coverage/**', 'dist/**', 'lib/**', 'node_modules/**', 'test/**']
    },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.amd,
                ...globals.mocha
            }
        },
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            camelcase: ['error', { properties: 'never' }],
            ...stylisticRules,
            'no-empty': 'error',
            'no-nested-ternary': 'error',
            'no-sparse-arrays': 'error',
            'no-var': 'error',
            'prefer-arrow-callback': 'error'
        }
    },
    {
        files: ['rollup.config.mjs'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: globals.node
        },
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            ...stylisticRules,
            'no-var': 'error',
            'prefer-arrow-callback': 'error'
        }
    }
];
