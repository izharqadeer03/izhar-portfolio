import type { EnvironmentId } from '@izhar-os/types';

/**
 * Which of the three environments the visitor is most likely already at home in.
 *
 * Used for one thing only: pre-selecting a card on the first-run question, so a
 * Mac visitor sees "you're on this" instead of three equal strangers. It is a
 * courtesy, never a decision — nothing is entered on its say-so, and a wrong
 * guess costs the visitor one click.
 *
 * Returning `null` is a real answer. A phone is not one of these three desktops,
 * and putting a label on a machine the visitor is not sitting at is worse than
 * admitting we don't know.
 */

/** `navigator.userAgentData`, which the DOM lib does not describe yet. */
interface UserAgentHints {
  platform?: string;
}

function matchPlatform(value: string | undefined): EnvironmentId | null {
  if (!value) return null;

  // Android carries "Linux" in its user agent, so it is tested first — and it
  // deliberately answers with nothing rather than claiming a Linux desktop.
  if (/android/i.test(value)) return null;
  if (/windows|win32|win64/i.test(value)) return 'windows';
  if (/mac|iphone|ipad|ipod|darwin/i.test(value)) return 'macos';
  if (/cros|chrome os|linux|x11|ubuntu|fedora|bsd/i.test(value)) return 'linux';

  return null;
}

export function detectEnvironment(): EnvironmentId | null {
  if (typeof navigator === 'undefined') return null;

  // The client hint is the honest source where it exists; the user agent string
  // is the fallback, and is frozen or spoofed often enough to deserve second place.
  const hints = (navigator as Navigator & { userAgentData?: UserAgentHints }).userAgentData;
  return matchPlatform(hints?.platform) ?? matchPlatform(navigator.userAgent);
}
