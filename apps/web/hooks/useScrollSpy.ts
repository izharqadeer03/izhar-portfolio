'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Which section of a scroll container the visitor is currently reading.
 *
 * Measured from cached offsets and updated once per animation frame, so a fast
 * scroll costs one layout read per frame rather than one per event — and the
 * component above only re-renders when the answer actually changes.
 *
 * Sections are found by `[data-section="<id>"]`, and the container must be the
 * offset parent of its sections (it is: the scroll region is positioned).
 */
export function useScrollSpy(containerRef: RefObject<HTMLElement | null>, ids: string[]): string {
  const [active, setActive] = useState(() => ids[0] ?? '');

  // Arrays are rebuilt on every render; the joined key is what actually changes.
  const key = ids.join('|');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const list = key ? key.split('|') : [];
    let offsets: { id: string; top: number }[] = [];
    let frame = 0;

    const update = () => {
      if (offsets.length === 0) return;

      // The reading line sits a fifth of the way down the viewport: a section
      // becomes current once its heading has settled near the top, which is
      // where a reader's eye actually is.
      const line = container.scrollTop + container.clientHeight * 0.2;
      const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 4;

      let next = offsets[0]!.id;
      if (atBottom) {
        // The last section is often shorter than the viewport and would never
        // reach the reading line on its own.
        next = offsets[offsets.length - 1]!.id;
      } else {
        for (const entry of offsets) {
          if (entry.top <= line) next = entry.id;
        }
      }

      setActive((current) => (current === next ? current : next));
    };

    const measure = () => {
      offsets = list.map((id) => {
        const element = container.querySelector<HTMLElement>(`[data-section="${id}"]`);
        return { id, top: element?.offsetTop ?? 0 };
      });
      update();
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    measure();
    container.addEventListener('scroll', onScroll, { passive: true });

    // Windows are resizable, so the section offsets are not constant.
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    const content = container.firstElementChild;
    if (content) observer.observe(content);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      container.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [containerRef, key]);

  return active;
}
