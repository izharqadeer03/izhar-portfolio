import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { baseConfig } from './base.mjs';

/**
 * Flat config for framework-agnostic React libraries.
 *
 * The same Hooks and accessibility rules the application enforces, without the
 * Next.js plugin — a shared component package has no pages directory, no Router
 * and no Image component, so those rules can only produce noise here.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export const reactConfig = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
];

export default reactConfig;
