import type { ApplicationDefinition, ApplicationId } from '@izhar-os/types';

/**
 * The application manifest — the single source of truth for what exists in
 * IZHAR OS. The desktop, launcher, search, file manager, terminal and window
 * manager all read from here, in every environment, so registering a future
 * application (say, "AI Assistant") is a matter of appending one entry and
 * mapping its content component in the web app's ApplicationRegistry. It then
 * appears in Windows, macOS and Ubuntu at once.
 */
export const APPLICATIONS: ApplicationDefinition[] = [
  {
    id: 'about',
    title: 'About Izhar',
    shortTitle: 'About',
    description: 'Background, engineering focus and the systems I build.',
    category: 'workspace',
    status: 'available',
    accent: 'cyan',
    icon: 'user',
    keywords: [
      'bio',
      'profile',
      'who',
      'story',
      'me',
      'izhar',
      'full stack',
      'backend',
      'frontend',
      'introduction',
    ],
    // Wide enough for the navigation pane and the content column side by side.
    defaultSize: { width: 940, height: 660 },
    minSize: { width: 420, height: 380 },
    showOnDesktop: true,
    entry: { kind: 'document', name: 'About.txt', typeLabel: 'Text Document' },
  },
  {
    id: 'projects',
    title: 'Projects Explorer',
    shortTitle: 'Projects',
    description: 'Explore engineering projects, interactive architectures and case studies.',
    category: 'workspace',
    status: 'available',
    accent: 'violet',
    icon: 'projects',
    keywords: [
      'work',
      'case study',
      'portfolio',
      'apps',
      'repos',
      'architecture',
      'lands and homes',
      'boostai',
      'practice management',
      'chat sdk',
      'dekhbhal',
    ],
    defaultSize: { width: 940, height: 640 },
    minSize: { width: 440, height: 360 },
    showOnDesktop: true,
    entry: { kind: 'folder', name: 'Projects Explorer', typeLabel: 'File folder' },
  },
  {
    id: 'experience',
    title: 'Experience',
    shortTitle: 'Experience',
    description: 'Roles, responsibilities and delivered engineering outcomes.',
    category: 'workspace',
    status: 'available',
    accent: 'emerald',
    icon: 'experience',
    keywords: ['career', 'jobs', 'history', 'roles', 'timeline', 'work', 'companies'],
    defaultSize: { width: 880, height: 640 },
    minSize: { width: 420, height: 360 },
    showOnDesktop: true,
    entry: { kind: 'folder', name: 'Experience', typeLabel: 'File folder' },
  },
  {
    id: 'skills',
    title: 'Skills Matrix',
    shortTitle: 'Skills',
    description: 'Languages, frameworks, databases, and infrastructure I build with.',
    category: 'workspace',
    status: 'available',
    accent: 'amber',
    icon: 'skills',
    keywords: ['stack', 'tech', 'tools', 'languages', 'frameworks', 'golang', 'typescript', 'react', 'databases'],
    defaultSize: { width: 880, height: 620 },
    minSize: { width: 420, height: 360 },
    showOnDesktop: true,
    entry: { kind: 'folder', name: 'Skills', typeLabel: 'File folder' },
  },
  {
    id: 'ai-lab',
    title: 'AI Lab & Assistant',
    shortTitle: 'AI Lab',
    description: 'Interactive AI assistant, experiments, and agent runtimes.',
    category: 'workspace',
    status: 'available',
    accent: 'cyan',
    icon: 'ai',
    keywords: ['ai', 'ml', 'agent', 'assistant', 'llm', 'lab', 'experiments', 'chat', 'tools'],
    defaultSize: { width: 880, height: 620 },
    minSize: { width: 420, height: 360 },
    showOnDesktop: true,
    entry: { kind: 'application', name: 'AI Lab', typeLabel: 'Application' },
  },
  {
    id: 'resume',
    title: 'Resume Viewer',
    shortTitle: 'Resume',
    description: 'A readable, printable, and downloadable summary of the work.',
    category: 'workspace',
    status: 'available',
    accent: 'slate',
    icon: 'resume',
    keywords: ['cv', 'download', 'pdf', 'document', 'resume', 'print', 'bio'],
    defaultSize: { width: 820, height: 680 },
    minSize: { width: 420, height: 380 },
    showOnDesktop: true,
    entry: { kind: 'document', name: 'Resume.pdf', typeLabel: 'PDF Document' },
  },
  {
    id: 'contact',
    title: 'Contact Station',
    shortTitle: 'Contact',
    description: 'Start a conversation about engineering roles, projects, or collaboration.',
    category: 'workspace',
    status: 'available',
    accent: 'rose',
    icon: 'contact',
    keywords: ['email', 'message', 'hire', 'reach', 'connect', 'social', 'github', 'linkedin'],
    defaultSize: { width: 720, height: 580 },
    minSize: { width: 380, height: 360 },
    showOnDesktop: true,
    entry: { kind: 'link', name: 'Contact.url', typeLabel: 'Internet Shortcut' },
  },
  {
    id: 'files',
    title: 'Portfolio',
    shortTitle: 'Portfolio',
    description: 'Browse the whole portfolio as a file system.',
    category: 'system',
    status: 'available',
    accent: 'amber',
    icon: 'files',
    keywords: ['explorer', 'finder', 'files', 'nautilus', 'browse', 'folders', 'home'],
    defaultSize: { width: 900, height: 580 },
    minSize: { width: 480, height: 360 },
    showOnDesktop: true,
    entry: { kind: 'application', name: 'Portfolio', typeLabel: 'File folder' },
  },
  {
    id: 'terminal',
    title: 'Terminal',
    shortTitle: 'Terminal',
    description: 'A working shell over the same portfolio data.',
    category: 'system',
    status: 'available',
    accent: 'emerald',
    icon: 'terminal',
    keywords: ['shell', 'console', 'bash', 'command', 'cli', 'zsh'],
    defaultSize: { width: 760, height: 460 },
    minSize: { width: 400, height: 260 },
    showOnDesktop: true,
    entry: { kind: 'application', name: 'Terminal', typeLabel: 'Application' },
  },
  {
    id: 'system-info',
    title: 'System Information',
    shortTitle: 'System',
    description: 'Live details about this workspace and its operator.',
    category: 'system',
    status: 'available',
    accent: 'cyan',
    icon: 'system',
    keywords: ['about system', 'specs', 'version', 'os', 'platform', 'info'],
    defaultSize: { width: 660, height: 580 },
    minSize: { width: 360, height: 380 },
    showOnDesktop: false,
    entry: { kind: 'application', name: 'System Information', typeLabel: 'Application' },
  },
];

