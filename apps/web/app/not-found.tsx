import { OS_META } from '@izhar-os/config';
import Link from 'next/link';

export const metadata = {
  title: 'Route not found',
};

/**
 * Even the 404 stays inside the metaphor — but it stays a plain, fast page,
 * with no boot sequence to sit through on the way back to the desktop.
 */
export default function NotFound() {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-void px-6 text-center">
      <p className="font-mono text-[10px] tracking-[0.28em] text-faint uppercase">{OS_META.name}</p>

      <h1 className="mt-5 font-mono text-[13px] font-medium tracking-[0.24em] text-fg uppercase">
        Route not found
      </h1>

      <p className="mt-3 max-w-[38ch] text-[13px] leading-relaxed text-muted">
        This address does not resolve to anything in the workspace.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-lg border border-line bg-white/[0.04] px-4 py-2 text-[12.5px] text-fg/90 transition-colors hover:border-line-strong hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      >
        Return to desktop
      </Link>
    </main>
  );
}
