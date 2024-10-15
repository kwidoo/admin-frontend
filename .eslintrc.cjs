const dotenv = require('dotenv');

dotenv.config();

const isDev = !['prod', 'production'].includes(process.env.APP_ENV || 'dev');

const envRules = isDev
    ? {
          'no-unused-vars': 'off',
          'no-console': 'off',
          'no-debugger': 'off',
          'vue/no-unused-components': 'off',
      }
    : {
          'no-console': 'error',
      };

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['.eslintrc.{js,cjs,vue,ts,tsx}', '*.vue'],
            parser: 'vue-eslint-parser',
        },
        {
            files: ['*.ts', '*.tsx'], // Targeting TypeScript files specifically
            parser: '@typescript-eslint/parser', // Use the TypeScript parser for these files
            parserOptions: {
                parser: '@typescript-eslint/parser',
                tsconfigRootDir: __dirname,
                ecmaVersion: 2021,
                sourceType: 'module',
                project: ['./tsconfig.json'], // Point to your tsconfig.json
                ignorePatterns: ['.eslintrc.cjs'],
            },
            extends: [
                'plugin:@typescript-eslint/recommended', // Use TypeScript recommended rules
            ],
        },
    ],
    extends: [
        'airbnb-base',
        'plugin:vue/vue3-strongly-recommended',
        'prettier',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier',
        'plugin:storybook/recommended',
    ],
    rules: {
        ...envRules,
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'no-throw-literal': 'off',
        'no-use-before-define': 'error',
        'object-shorthand': ['error', 'always', { avoidQuotes: false }],
        'import/no-extraneous-dependencies': 'off',
        'prettier/prettier': ['off', { trailingComma: 'es5' }],
        'comma-dangle': ['error', 'always-multiline'],
        'vue/comma-dangle': ['error', 'always-multiline'],
        'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
        semi: ['error', 'always'],
        'vue/first-attribute-line': ['off'],
        'vue/multi-word-component-names': 'off',
        'vue/html-quotes': ['error', 'double'],
        'import/extensions': ['off'],
        quotes: ['error', 'single'],
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['_components', './src/components'],
                    ['_composables', './src/composables'],
                    ['_plugins', './src/plugins'],
                    ['_pages', './src/pages'],
                    ['_store', './src/store'], // Corrected typo in the path
                    ['@/*', './src'], // Ensured consistency in path definition
                ],
                extensions: ['.cjs', '.js', '.jsx', '.ts', '.tsx', '.vue', '.css', '.svg', '.woff'],
            },
        },
    },
    plugins: ['prettier', 'vue', '@typescript-eslint'],
};
