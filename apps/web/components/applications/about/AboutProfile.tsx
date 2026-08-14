'use client';

import { ABOUT_PROFILE } from '@izhar-os/config';

import { ACCENT_TEXT } from '@/components/applications/about/theme';
import { useApplicationChrome } from '@/hooks/useEnvironment';

/**
 * The introduction: two paragraphs, the stack behind them, and what I am
 * currently reading about. Deliberately the least decorated section in the
 * application — it is the part people actually read.
 */
export function AboutProfile() {
  const chrome = useApplicationChrome();

  return (
    <div className="grid gap-7 @min-[720px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] @min-[720px]:gap-9">
      <div>
        {ABOUT_PROFILE.introduction.map((paragraph) => (
          <p
            key={paragraph.slice(0, 24)}
            className="mt-3 max-w-[68ch] text-[13.5px] leading-[1.7] text-muted first:mt-0"
          >
            {paragraph}
          </p>
        ))}

        <dl className="mt-6 grid gap-x-6 gap-y-3">
          {ABOUT_PROFILE.stack.map((group) => (
            <div key={group.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <dt className="w-[68px] shrink-0 font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
                {group.label}
              </dt>
              <dd className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="border border-line bg-white/[0.03] px-2 py-1 text-[11.5px] text-muted transition-colors duration-150 ease-env hover:border-line-strong hover:text-fg/90"
                    style={{ borderRadius: chrome.controlRadius }}
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Currently exploring. */}
      <aside className={chrome.cardClass} style={{ borderRadius: chrome.cardRadius, padding: 18 }}>
        <p className={chrome.eyebrowClass} style={{ color: ACCENT_TEXT }}>
          Currently exploring
        </p>

        <ul className="mt-3.5 space-y-2.5">
          {ABOUT_PROFILE.interests.map((interest) => (
            <li key={interest} className="flex items-start gap-2.5 text-[12.5px] text-muted">
              <span
                aria-hidden="true"
                className="mt-[8px] h-px w-3 shrink-0 opacity-60"
                style={{ backgroundColor: ACCENT_TEXT }}
              />
              <span className="leading-snug">{interest}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
