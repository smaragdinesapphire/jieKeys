module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  parserOptions: { ecmaVersion: 8, sourceType: 'module' }, // to enable features such as async/await
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)
  extends: ['eslint:recommended'],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: { react: { version: 'detect' } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // TypeScript rules
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:jsx-a11y/recommended', // Accessibility rules
        'plugin:prettier/recommended', // Prettier plugin
      ],
      rules: {
        // We will use TypeScript's types for component props instead
        'react/prop-types': 'off',

        // No need to import React when using Next.js
        'react/react-in-jsx-scope': 'off',

        // This rule is not compatible with Next.js's <Link /> components
        'jsx-a11y/anchor-is-valid': 'off',

        // Why would you want unused vars?
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],

        // I suggest this setting for requiring return types on functions only where useful
        '@typescript-eslint/explicit-function-return-type': [
          'warn',
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
        'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Includes .prettierrc.js rules
        'no-restricted-imports': [
          'error',
          {
            patterns: ['@material-ui/*/*/*', '!@material-ui/core/test-utils/*'],
          },
        ],
      },
    },
    {
      files: ['**/*.js', '**/*.jsx'],
      parser: 'babel-eslint',
      settings: { react: { version: 'detect' } },
      env: {
        commonjs: true,
        browser: true,
        node: true,
        es6: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // enable linting for jsx files
        },
        ecmaVersion: 11,
        sourceType: 'module',
      },
      extends: [
        'airbnb',
        'airbnb/hooks',
        'plugin:react/recommended', // React rules
        'plugin:react-hooks/recommended', // React hooks rules
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:jsx-a11y/recommended', // Accessibility rules
        'plugin:prettier/recommended', // Prettier plugin
      ],
      rules: {
        'prettier/prettier': ['error'],
        'import/no-named-as-default': 'off',
        'no-underscore-dangle': ['error', { allowAfterThis: true }],
        'no-unused-vars': ['error', { ignoreRestSiblings: true }],
      },
    },
  ],
};
