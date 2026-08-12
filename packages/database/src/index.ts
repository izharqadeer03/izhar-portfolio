/**
 * Placeholder module for the future persistence layer.
 *
 * Phase 1 has no database. This file exists only to reserve the import path and
 * to record the flag that later phases will flip. See README.md in this package.
 */

/** Whether a real persistence layer is wired up. Always false in Phase 1. */
export const DATABASE_ENABLED = false;

export type DatabaseStatus = 'not-configured' | 'connected' | 'error';

/** Reported by System Information so the OS tells the truth about itself. */
export function getDatabaseStatus(): DatabaseStatus {
  return 'not-configured';
}
