import {
  APPLICATIONS,
  CONTACT_CONFIG,
  EXPERIENCES,
  getEnvironment,
  OS_META,
  PORTFOLIO_ENTRIES,
  PROJECTS,
  RESUME_DATA,
  SKILL_CATEGORIES,
  SKILLS,
  SYSTEM_PROFILE,
} from '@izhar-os/config';
import type { ApplicationId, EnvironmentDefinition, EnvironmentId } from '@izhar-os/types';

/**
 * The shell's vocabulary.
 *
 * Every command reads the same manifest and profile the graphical environments
 * read, so `ls` cannot list a portfolio Explorer does not show and `about`
 * cannot describe someone the desktop does not. Commands that change the system
 * return an effect for the view to run; everything else is a pure function from
 * arguments to lines, which makes the whole shell testable and reliable.
 */

export type LineTone = 'default' | 'muted' | 'accent' | 'error' | 'heading';

export interface TerminalLine {
  text: string;
  tone?: LineTone;
}

export interface CommandEffect {
  type: 'open' | 'clear' | 'switch';
  applicationId?: ApplicationId;
  environment?: string;
}

export interface CommandResult {
  lines: TerminalLine[];
  effect?: CommandEffect;
}

export interface CommandContext {
  environment: EnvironmentDefinition;
  /** Applications with an open window, for `ps`. */
  running: { id: ApplicationId; title: string }[];
}

interface CommandDefinition {
  name: string;
  summary: string;
  /** Shown in `help` under the name. */
  usage?: string;
  run: (args: string[], context: CommandContext) => CommandResult;
}

const line = (text: string, tone?: LineTone): TerminalLine => ({ text, tone });
const blank = (): TerminalLine => ({ text: '' });

/** Applications an argument-taking command will accept, by id and by name. */
function resolveApplication(token: string) {
  const term = token.trim().toLowerCase();
  return APPLICATIONS.find(
    (application) =>
      application.id === term ||
      application.shortTitle.toLowerCase() === term ||
      application.title.toLowerCase() === term ||
      application.entry.name.toLowerCase() === term ||
      application.entry.name.toLowerCase().replace(/\.[a-z]+$/, '') === term,
  );
}

/**
 * What `workspace` will answer to.
 */
const WORKSPACE_ALIASES: Record<string, EnvironmentId | undefined> = {
  windows: 'windows',
  macos: 'macos',
  mac: 'macos',
  ubuntu: 'linux',
  linux: 'linux',
};

