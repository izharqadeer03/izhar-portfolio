/**
 * Placeholder module for the future AI layer behind the AI Lab application.
 *
 * Phase 1 ships no model SDK, no keys and no prompts. This file reserves the
 * import path and the transport-neutral shape described in README.md.
 */

/** Whether an inference provider is configured. Always false in Phase 1. */
export const AI_ENABLED = false;

export type AssistantStatus = 'not-configured' | 'ready' | 'error';

/** Reported by System Information so the OS tells the truth about itself. */
export function getAssistantStatus(): AssistantStatus {
  return 'not-configured';
}
