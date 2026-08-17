'use client';

import { SKILLS } from '@izhar-os/config';
import type { SkillItem } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  ArrowDown,
  Cloud,
  Cpu,
  Database,
  Globe,
  Radio,
  Sparkles,
  Zap,
} from 'lucide-react';

import { useApplicationChrome } from '@/hooks/useEnvironment';

interface ArchitectureStackViewProps {
  selectedSkill: SkillItem | null;
  onSelectSkill: (skill: SkillItem) => void;
}

interface StackLayer {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Globe;
  accent: string;
  accentBg: string;
  accentBorder: string;
  skillIds: string[];
}

const ARCHITECTURE_LAYERS: StackLayer[] = [
  {
    id: 'presentation-api',
    title: '1. Presentation & API Contracts',
    subtitle: 'User interfaces, contract-first APIs, and external integration points',
    icon: Globe,
    accent: 'text-rose-400',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/30',
    skillIds: ['nextjs', 'reactjs', 'angular', 'rest-apis', 'graphql', 'rest-graphql-api-design', 'payment-gateway', 'google-calendar-api', 'zoom-api'],
  },
  {
    id: 'compute-services',
    title: '2. Microservices & Backend Compute',
    subtitle: 'High-concurrency services, controller-service-repo layers, and language runtimes',
    icon: Cpu,
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
    skillIds: ['golang-backend', 'golang-lang', 'gin-framework', 'nodejs-backend', 'nodejs-lang', 'expressjs', 'microservices-arch', 'javascript', 'python', 'c-cpp'],
  },
  {
    id: 'realtime-stream',
    title: '3. Real-Time & Event Stream Layer',
    subtitle: 'Duplex WebSockets, Redis pub/sub broadcasting, and asynchronous event streams',
    icon: Radio,
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
    skillIds: ['websockets', 'socket-io', 'webrtc', 'redis-pubsub', 'event-driven-arch'],
  },
  {
    id: 'ai-engine',
    title: '4. AI / LLM & Semantic Retrieval Engine',
    subtitle: 'Foundation models, tool execution, autonomous agents, and vector search',
    icon: Sparkles,
    accent: 'text-violet-400',
    accentBg: 'bg-violet-500/10',
    accentBorder: 'border-violet-500/30',
    skillIds: ['openai-api', 'llm-integration', 'ai-powered-apps', 'semantic-search', 'prompt-engineering', 'langchain', 'agentic-ai'],
  },
  {
    id: 'persistence-search',
    title: '5. Persistence & Multi-Model Storage',
    subtitle: 'Relational ACID persistence, in-memory caching, vector DBs, full-text & graph',
    icon: Database,
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
    skillIds: ['postgresql', 'redis', 'mongodb', 'opensearch', 'pinecone', 'neo4j'],
  },
  {
    id: 'platform-cloud',
    title: '6. Platform, Containers & DevOps',
    subtitle: 'Reproducible containerization, cloud infrastructure, and CI/CD pipelines',
    icon: Cloud,
    accent: 'text-sky-400',
    accentBg: 'bg-sky-500/10',
    accentBorder: 'border-sky-500/30',
    skillIds: ['docker', 'aws', 'azure', 'cicd', 'git'],
  },
];

export function ArchitectureStackView({
  selectedSkill,
  onSelectSkill,
}: ArchitectureStackViewProps) {
  const chrome = useApplicationChrome();

  return (
    <div className="space-y-6 pb-6 select-none">
      {/* Header Banner */}
      <div className="rounded-xl border border-line bg-surface/40 p-4 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap size={13} />
            </span>
            <h3 className="text-[14px] font-bold text-fg">
              Full-Stack System Flow Architecture
            </h3>
          </div>
          <p className="mt-1 text-[11.5px] text-muted">
            How these technologies interconnect across request lifecycle, persistence, real-time channels, and AI agents.
          </p>
        </div>

        <span className="rounded-md border border-line bg-void/60 px-2.5 py-1 text-[11px] font-mono text-faint shrink-0">
          6 Architectural Layers · {SKILLS.length} Technologies
        </span>
      </div>

      {/* Layers */}
      <div className="space-y-4">
        {ARCHITECTURE_LAYERS.map((layer, index) => {
          const LayerIcon = layer.icon;
          const layerSkills = layer.skillIds
            .map((id) => SKILLS.find((s) => s.id === id))
            .filter((s): s is SkillItem => s !== undefined);

          return (
            <div key={layer.id} className="space-y-2">
              <div
                style={{ borderRadius: chrome.cardRadius }}
                className={cn(
                  'border border-line/70 bg-surface/30 p-4 transition-all duration-150',
                  'hover:border-line-strong hover:bg-surface/45',
                )}
              >
                {/* Layer Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        'grid size-7 place-items-center rounded-lg border',
                        layer.accentBg,
                        layer.accentBorder,
                        layer.accent,
                      )}
                    >
                      <LayerIcon size={14} />
                    </span>
                    <div>
                      <h4 className="text-[13px] font-bold text-fg">{layer.title}</h4>
                      <p className="text-[11px] text-muted">{layer.subtitle}</p>
                    </div>
                  </div>

                  <span className="font-mono text-[10.5px] text-faint">
                    {layerSkills.length} Components
                  </span>
                </div>

                {/* Tech chips inside layer */}
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {layerSkills.map((skill) => {
                    const isSelected = selectedSkill?.id === skill.id;
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => onSelectSkill(skill)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-start transition-all cursor-pointer select-none',
                          isSelected
                            ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-xs'
                            : 'border-line/60 bg-void/50 text-fg hover:border-line-strong hover:bg-white/[0.06]',
                        )}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-semibold">{skill.name}</span>
                            <span className="rounded bg-void/60 px-1.5 py-0.2 font-mono text-[9.5px] text-faint border border-line/40">
                              {skill.years}
                            </span>
                          </div>
                          {skill.architecturalRole ? (
                            <span className="text-[10px] text-muted line-clamp-1 max-w-[200px]">
                              {skill.architecturalRole}
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connecting arrow between layers */}
              {index < ARCHITECTURE_LAYERS.length - 1 ? (
                <div className="flex justify-center py-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-faint">
                    <ArrowDown size={12} className="text-amber-400/60" />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
