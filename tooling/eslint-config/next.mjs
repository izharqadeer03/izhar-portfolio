import nextPlugin from '@next/eslint-plugin-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { baseConfig } from './base.mjs';

/**
 * Flat config for the Next.js application.
 * Layers React Hooks correctness + accessibility on top of the base config —
 * IZHAR OS is keyboard navigable, so a11y rules are errors, not warnings.
 *
 * @type {import('eslint').Linter.Config[]}
 */
export const nextConfig = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // The desktop surface is an application canvas: it legitimately listens for
      // pointer events on non-interactive regions (marquee, context menu, deselect).
      // Keyboard equivalents are provided explicitly where they matter.
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
    },
  },
];

export default nextConfig;
