import {
  APPLICATIONS,
  getApplication,
  getEnvironment,
  OS_META,
  PORTFOLIO_ENTRIES,
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
 * arguments to lines, which makes the whole shell trivially testable.
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
 *
 * The Ubuntu environment's id is still `linux`, and a shell is exactly where
 * someone would type that — so both spellings resolve, while only `ubuntu` is
 * advertised in the usage line.
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
        line('Available commands', 'heading'),
        blank(),
        ...COMMANDS.map((command) =>
          line(`  ${command.name.padEnd(12)}${command.summary}`, 'muted'),
        ),
        blank(),
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
        line(SYSTEM_PROFILE.statement, 'muted'),
        blank(),
        line(`  Focus       ${SYSTEM_PROFILE.disciplines.join(' · ')}`, 'muted'),
        line(`  Experience  ${SYSTEM_PROFILE.experience}`, 'muted'),
        line(`  Location    ${SYSTEM_PROFILE.location}`, 'muted'),
        line(
          `  Status      ${SYSTEM_PROFILE.status.label} — ${SYSTEM_PROFILE.status.detail}`,
          'muted',
        ),
        blank(),
        line('  Run `open about` for the full application.', 'muted'),
      ],
    }),
  },
  {
    name: 'ls',
    summary: 'List the portfolio.',
    run: () => ({
      lines: [
        ...PORTFOLIO_ENTRIES.map((application) =>
          line(
            `  ${application.entry.name.padEnd(16)}${application.entry.typeLabel.padEnd(18)}${
              application.status === 'available' ? 'ready' : 'pending'
            }`,
            application.entry.kind === 'folder' ? 'accent' : 'default',
          ),
        ),
        blank(),
        line(`  ${PORTFOLIO_ENTRIES.length} entries`, 'muted'),
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
        return { lines: [line('open: expected an application name. Try `ls`.', 'error')] };
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
    name: 'projects',
    summary: 'Open Projects.',
    run: () => shortcut('projects'),
  },
  {
    name: 'skills',
    summary: 'Open Skills.',
    run: () => shortcut('skills'),
  },
  {
    name: 'experience',
    summary: 'Open Experience.',
    run: () => shortcut('experience'),
  },
  {
    name: 'resume',
    summary: 'Open the résumé.',
    run: () => shortcut('resume'),
  },
  {
    name: 'contact',
    summary: 'How to reach me.',
    run: () => ({
      lines: [
        line('Contact', 'heading'),
        blank(),
        ...SYSTEM_PROFILE.links.map((link) =>
          line(`  ${link.label.padEnd(10)}${link.href}`, 'muted'),
        ),
        blank(),
        line('  Run `open contact` for the full application.', 'muted'),
      ],
    }),
  },
  {
    name: 'whoami',
    summary: 'Print the current operator.',
    run: () => ({
      lines: [line(SYSTEM_PROFILE.name.toLowerCase().replace(/\s+/g, ''), 'default')],
    }),
  },
  {
    name: 'neofetch',
    summary: 'System summary.',
    run: (_args, context) => ({
      lines: [
        line(`${SYSTEM_PROFILE.wordmark.toLowerCase()}@portfolio`, 'accent'),
        line('─────────────────', 'muted'),
        line(`OS          ${OS_META.name} ${OS_META.version}`, 'muted'),
        line(`Environment ${context.environment.name}`, 'muted'),
        line(`Shell       izsh`, 'muted'),
        line(`Channel     ${OS_META.channel}`, 'muted'),
        line(`Operator    ${SYSTEM_PROFILE.name} · ${SYSTEM_PROFILE.role}`, 'muted'),
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
        return { lines: [line('  No windows open.', 'muted')] };
      }
      return {
        lines: context.running.map((entry, index) =>
          line(`  ${String(index + 1).padStart(3, '0')}  ${entry.title}`, 'muted'),
        ),
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
    name: 'clear',
    summary: 'Clear the screen.',
    run: () => ({ lines: [], effect: { type: 'clear' } }),
  },
];

function shortcut(id: ApplicationId): CommandResult {
  const application = getApplication(id);
  if (!application) return { lines: [line(`open: no such application: ${id}`, 'error')] };

  return {
    lines: [
      line(application.title, 'heading'),
      line(application.description, 'muted'),
      ...(application.plannedFeatures ?? []).map((feature) => line(`  · ${feature}`, 'muted')),
      blank(),
      line(`Opening ${application.title}…`, 'muted'),
    ],
    effect: { type: 'open', applicationId: id },
  };
}

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
        line('Type `help` for the list of commands.', 'muted'),
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
