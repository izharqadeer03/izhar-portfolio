/**
 * Application domain — describes *what* an IZHAR OS application is, with no
 * knowledge of how it renders. The web app maps these ids onto React icon and
 * content components in its own registry, which keeps this package usable from
 * a future backend or AI service.
 */

export type ApplicationId =
  | 'about'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'ai-lab'
  | 'resume'
  | 'contact'
  | 'files'
  | 'terminal'
  | 'system-info';

/** Groups applications in the launcher. */
export type ApplicationCategory = 'workspace' | 'system';

/**
 * Lifecycle of an application. Phase 1 ships `system-info` as `available`;
 * everything else is `coming-soon` until its phase lands.
 */
export type ApplicationStatus = 'available' | 'coming-soon';

/** Named accent used for an application's icon tint. */
export type AccentKey = 'cyan' | 'violet' | 'amber' | 'emerald' | 'rose' | 'slate';

/**
 * How an application is presented inside a file manager.
 *
 * Explorer, Finder and Files all draw a folder differently from a document,
 * and every one of them draws a link differently again — so the manifest says
 * which it is and each environment decides what that looks like.
 */
export type ApplicationEntryKind = 'folder' | 'document' | 'link' | 'application';

export interface ApplicationSize {
  width: number;
  height: number;
}

export interface ApplicationDefinition {
  id: ApplicationId;
  /** Full name, used in window headers and the launcher. */
  title: string;
  /** Condensed name for the taskbar and desktop icon labels. */
  shortTitle: string;
  /** One line shown in the launcher and in placeholder windows. */
  description: string;
  category: ApplicationCategory;
  status: ApplicationStatus;
  accent: AccentKey;
  /** Icon key resolved by the renderer's icon map. */
  icon: string;
  /** Extra terms matched by launcher search beyond the title. */
  keywords: string[];
  /** Preferred window size at open time, clamped to the viewport. */
  defaultSize: ApplicationSize;
  /** Smallest usable window size. */
  minSize: ApplicationSize;
  /** Shown on the desktop surface; system utilities stay in the launcher. */
  showOnDesktop: boolean;
  /**
   * How the file manager lists this application, and under what name. A
   * portfolio section reads as a folder; the resume reads as a document.
   */
  entry: {
    kind: ApplicationEntryKind;
    /** Filename as shown in the file manager, e.g. `Resume.pdf`. */
    name: string;
    /** Human size or type column value, e.g. "Folder" or "PDF Document". */
    typeLabel: string;
  };
  /**
   * What this application will contain once its phase ships. Rendered by the
   * placeholder window so every "coming soon" screen says something specific.
   */
  plannedFeatures?: string[];
  /** Target milestone label, e.g. "Phase 2". */
  plannedRelease?: string;
}
