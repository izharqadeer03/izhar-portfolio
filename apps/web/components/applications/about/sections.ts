/**
 * The About application's own table of contents.
 *
 * Navigation, scroll spy and the sections themselves all read this array, so a
 * section cannot exist without a way to reach it, and the order on screen is
 * the order in the navigation by construction.
 */
export interface AboutSectionDescriptor {
  id: string;
  /** Name in the navigation. */
  label: string;
  /** Icon key resolved by the navigation's glyph map. */
  icon: string;
  /** Small label above the heading. */
  eyebrow: string;
  /** The section's heading. */
  title: string;
  /** One line under the heading, where the section needs framing. */
  description?: string;
}

export const ABOUT_SECTIONS: AboutSectionDescriptor[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'profile',
    eyebrow: 'Profile',
    title: 'Introduction',
  },
  {
    id: 'snapshot',
    label: 'Snapshot',
    icon: 'snapshot',
    eyebrow: 'Snapshot',
    title: 'At a glance',
  },
  {
    id: 'journey',
    label: 'Journey',
    icon: 'journey',
    eyebrow: 'Journey',
    title: 'How the work evolved',
  },
  {
    id: 'builds',
    label: 'What I Build',
    icon: 'builds',
    eyebrow: 'What I build',
    title: 'Systems I work on',
  },
  {
    id: 'focus',
    label: 'Focus',
    icon: 'focus',
    eyebrow: 'Developer DNA',
    title: 'Primary engineering focus',
    description: 'Where the work actually goes — emphasis, not a proficiency score.',
  },
];

export const ABOUT_SECTION_IDS: string[] = ABOUT_SECTIONS.map((section) => section.id);
