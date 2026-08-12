# services/backend

**Status: placeholder — not implemented in Phase 1.**

Reserved for backend work that does not belong inside Next.js — scheduled jobs,
webhooks, long-running tasks, or an admin API.

Nothing is installed here, and there is intentionally no `package.json`, so pnpm
does not treat this directory as a workspace member yet.

## Boundary being preserved

Phase 1 ships zero backend calls: the desktop renders from static configuration.
That is a deliberate constraint, not an accident — it means the first real
integration can pick any of these without a refactor:

- Next.js route handlers inside `apps/web/app/api`
- `packages/database` called from server components
- a standalone service here

The rule that keeps all three open: **no client component fetches data directly.**
