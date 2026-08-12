# @izhar-os/ai

**Status: placeholder — not implemented in Phase 1.**

This package will own the AI layer behind the **AI Lab** application. No model
SDKs, keys or prompts are installed yet.

## Intended responsibility

- Provider-agnostic client for the assistant
- Prompt and tool definitions
- Streaming response types shared by the UI and any backend service

## Why it is provider-agnostic

Phase 1 deliberately does not assume where inference runs. Both of these remain
open:

```
AI Lab → Next.js route handler → @izhar-os/ai → model provider
AI Lab → services/ai (FastAPI) → agent runtime
```

The desktop only knows how to open an application window. Whatever answers it is
a detail behind this package's interface.

## Rules for this package

- Server-only. API keys never reach the browser.
- Transport-neutral: the same functions must work from a route handler or a
  standalone service.
