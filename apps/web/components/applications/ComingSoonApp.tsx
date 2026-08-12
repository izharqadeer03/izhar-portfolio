'use client';

import { MOTION } from '@izhar-os/config';
import { SectionLabel } from '@izhar-os/ui';
import { motion } from 'motion/react';

import { AppTile } from '@/components/applications/AppIcon';
import type { ApplicationViewProps } from '@/components/applications/ApplicationRegistry';

/**
 * The placeholder every unshipped application uses.
 *
 * It states what the application will contain and when — a real screen with
 * real information, not an empty box. That keeps the OS honest about its own
 * state and makes the desktop feel like a system under active development
 * rather than a demo with dead links.
 */
export function ComingSoonApp({ application }: ApplicationViewProps) {
  return (
    <div className="os-selectable flex h-full flex-col items-center justify-center px-8 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: MOTION.easeOut }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <AppTile icon={application.icon} accent={application.accent} size={56} muted />
          {/* A single soft ring, so the tile reads as dormant rather than broken. */}
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-[30%] border border-line/60 opacity-60"
          />
        </div>

        <h2 className="mt-7 text-[17px] font-medium tracking-tight text-fg">Coming Soon</h2>

        <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-muted">
          This application will be available in the next system update.
        </p>
      </motion.div>

      {application.plannedFeatures?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.06, ease: MOTION.easeOut }}
          className="mt-9 w-full max-w-[320px] rounded-lg border border-line bg-void/40 p-4 text-left"
        >
          <div className="flex items-center justify-between">
            <SectionLabel>Planned</SectionLabel>
            {application.plannedRelease ? (
              <span className="font-mono text-[10px] tracking-[0.12em] text-accent/80 uppercase">
                {application.plannedRelease}
              </span>
            ) : null}
          </div>

          <ul className="mt-3 space-y-2">
            {application.plannedFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-[12.5px] text-muted">
                <span aria-hidden="true" className="mt-[7px] h-px w-2.5 shrink-0 bg-line-strong" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}

      <p className="mt-8 font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
        {application.description}
      </p>
    </div>
  );
}
