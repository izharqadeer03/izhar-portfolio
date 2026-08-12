import { rmSync } from 'node:fs';

/**
 * Removes a workspace member's build output.
 *
 * Run from the package directory (`node ../../tooling/clean.mjs`), so every
 * member cleans itself and `turbo run clean` fans out across all of them. Node's
 * own fs is enough here — reaching for a dependency to delete four directories
 * would cost more than it saves, and this stays identical on Windows and POSIX.
 */
const TARGETS = ['.turbo', '.next', 'dist', 'tsconfig.tsbuildinfo'];

for (const target of TARGETS) {
  rmSync(target, { recursive: true, force: true });
}
