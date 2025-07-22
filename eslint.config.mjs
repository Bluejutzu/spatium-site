import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import importSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import stylistic from "@stylistic/eslint-plugin"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    files: ['./src/**/*.{js,mjs,cjs,ts,tsx}'],
    plugins: {
      importSort,
      unusedImports,
      stylistic,
      'react-hooks': reactHooks
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true
        }
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': "off",
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: false },
        },
      ],
      'stylistic/spaced-comment': ['error', 'always', { markers: ['!'] }],
      'stylistic/no-extra-semi': 'error',
      'importSort/imports': 'error',
      'importSort/exports': 'error',
    },
  },
  {
    ignores: [
      'packages/**',
      'node_modules/**',
      '.next/**',
      'convex/**',
      'dist/**',
      'build/**',
      'out/**',
      'convex/_generated/**',
      '*.min.js',
      '*.min.css',
      '*.config.ts',
      '*.mjs',
      '*.json'
    ],
  },
)

