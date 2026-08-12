# services/ai

**Status: placeholder — not implemented in Phase 1.**

Reserved for a standalone AI service (for example a Python/FastAPI agent runtime)
if the AI Lab outgrows Next.js route handlers.

Nothing is installed here. There is intentionally no `package.json`, so pnpm does
not treat this directory as a workspace member yet.

## When this becomes real

Add a service manifest here and the deployment target of your choice. The web app
would reach it through `@izhar-os/ai`, never directly, so the desktop stays
unaware of the transport:

```
apps/web (AI Lab window)
      ↓ route handler
packages/ai
      ↓ HTTP
services/ai
```
