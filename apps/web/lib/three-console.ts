import { getConsoleFunction, setConsoleFunction } from 'three';

/**
 * Warnings Three.js emits about code we do not own.
 *
 * `THREE.Clock` was deprecated in r183 in favour of `THREE.Timer`, but
 * `@react-three/fiber` still builds its root store around a `Clock` — the
 * instance every `useFrame` callback reads its delta from. There is no version
 * of fiber that has moved off it yet (9.7.0 is current), so the only ways to
 * silence the line are to pin Three below r183 or to drop the message. Pinning
 * costs two releases of fixes to buy back one clean console line, which is the
 * worse trade.
 *
 * Matched on the leading `THREE.Clock:` rather than the full sentence so the
 * filter survives a reworded message, and kept to that one prefix so a genuine
 * warning about our own scene code still reaches the console.
 */
const UPSTREAM_PREFIXES = ['THREE.Clock:'];

let installed = false;

/**
 * Drops the deprecation warnings listed above and forwards everything else.
 *
 * Three routes all of its own logging through this hook, so nothing here
 * touches the global `console` — anything the filter does not recognise lands
 * on the native method exactly as it would have. Idempotent, and it chains any
 * handler already in place rather than replacing it.
 */
export function filterUpstreamThreeWarnings(): void {
  if (installed) return;
  installed = true;

  const previous = getConsoleFunction();

  setConsoleFunction((type, message, ...params) => {
    if (type === 'warn' && UPSTREAM_PREFIXES.some((prefix) => message.startsWith(prefix))) {
      return;
    }

    if (previous) {
      previous(type, message, ...params);
      return;
    }

    if (type === 'warn') console.warn(message, ...params);
    else if (type === 'error') console.error(message, ...params);
    // The one case the project's no-console rule forbids, and the one case we
    // are not writing a message so much as relaying one Three already chose to.
    // eslint-disable-next-line no-console
    else console.log(message, ...params);
  });
}
