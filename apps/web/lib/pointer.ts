/**
 * A single global pointer signal, shared by the WebGL camera rig and the CSS
 * parallax layers.
 *
 * This is deliberately a mutable module object rather than React state: the 3D
 * scene samples it every frame, and routing 60 updates per second through
 * React would re-render the entire desktop for no reason.
 */

export interface PointerSignal {
  /** Normalized to -1..1, origin at viewport centre. Used by the camera rig. */
  x: number;
  y: number;
  /** Raw viewport coordinates. Used by the cursor accent. */
  clientX: number;
  clientY: number;
  /** True once the user has actually moved a fine pointer. */
  active: boolean;
}

export const pointerSignal: PointerSignal = {
  x: 0,
  y: 0,
  clientX: -100,
  clientY: -100,
  active: false,
};

let subscribers = 0;
let detach: (() => void) | null = null;

/**
 * Starts pointer tracking on first subscriber and stops it on the last.
 * Returns the unsubscribe function.
 */
export function subscribeToPointer(): () => void {
  if (typeof window === 'undefined') return () => {};

  subscribers += 1;

  if (subscribers === 1) {
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointerSignal.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerSignal.y = (event.clientY / window.innerHeight) * 2 - 1;
      pointerSignal.clientX = event.clientX;
      pointerSignal.clientY = event.clientY;
      pointerSignal.active = true;
    };

    const handleLeave = () => {
      pointerSignal.x = 0;
      pointerSignal.y = 0;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);

    detach = () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }

  return () => {
    subscribers -= 1;
    if (subscribers === 0 && detach) {
      detach();
      detach = null;
      pointerSignal.active = false;
    }
  };
}
