import type { OperatingSystemMeta, PlatformEntry, SystemProfile } from '@izhar-os/types';

/**
 * Identity of the operating system itself.
 * Phase 1 keeps this static; a later phase can source it remotely without
 * changing a single consumer.
 */
export const OS_META: OperatingSystemMeta = {
  name: 'IZHAR OS',
  shortName: 'IZ',
  version: '2.0.0',
  channel: 'Phase 4 — Production',
  description: 'Personal Developer Workspace',
};

export const SYSTEM_PROFILE: SystemProfile = {
  name: 'Izhar Qadeer',
  wordmark: 'IZHAR',
  role: 'Software Engineer / Backend Engineer',
  // Ordered by depth, not by breadth: the title says what the work spans, the
  // disciplines say where the expertise is — and backend leads.
  disciplines: ['Backend & Go/Node', 'Distributed Systems', 'AI & LLM Integration'],
  location: 'New Delhi, India',
  tagline: 'Welcome to my workspace.',
  statement:
    'Software Engineer / Backend Engineer with approximately 3 years of experience building scalable systems using Golang, Node.js, PostgreSQL, Redis, and modern full-stack architectures, integrating AI/LLM systems and real-time duplex pipelines.',
  experience: '3 Years (2023 — Present)',
  status: {
    state: 'available',
    label: 'Available',
    detail: 'Open to AI Development, Full Stack Freelancing & Engineering Roles.',
  },
  links: [
    { id: 'github', label: 'GitHub', href: 'https://github.com/izharqadeer03', icon: 'github' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/izhar-qadeer-840b3919a', icon: 'linkedin' },
    { id: 'email', label: 'Email', href: 'mailto:izharqadeer03@gmail.com', icon: 'mail' },
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
  { label: 'Phase 2', detail: 'Portfolio applications and content', done: true },
  { label: 'Phase 3', detail: 'Projects explorer and case studies', done: true },
  { label: 'Phase 4', detail: 'Polish, interactions and production readiness', done: true },
];
