import { OS_META, SYSTEM_PROFILE } from '@izhar-os/config';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${OS_META.name} — ${OS_META.description}`,
    template: `%s — ${OS_META.name}`,
  },
  description: `The workspace of ${SYSTEM_PROFILE.name}, ${SYSTEM_PROFILE.role}. An interactive desktop environment rather than a portfolio page.`,
  applicationName: OS_META.name,
  authors: [{ name: SYSTEM_PROFILE.name }],
  keywords: [
    'full stack developer',
    'software engineer',
    'portfolio',
    'interactive',
    'web operating system',
    'three.js',
  ],
  openGraph: {
    title: `${OS_META.name} — ${OS_META.description}`,
    description: `Boot into the workspace of ${SYSTEM_PROFILE.name}, ${SYSTEM_PROFILE.role}.`,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#050608',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // Deliberately not locking zoom — the OS metaphor never justifies removing it.
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-void text-fg antialiased">{children}</body>
    </html>
  );
}
