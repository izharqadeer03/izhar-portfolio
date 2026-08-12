'use client';

import { cn } from '@izhar-os/ui';
import { memo, type ReactNode } from 'react';

interface WindowContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * The content region of a window.
 *
 * Memoized because drag and resize gestures re-render the window frame, and
 * an application's view has no reason to re-render while its window is being
 * moved around.
 */
export const WindowContent = memo(function WindowContent({
  children,
  className,
}: WindowContentProps) {
  return (
    <div className={cn('relative min-h-0 flex-1 overflow-hidden rounded-b-[13px]', className)}>
      {children}
    </div>
  );
});
