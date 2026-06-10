import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  globalIgnores(['node_modules/**', 'dist/**']),
  {
    basePath: 'backend',
    files: ['**/*.{ts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'commonjs',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  eslintConfigPrettier,
]);