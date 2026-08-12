'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { SceneBoundary } from '@/components/system/SceneBoundary';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useDocumentVisible } from '@/hooks/useDocumentVisibility';
import { useEnvironmentDefinition } from '@/hooks/useEnvironment';
import { useSystemStore } from '@/lib/store/system-store';

// Three.js stays out of the initial bundle entirely — the boot sequence must
// never wait on the environment.
const DesktopScene = dynamic(() => import('@/components/3d/DesktopScene'), {
  ssr: false,
  loading: () => null,
});

/**
 * The desktop environment, in two halves.
 *
 * The CSS layers below are not a fallback bolted on afterwards — they are the
 * environment's foundation, and they render on every device. WebGL composites
 * on top when the machine can afford it. That ordering is what guarantees the
 * desktop looks finished whether or not Three.js ever loads.
 *
 * Each workspace tints and structures these layers differently: cool and
 * gridded for Windows, warm and gridless for macOS, aubergine and hard-lined
 * for Linux. This is the one place the environments are allowed to change the
 * colour of the room, because atmosphere is what makes a desktop recognisable
 * from across the table — and it is behind everything, so it never competes
 * with the interface or with the accent.
 */
export function DesktopBackground() {
  const { budget, useWebGL } = useDeviceCapability();
  const visible = useDocumentVisible();
  const bootPhase = useSystemStore((state) => state.bootPhase);
  const environment = useEnvironmentDefinition();
  const [sceneFailed, setSceneFailed] = useState(false);

  const environmentReady = bootPhase === 'revealing' || bootPhase === 'ready';
  const showScene = useWebGL && environmentReady && !sceneFailed;
  const { ambient } = environment;

  return (
    <div
      className="os-grain pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Ground colour. */}
      <div className="absolute inset-0 bg-void" />

      {/* Two pools of light, drifting slowly against each other. */}
      <div
        className="absolute -top-[25%] -left-[15%] size-[70vw] rounded-full opacity-70 blur-[100px] transition-[background] duration-700 motion-safe:animate-drift"
        style={{
          background: `radial-gradient(circle, color-mix(in oklab, ${ambient.primary} 16%, transparent) 0%, transparent 68%)`,
        }}
      />
      <div
        className="absolute -right-[12%] -bottom-[30%] size-[62vw] rounded-full opacity-60 blur-[110px] transition-[background] duration-700 motion-safe:animate-drift"
        style={{
          background: `radial-gradient(circle, color-mix(in oklab, ${ambient.secondary} 14%, transparent) 0%, transparent 68%)`,
          animationDelay: '-13s',
        }}
      />

      {/* Engineering grid, faded out toward the edges so it has no border.
          macOS sets its strength to zero: an unbroken field is the point. */}
      {ambient.grid > 0 ? (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: ambient.grid,
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.028) 1px, transparent 1px)',
            backgroundSize: '68px 68px',
            maskImage: 'radial-gradient(ellipse 90% 75% at 50% 42%, #000 25%, transparent 78%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 75% at 50% 42%, #000 25%, transparent 78%)',
          }}
        />
      ) : null}

      {/* The WebGL environment. */}
      {showScene ? (
        <SceneBoundary onError={() => setSceneFailed(true)}>
          <DesktopScene budget={budget} paused={!visible} />
        </SceneBoundary>
      ) : null}

      {/* Vignette, above the scene: pulls focus to the centre and keeps the
          chrome sitting on a darker ground. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 50% 35%, transparent 35%, rgba(5,6,8,0.55) 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-void/80 to-transparent" />
    </div>
  );
}
