# @izhar-os/database

**Status: placeholder — not implemented in Phase 1.**

This package will own persistence for IZHAR OS. Nothing is installed here yet: no
Supabase client, no schema, no migrations, no auth. It exists so that the boundary
is already drawn and later phases have an obvious home.

## Intended responsibility

- Database client construction (server-side only)
- Schema and migrations
- Typed data access functions returning the domain types from `@izhar-os/types`

## Contract it will honour

The web app already consumes its content through the shapes exported by
`@izhar-os/types` and currently satisfied by the static values in
`@izhar-os/config`:

```
SystemProfile      → who the operator is, availability status
ApplicationDefinition[] → the application manifest
```

When this package lands, `@izhar-os/config` becomes the fallback/seed data and a
loader in `apps/web` chooses between static and remote sources. No desktop,
window manager or launcher code has to change.

## Rules for this package

- Server-only. It must never be imported from a client component.
- It exports data, not React. Rendering stays in `apps/web`.
- Secrets live in environment variables, never in `@izhar-os/config`.
