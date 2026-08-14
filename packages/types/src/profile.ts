import type { AccentKey } from './application';

/**
 * Profile domain — the content the About application renders.
 *
 * Kept here rather than inside the web app for the same reason the application
 * manifest is: the terminal, a future resume renderer and an eventual AI
 * assistant all need to describe the same person, and none of them should own
 * a second copy of the answer.
 */

/** A headline figure in the About application's statistics row. */
export interface ProfileStat {
  id: string;
  /** The figure itself, e.g. "3+". Short enough to set at display size. */
  value: string;
  label: string;
  /** One line of context under the label. */
  detail: string;
  /**
   * Set when the value is a number the interface may count up to. Purely a
   * presentation hint — the printed value always comes from `value`.
   */
  countTo?: number;
}

/** One step in the career progression, in chronological order. */
export interface JourneyStage {
  id: string;
  label: string;
  detail: string;
}

/** A category of system I build, shown in "What I Build". */
export interface BuildArea {
  id: string;
  title: string;
  summary: string;
  /** Icon key resolved by the renderer's glyph map. */
  icon: string;
  accent: AccentKey;
  /** The concrete technologies behind the category. */
  tags: string[];
}

/**
 * An area of engineering emphasis.
 *
 * `emphasis` is 0..1 and describes *where the work goes*, not measured skill.
 * The About application labels it accordingly and never prints it as a
 * percentage, because a self-assessed percentage is not a measurement.
 */
export interface FocusArea {
  id: string;
  label: string;
  emphasis: number;
  note: string;
}

/** A named group of technologies, e.g. "Languages" or "Data". */
export interface StackGroup {
  id: string;
  label: string;
  items: string[];
}

export interface AboutProfile {
  /** One sentence of professional positioning, used as the hero statement. */
  positioning: string;
  /** Two or three short paragraphs of introduction. */
  introduction: string[];
  stats: ProfileStat[];
  journey: JourneyStage[];
  buildAreas: BuildArea[];
  focusAreas: FocusArea[];
  stack: StackGroup[];
  /** What I am actively exploring right now. */
  interests: string[];
}
