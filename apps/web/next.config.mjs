/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Workspace packages ship TypeScript source rather than a build step, so Next
  // compiles them alongside the app. Adding a package here is all it takes.
  transpilePackages: ['@izhar-os/ui', '@izhar-os/types', '@izhar-os/config'],

  experimental: {
    // Keeps icon and 3D helper imports from pulling their whole barrel file in.
    optimizePackageImports: ['lucide-react', '@react-three/drei'],
  },

  // The desktop renders no remote images in Phase 1; tighten the default policy
  // so nothing loads from an unexpected origin later by accident.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
