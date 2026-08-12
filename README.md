# IZHAR OS

A personal developer workspace, built as an operating system.

The portfolio does not present itself as a set of pages. It boots, draws a
desktop, and lets a visitor open applications in real windows — in Windows,
macOS or Linux chrome, chosen at runtime.

## Requirements

- Node.js `>=20.11.0`
- pnpm `11.18.0` (pinned via `packageManager`)

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Commands

Every command runs at the repository root and fans out through Turborepo.

| Command             | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | Runs the desktop in development                  |
| `pnpm build`        | Production build of every workspace member       |
| `pnpm start`        | Serves the production build                      |
| `pnpm lint`         | ESLint across all packages                       |
| `pnpm typecheck`    | `tsc --noEmit` across all packages               |
| `pnpm format`       | Rewrites files to Prettier style                 |
| `pnpm format:check` | Fails if anything is unformatted                 |
| `pnpm clean`        | Removes `.next`, `.turbo`, `dist` and build info |

## Layout

```
apps/web            The desktop environment (Next.js App Router)
packages/config     Identity, application manifest, design tokens
packages/types      Framework-agnostic domain types
packages/ui         Shared interface primitives
packages/ai         Placeholder — AI layer (Phase 3)
packages/database   Placeholder — persistence (later phase)
services/*          Placeholders — out-of-Next.js backends
tooling/*           Shared TypeScript and ESLint presets
```

## How it is put together

One idea carries most of the architecture: **the environment is chrome, not an
application.** The window manager, the application registry, the desktop surface
and the stores are shared by all three operating systems. Only bars, docks,
launchers and system menus fork, and they fork in exactly one place —
`apps/web/components/environments/EnvironmentChrome.tsx`.

The consequence is that applications are written once. Registering a new one
means appending an entry to the manifest in `packages/config/src/applications.ts`
and mapping its view in `apps/web/components/applications/ApplicationRegistry.tsx`.
It then appears in Windows, macOS and Linux at once — on the desktop, in the
launcher, in search, in the file manager and in the terminal.

Configuration is split deliberately. `tooling/` holds build configuration and no
runtime code; `packages/config` holds runtime configuration. That separation is
what lets `@izhar-os/types` be a dependency of `@izhar-os/config` without a cycle.

## Roadmap

| Phase     | Scope                                  | Status   |
| --------- | -------------------------------------- | -------- |
| Phase 1   | Workspace, window manager, environment | Complete |
| Phase 1.5 | Windows, macOS and Linux environments  | Complete |
| Phase 2   | Portfolio applications and content     | Planned  |
| Phase 3   | AI Lab and assistant services          | Planned  |

Phase 1 and 1.5 ship three fully implemented applications — Portfolio (files),
Terminal and System Information. The remaining manifest entries render a
placeholder that states what they will contain and which phase delivers them,
so the desktop never claims more than it does.

The roadmap surfaced inside System Information is generated from
`packages/config/src/system.ts`; update it there rather than here and in the app.
