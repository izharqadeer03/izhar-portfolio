import { OS_META, SYSTEM_PROFILE } from '@izhar-os/config';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import { Inter, Ubuntu, Ubuntu_Mono } from 'next/font/google';

import './globals.css';

/**
 * Three voices, one document.
 *
 * IZHAR OS is set in Geist; each environment then borrows the *voice* of the
 * desktop it quotes. The stacks in globals.css ask for the real system font
 * first, so nobody downloads a typeface their machine already ships — these
 * are the fallbacks that make the difference visible on the machines that
 * don't: Ubuntu's own family for the Ubuntu environment, and Inter standing in
 * for Segoe and SF where neither is installed.
 */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
});

const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ubuntu-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SYSTEM_PROFILE.name} · ${SYSTEM_PROFILE.role} — ${OS_META.name}`,
    template: `%s — ${OS_META.name}`,
  },
  description: `The personal developer workspace of ${SYSTEM_PROFILE.name}, ${SYSTEM_PROFILE.role} (${SYSTEM_PROFILE.experience}). Specializing in Golang, Node.js, microservices, PostgreSQL, Redis, real-time systems, and AI/LLM integrations.`,
  applicationName: OS_META.name,
  authors: [{ name: SYSTEM_PROFILE.name, url: 'https://github.com/izharqadeer03' }],
  creator: SYSTEM_PROFILE.name,
  keywords: [
    'Izhar Qadeer',
    'Software Engineer',
    'Backend Engineer',
    'Full Stack Developer',
    'Golang',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'Redis',
    'Microservices',
    'AI Integrations',
    'LLM Agents',
    'WebSockets',
    'Next.js',
    'React',
    'IZHAR OS',
    'Interactive Portfolio',
  ],
  openGraph: {
    title: `${SYSTEM_PROFILE.name} · ${SYSTEM_PROFILE.role} — ${OS_META.name}`,
    description: `Explore the interactive developer workspace of ${SYSTEM_PROFILE.name} — Golang, Node.js, Microservices, Distributed Systems & AI.`,
    type: 'website',
    siteName: OS_META.name,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SYSTEM_PROFILE.name} · ${SYSTEM_PROFILE.role}`,
    description: `Software Engineer with ~3 years experience in Golang, Node.js, Scalable APIs, Microservices & AI systems.`,
    creator: '@izharqadeer03',
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
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${ubuntu.variable} ${ubuntuMono.variable}`}
    >
      <body className="bg-void text-fg antialiased">{children}</body>
    </html>
  );
}