const APPLICATION_INDEX = new Map<ApplicationId, ApplicationDefinition>(
  APPLICATIONS.map((application) => [application.id, application]),
);

export function getApplication(id: ApplicationId): ApplicationDefinition | undefined {
  return APPLICATION_INDEX.get(id);
}

/** Applications that receive a desktop shortcut, in display order. */
export const DESKTOP_APPLICATIONS: ApplicationDefinition[] = APPLICATIONS.filter(
  (application) => application.showOnDesktop,
);

/**
 * The portfolio itself, as a file listing — folders first, then documents and
 * links, which is the order every file manager in existence uses. The file
 * managers and the terminal both read this, so `ls` and Explorer can never
 * disagree about what the portfolio contains.
 */
export const PORTFOLIO_ENTRIES: ApplicationDefinition[] = APPLICATIONS.filter(
  (application) => application.category === 'workspace',
).sort((a, b) => {
  const rank = (kind: string) => (kind === 'folder' ? 0 : kind === 'document' ? 1 : 2);
  const delta = rank(a.entry.kind) - rank(b.entry.kind);
  return delta !== 0 ? delta : a.entry.name.localeCompare(b.entry.name);
});

/**
 * Ranked launcher search. Prefix matches on the title outrank keyword hits so
 * typing "proj" lands on Projects rather than something that merely mentions it.
 */
export function searchApplications(query: string): ApplicationDefinition[] {
  const term = query.trim().toLowerCase();
  if (!term) return APPLICATIONS;

  const scored = APPLICATIONS.map((application) => {
    const title = application.title.toLowerCase();
    const short = application.shortTitle.toLowerCase();

    let score = -1;
    if (title === term || short === term) score = 100;
    else if (title.startsWith(term) || short.startsWith(term)) score = 80;
    else if (title.includes(term)) score = 60;
    else if (application.keywords.some((keyword) => keyword.startsWith(term))) score = 40;
    else if (application.keywords.some((keyword) => keyword.includes(term))) score = 25;
    else if (application.description.toLowerCase().includes(term)) score = 10;

    return { application, score };
  }).filter((entry) => entry.score >= 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.application);
}