const COMMANDS: CommandDefinition[] = [
  {
    name: 'help',
    summary: 'List everything this shell understands.',
    run: () => ({
      lines: [
        line('IZHAR OS Terminal — Available Commands', 'heading'),
        blank(),
        ...COMMANDS.map((command) =>
          line(`  ${command.name.padEnd(14)}${command.summary}`, 'muted'),
        ),
        blank(),
        line('Navigation & shortcuts:', 'heading'),
        line('  open <app>     Launch application in a GUI window', 'muted'),
        line('  workspace <os> Switch active OS (windows | macos | ubuntu)', 'muted'),
        line('  Tab completes · ↑ ↓ walk history · Ctrl+L clears', 'muted'),
      ],
    }),
  },
  {
    name: 'about',
    summary: 'Who this workspace belongs to.',
    run: () => ({
      lines: [
        line(SYSTEM_PROFILE.name, 'heading'),
        line(SYSTEM_PROFILE.role, 'accent'),
        blank(),
        line(SYSTEM_PROFILE.statement, 'default'),
        blank(),
        line(`  Focus:        ${SYSTEM_PROFILE.disciplines.join(' · ')}`, 'muted'),
        line(`  Experience:   ${SYSTEM_PROFILE.experience}`, 'muted'),
        line(`  Location:     ${SYSTEM_PROFILE.location}`, 'muted'),
        line(
          `  Status:       ${SYSTEM_PROFILE.status.label} — ${SYSTEM_PROFILE.status.detail}`,
          'muted',
        ),
        blank(),
        line('  Run `open about` to launch the About window.', 'muted'),
      ],
    }),
  },
  {
    name: 'skills',
    summary: 'Print engineering skills and technology matrix.',
    run: (args) => {
      const categoryFilter = args[0]?.toLowerCase();
      const relevantCategories = categoryFilter
        ? SKILL_CATEGORIES.filter(
            (c) => c.id.includes(categoryFilter) || c.name.toLowerCase().includes(categoryFilter),
          )
        : SKILL_CATEGORIES;

      const output: TerminalLine[] = [
        line('Core Engineering Skills & Tech Stack', 'heading'),
        blank(),
      ];

      for (const cat of relevantCategories) {
        const catSkills = SKILLS.filter((s) => s.category === cat.id);
        if (catSkills.length === 0) continue;

        output.push(line(`[${cat.name}]`, 'accent'));
        for (const skill of catSkills) {
          output.push(
            line(
              `  • ${skill.name.padEnd(20)} (${skill.level}, ${skill.years}) - ${skill.architecturalRole ?? skill.description}`,
              'muted',
            ),
          );
        }
        output.push(blank());
      }

      output.push(line('  Run `open skills` for the interactive visual Skills Matrix.', 'muted'));
      return { lines: output };
    },
  },
  {
    name: 'experience',
    summary: 'Print career history and engineering roles.',
    run: () => {
      const output: TerminalLine[] = [
        line('Professional Experience & Career History', 'heading'),
        blank(),
      ];

      for (const exp of EXPERIENCES) {
        output.push(line(`${exp.role} @ ${exp.company}`, 'heading'));
        output.push(line(`  Period:   ${exp.period} (${exp.duration}) · ${exp.location}`, 'accent'));
        output.push(line(`  Summary:  ${exp.summary}`, 'muted'));
        output.push(line(`  Stack:    ${exp.technologies.join(', ')}`, 'muted'));
        output.push(blank());
        output.push(line('  Key Deliverables:', 'muted'));
        for (const ach of exp.achievements.slice(0, 4)) {
          output.push(line(`    • ${ach}`, 'muted'));
        }
        output.push(blank());
      }

      output.push(line('  Run `open experience` for the interactive timeline and metrics.', 'muted'));
      return { lines: output };
    },
  },
  {
    name: 'projects',
    summary: 'List production projects and technical case studies.',
    run: () => {
      const output: TerminalLine[] = [
        line('Featured Engineering Projects', 'heading'),
        blank(),
      ];

      for (const proj of PROJECTS) {
        output.push(line(`${proj.name} [${proj.categoryName}]`, 'accent'));
        output.push(line(`  Role:         ${proj.role} · ${proj.duration}`, 'muted'));
        output.push(line(`  Description:  ${proj.shortDescription}`, 'default'));
        output.push(line(`  Technologies: ${proj.technologies.join(', ')}`, 'muted'));
        if (proj.stats && proj.stats.length > 0) {
          output.push(
            line(
              `  Highlights:   ${proj.stats.map((s) => `${s.label}: ${s.value}`).join(' · ')}`,
              'muted',
            ),
          );
        }
        output.push(blank());
      }

      output.push(line('  Run `open projects` for the interactive architecture diagrams.', 'muted'));
      return { lines: output };
    },
  },
  {
    name: 'education',
    summary: 'Print degree, university and academic qualifications.',
    run: () => {
      const output: TerminalLine[] = [
        line('Education & Academic Background', 'heading'),
        blank(),
      ];

      for (const edu of RESUME_DATA.education) {
        output.push(line(edu.degree, 'heading'));
        output.push(line(`  Institution:  ${edu.institution}`, 'accent'));
        output.push(line(`  Period:       ${edu.period} · ${edu.location}`, 'muted'));
        for (const detail of edu.details ?? []) {
          output.push(line(`  • ${detail}`, 'muted'));
        }
        output.push(blank());
      }

      if (RESUME_DATA.certifications.length > 0) {
        output.push(line('Certifications & Specializations:', 'heading'));
        for (const cert of RESUME_DATA.certifications) {
          output.push(line(`  • ${cert.name} (${cert.issuer}, ${cert.year})`, 'muted'));
        }
        output.push(blank());
      }

      return { lines: output };
    },
  },
  {
    name: 'resume',
    summary: 'Print résumé summary and export details.',
    run: () => ({
      lines: [
        line(`${RESUME_DATA.name} — ${RESUME_DATA.title}`, 'heading'),
        line(`Location: ${RESUME_DATA.location} · Email: ${RESUME_DATA.email}`, 'accent'),
        blank(),
        line('Executive Summary:', 'heading'),
        line(RESUME_DATA.summary, 'default'),
        blank(),
        line('Technical Competencies:', 'heading'),
        ...RESUME_DATA.competencies.map((comp) =>
          line(`  ${comp.category.padEnd(24)}: ${comp.skills.join(', ')}`, 'muted'),
        ),
        blank(),
        line('Download PDF: /Izhar_Qadeer_Resume.pdf', 'accent'),
        line('  Run `open resume` for the printable viewer & PDF download.', 'muted'),
      ],
    }),
  },
  {
    name: 'contact',
    summary: 'How to reach me.',
    run: () => ({
      lines: [
        line('Contact & Direct Reach Channels', 'heading'),
        blank(),
        line(`  Email:       ${CONTACT_CONFIG.email}`, 'default'),
        line(`  Location:    ${CONTACT_CONFIG.location}`, 'muted'),
        line(`  Timezone:    ${CONTACT_CONFIG.timezone}`, 'muted'),
        line(`  Status:      ${CONTACT_CONFIG.availability.status} (${CONTACT_CONFIG.availability.notice})`, 'accent'),
        blank(),
        line('Channels:', 'heading'),
        ...CONTACT_CONFIG.channels.map((ch) =>
          line(`  ${ch.label.padEnd(12)}: ${ch.value} (${ch.href})`, 'muted'),
        ),
        blank(),
        line('  Run `open contact` to send a message via the dispatch hub.', 'muted'),
      ],
    }),
  },
  {
    name: 'whoami',
    summary: 'Print current operator.',
    run: () => ({
      lines: [
        line(SYSTEM_PROFILE.name.toLowerCase().replace(/\s+/g, ''), 'heading'),
        line(`Role: ${SYSTEM_PROFILE.name} · ${SYSTEM_PROFILE.role}`, 'muted'),
        line(`Workspace: ${OS_META.name} ${OS_META.version}`, 'accent'),
      ],
    }),
  },
  {
    name: 'ls',
    summary: 'List portfolio files and folders.',
    run: () => ({
      lines: [
        ...PORTFOLIO_ENTRIES.map((application) =>
          line(
            `  ${application.entry.name.padEnd(18)}${application.entry.typeLabel.padEnd(20)}${
              application.status === 'available' ? 'ready' : 'pending'
            }`,
            application.entry.kind === 'folder' ? 'accent' : 'default',
          ),
        ),
        blank(),
        line(`  ${PORTFOLIO_ENTRIES.length} entries · Type \`open <name>\` to launch.`, 'muted'),
      ],
    }),
  },
  {
    name: 'open',
    summary: 'Open an application in a window.',
    usage: 'open <name>',
    run: (args) => {
      const token = args[0];
      if (!token) {
        return { lines: [line('open: expected an application name. Try `ls` or `help`.', 'error')] };
      }

      const application = resolveApplication(token);
      if (!application) {
        return { lines: [line(`open: no such application: ${token}`, 'error')] };
      }

      return {
        lines: [line(`Opening ${application.title}…`, 'muted')],
        effect: { type: 'open', applicationId: application.id },
      };
    },
  },
  {
    name: 'neofetch',
    summary: 'System summary.',
    run: (_args, context) => ({
      lines: [
        line(`${SYSTEM_PROFILE.wordmark.toLowerCase()}@portfolio`, 'accent'),
        line('─────────────────────────────────────────', 'muted'),
        line(`OS          ${OS_META.name} ${OS_META.version}`, 'muted'),
        line(`Environment ${context.environment.name}`, 'muted'),
        line(`Shell       izsh (zsh/bash compatible)`, 'muted'),
        line(`Channel     ${OS_META.channel}`, 'muted'),
        line(`Operator    ${SYSTEM_PROFILE.name}`, 'muted'),
        line(`Role        ${SYSTEM_PROFILE.role}`, 'muted'),
        line(`Focus       ${SYSTEM_PROFILE.disciplines.join(' · ')}`, 'muted'),
        line(`Status      ${SYSTEM_PROFILE.status.label}`, 'muted'),
      ],
    }),
  },
  {
    name: 'ps',
    summary: 'List open windows.',
    run: (_args, context) => {
      if (context.running.length === 0) {
        return { lines: [line('  No windows currently open.', 'muted')] };
      }
      return {
        lines: [
          line('PID  APPLICATION', 'heading'),
          ...context.running.map((entry, index) =>
            line(`  ${String(index + 1).padStart(3, '0')}  ${entry.title}`, 'muted'),
          ),
        ],
      };
    },
  },
  {
    name: 'workspace',
    summary: 'Show or change the environment.',
    usage: 'workspace [windows|macos|ubuntu]',
    run: (args, context) => {
      const token = args[0]?.toLowerCase();
      if (!token) {
        return {
          lines: [
            line(`Current environment: ${context.environment.name}`, 'accent'),
            line(`  ${context.environment.chromeSummary}`, 'muted'),
            blank(),
            line('  Available: windows · macos · ubuntu', 'muted'),
          ],
        };
      }

      const target = WORKSPACE_ALIASES[token];
      if (!target) {
        return { lines: [line(`workspace: unknown environment: ${token}`, 'error')] };
      }

      return {
        lines: [line(`Switching to ${getEnvironment(target).name}…`, 'muted')],
        effect: { type: 'switch', environment: target },
      };
    },
  },
  {
    name: 'db',
    summary: 'Check Supabase database connectivity and status.',
    run: () => ({
      lines: [
        line('Database Status: Connected (Supabase Cloud)', 'heading'),
        line('  Engine:      PostgreSQL 15 (Direct Pooler + REST)', 'muted'),
        line('  Sync:        Active Live Synchronization', 'muted'),
        line('  Persistence: Profiles, Skills, Projects, Experiences, Messages', 'muted'),
        blank(),
        line('  Admin URL:   /admin (Manage content dynamically)', 'accent'),
      ],
    }),
  },
  {
    name: 'admin',
    summary: 'Open or view admin console information.',
    run: () => ({
      lines: [
        line('IZHAR OS // Admin Control Center', 'heading'),
        line('  Navigate to: /admin', 'accent'),
        line('  Function:    Dynamic CRUD for Projects, Skills, Experiences, Inbox & Seeder', 'muted'),
      ],
    }),
  },
  {
    name: 'clear',
    summary: 'Clear the screen.',
    run: () => ({ lines: [], effect: { type: 'clear' } }),
  },
];

const COMMAND_INDEX = new Map(COMMANDS.map((command) => [command.name, command]));

/** Every command name, for tab completion and for `help`. */
export const COMMAND_NAMES: string[] = COMMANDS.map((command) => command.name);

/** Runs one line of input. Unknown input fails the way a shell fails. */
export function runCommand(input: string, context: CommandContext): CommandResult {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return { lines: [] };

  const command = COMMAND_INDEX.get(name.toLowerCase());
  if (!command) {
    return {
      lines: [
        line(`izsh: command not found: ${name}`, 'error'),
        line('Type `help` for the list of available commands.', 'muted'),
      ],
    };
  }

  return command.run(args, context);
}

/** Longest common completion for a partial command name. */
export function completeCommand(partial: string): string | null {
  const term = partial.trim().toLowerCase();
  if (!term) return null;

  const matches = COMMAND_NAMES.filter((name) => name.startsWith(term));
  if (matches.length === 1) return matches[0]!;
  return null;
}
