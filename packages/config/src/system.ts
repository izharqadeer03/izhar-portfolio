import type { OperatingSystemMeta, PlatformEntry, SystemProfile } from '@izhar-os/types';

/**
 * Identity of the operating system itself.
 * Phase 1 keeps this static; a later phase can source it remotely without
 * changing a single consumer.
 */
export const OS_META: OperatingSystemMeta = {
  name: 'IZHAR OS',
  shortName: 'IZ',
  version: '1.6.0',
  channel: 'Phase 2 — Applications',
  description: 'Personal Developer Workspace',
};

export const SYSTEM_PROFILE: SystemProfile = {
  name: 'Izhar Qadeer',
  wordmark: 'IZHAR',
  role: 'Full Stack Developer',
  // Ordered by depth, not by breadth: the title says what the work spans, the
  // disciplines say where the expertise is — and backend leads.
  disciplines: ['Backend', 'Full Stack', 'AI / LLM'],
  location: 'India',
  tagline: 'Welcome to my workspace.',
  statement:
    'Building scalable APIs, realtime services and AI-powered systems in Golang and Node.js — and the Next.js and React interfaces on top of them.',
  experience: '3+ Years',
  status: {
    state: 'available',
    label: 'Available',
    detail: 'Open to new projects and engineering roles.',
  },
  links: [
    { id: 'github', label: 'GitHub', href: 'https://github.com', icon: 'github' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { id: 'email', label: 'Email', href: 'mailto:hello@example.com', icon: 'mail' },
  ],
};

/** Rows rendered by the System Information application. */
export const PLATFORM_ENTRIES: PlatformEntry[] = [
  { label: 'Framework', value: 'Next.js 16 · App Router' },
  { label: 'Interface', value: 'React 19 · TypeScript' },
  { label: 'Environment', value: 'Three.js · React Three Fiber' },
  { label: 'Styling', value: 'Tailwind CSS 4 · Motion' },
  { label: 'Workspace', value: 'pnpm · Turborepo' },
];

/** Roadmap surfaced in System Information so the OS explains its own phases. */
export const ROADMAP: { label: string; detail: string; done: boolean }[] = [
  { label: 'Phase 1', detail: 'Workspace, window manager, environment', done: true },
  { label: 'Phase 1.5', detail: 'Windows, macOS and Ubuntu environments', done: true },
  { label: 'Phase 2', detail: 'Portfolio applications and content', done: false },
  { label: 'Phase 3', detail: 'AI Lab and assistant services', done: false },
];
