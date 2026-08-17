import type { AccentKey } from './application';

export type ProjectCategoryId = 'ai-systems' | 'backend-realtime' | 'enterprise' | 'experiments';

export interface ProjectCategory {
  id: ProjectCategoryId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  accent: AccentKey;
  count: number;
}

export type ArchitectureNodeType =
  | 'client'
  | 'service'
  | 'database'
  | 'ai'
  | 'cache'
  | 'queue'
  | 'legacy';

export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel?: string;
  type: ArchitectureNodeType;
  technology: string;
  description?: string;
}

export interface ArchitectureFlow {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface ProjectArchitecture {
  title: string;
  description: string;
  nodes: ArchitectureNode[];
  flows: ArchitectureFlow[];
}

export interface ProjectChallenge {
  title: string;
  problem: string;
  solution: string;
}

export interface ProjectLink {
  label: string;
  url: string;
  type: 'github' | 'demo' | 'docs';
}

export interface ProjectStat {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProjectCategoryId;
  categoryName: string;
  technologies: string[];
  role: string;
  duration: string;
  status: 'production' | 'completed' | 'active' | 'archived';
  featured: boolean;
  accent: AccentKey;
  icon: string;
  overview: string[];
  problem: string;
  solution: string;
  myContribution: string[];
  highlights: string[];
  challenges: ProjectChallenge[];
  architecture?: ProjectArchitecture;
  links?: ProjectLink[];
  stats?: ProjectStat[];
}
