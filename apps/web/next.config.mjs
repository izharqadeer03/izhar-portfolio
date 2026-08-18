import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, '../../.env');

// Prioritize root .env file across the entire application
if (fs.existsSync(rootEnvPath)) {
  const envContent = fs.readFileSync(rootEnvPath, 'utf-8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

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
