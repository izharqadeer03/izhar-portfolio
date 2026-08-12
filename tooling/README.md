# tooling

Shared build configuration. These packages carry no runtime code — they exist so
every workspace member lints and type-checks by the same rules.

| Package                   | Purpose                                                     |
| ------------------------- | ----------------------------------------------------------- |
| `@izhar-os/tsconfig`      | TypeScript presets: `base`, `react-library`, `nextjs`       |
| `@izhar-os/eslint-config` | ESLint flat configs: `base` and `next` (React Hooks + a11y) |

Runtime configuration — identity, the application manifest, design tokens — lives
in `packages/config`, not here. Keeping the two apart is what lets
`@izhar-os/types` be depended on by `@izhar-os/config` without a cycle.
