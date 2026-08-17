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

/** Experience domain */
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  duration: string;
  current?: boolean;
  summary: string;
  focusAreas?: string[];
  achievements: string[];
  technologies: string[];
  metrics?: { label: string; value: string }[];
  relatedProjects?: string[];
}

/** Skills domain */
export type SkillCategoryId =
  | 'languages'
  | 'backend'
  | 'databases-search'
  | 'ai-llm'
  | 'realtime-distributed'
  | 'cloud-devops'
  | 'frontend'
  | 'apis-integrations';

export interface SkillCategory {
  id: SkillCategoryId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  accent: AccentKey;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategoryId;
  level: 'Core / Advanced' | 'Proficient' | 'Working Knowledge';
  years: string;
  featured?: boolean;
  icon?: string;
  description: string;
  architecturalRole?: string;
  contextNote?: string;
  capabilities?: string[];
  tags?: string[];
  relatedProjects?: string[];
}

/** Resume domain */
export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  location: string;
  details?: string[];
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  education: EducationEntry[];
  certifications: CertificationEntry[];
  competencies: { category: string; skills: string[] }[];
}

/** Contact domain */
export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: string;
  copyable?: boolean;
  primary?: boolean;
}

export interface ContactTopic {
  id: string;
  label: string;
  description: string;
}

export interface ContactConfig {
  email: string;
  location: string;
  timezone: string;
  availability: {
    status: string;
    notice: string;
    preferredRoles: string[];
  };
  channels: ContactChannel[];
  topics: ContactTopic[];
}

/** AI Assistant / Lab domain */
export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  toolCall?: {
    name: string;
    args?: Record<string, unknown>;
    result?: string;
  };
  suggestions?: string[];
}

