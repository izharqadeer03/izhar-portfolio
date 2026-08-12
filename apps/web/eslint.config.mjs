import nextConfig from '@izhar-os/eslint-config/next';

export default [
  ...nextConfig,
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
];
