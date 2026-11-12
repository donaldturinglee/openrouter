import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import {defineConfig} from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// ESLint reads this file's default export.
export default defineConfig(
  {ignores: ['build', 'playwright-report', 'test-results', 'blob-report']},
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {prettier},
    rules: {
      eqeqeq: ['error', 'always'],
      // A binding that is unused on purpose starts with an underscore.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Reports whatever Prettier would reformat.
      'prettier/prettier': 'error',
    },
  },
  {
    // The router module exports the function that builds its routes beside
    // its components, which fast refresh can't follow.
    files: ['src/router/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // These run in Node.js rather than in a browser.
    files: [
      'vite.config.ts',
      'playwright.config.ts',
      'tests/**/*.{ts,tsx}',
      'e2e/**/*.ts',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
);
