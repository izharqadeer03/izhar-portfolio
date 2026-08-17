'use client';

import type { ProjectArchitecture } from '@izhar-os/types';
import { cn } from '@izhar-os/ui';
import {
  Activity,
  Brain,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Layers,
  Network,
  Server,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface ProjectArchitectureDiagramProps {
  architecture: ProjectArchitecture;
}

export function ProjectArchitectureDiagram({ architecture }: ProjectArchitectureDiagramProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = architecture.nodes.find((node) => node.id === selectedNodeId);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-void/40 p-4 @container">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Network size={16} className="text-accent" />
          <h4 className="text-[14px] font-semibold text-fg">{architecture.title}</h4>
        </div>
        <p className="text-[12px] text-muted">{architecture.description}</p>
      </div>

      {/* Nodes visual layout */}
      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4">
        {architecture.nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const isConnectedToSelected =
            selectedNodeId !== null &&
            architecture.flows.some(
              (f) =>
                (f.from === selectedNodeId && f.to === node.id) ||
                (f.to === selectedNodeId && f.from === node.id),
            );

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
              className={cn(
                'group relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
                isSelected
                  ? 'border-accent/80 bg-accent/10 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                  : isConnectedToSelected
                    ? 'border-accent/40 bg-white/[0.04]'
                    : 'border-line/70 bg-surface/40 hover:border-line hover:bg-white/[0.03]',
              )}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span
                  className={cn(
                    'grid size-7 place-items-center rounded-md text-muted transition-colors',
                    getNodeTypeBadgeColor(node.type),
                  )}
                >
                  <NodeIcon type={node.type} />
                </span>
                <span className="font-mono text-[10px] tracking-wider text-faint uppercase">
                  {node.type}
                </span>
              </div>

              <div>
                <p className="text-[13px] font-medium text-fg group-hover:text-accent">
                  {node.label}
                </p>
                {node.sublabel ? (
                  <p className="text-[11px] text-muted">{node.sublabel}</p>
                ) : null}
              </div>

              <div className="mt-1 flex items-center gap-1 rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10.5px] text-faint">
                <span>{node.technology}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details or Instructions */}
      <div className="rounded-lg border border-line/60 bg-surface/30 p-3">
        {selectedNode ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-mono text-[11px] text-accent">
              <Zap size={13} />
              <span>
                Node: {selectedNode.label} ({selectedNode.technology})
              </span>
            </div>
            <p className="text-[12px] text-fg/90">
              {selectedNode.description || 'Core system component.'}
            </p>
            {/* Show connections for this node */}
            <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
              <span className="text-faint">Connections:</span>
              {architecture.flows
                .filter((f) => f.from === selectedNode.id || f.to === selectedNode.id)
                .map((f, i) => {
                  const targetId = f.from === selectedNode.id ? f.to : f.from;
                  const targetNode = architecture.nodes.find((n) => n.id === targetId);
                  const isOutgoing = f.from === selectedNode.id;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded bg-accent/15 px-2 py-0.5 text-accent-fg"
                    >
                      <span>{isOutgoing ? '→' : '←'}</span>
                      <span>{targetNode?.label || targetId}</span>
                      {f.label ? <span className="opacity-70">({f.label})</span> : null}
                    </span>
                  );
                })}
            </div>
          </div>
        ) : (
          <p className="text-center font-mono text-[11.5px] text-faint">
            Click any component node above to highlight connection flows and view architecture details.
          </p>
        )}
      </div>
    </div>
  );
}

function NodeIcon({ type }: { type: string }) {
  switch (type) {
    case 'client':
      return <Globe size={14} />;
    case 'service':
      return <Server size={14} />;
    case 'database':
      return <Database size={14} />;
    case 'ai':
      return <Brain size={14} />;
    case 'cache':
      return <Cpu size={14} />;
    case 'queue':
      return <Layers size={14} />;
    case 'legacy':
      return <HardDrive size={14} />;
    default:
      return <Activity size={14} />;
  }
}

function getNodeTypeBadgeColor(type: string) {
  switch (type) {
    case 'client':
      return 'bg-cyan-500/10 text-cyan-400';
    case 'service':
      return 'bg-blue-500/10 text-blue-400';
    case 'database':
      return 'bg-emerald-500/10 text-emerald-400';
    case 'ai':
      return 'bg-violet-500/10 text-violet-400';
    case 'cache':
      return 'bg-amber-500/10 text-amber-400';
    case 'queue':
      return 'bg-rose-500/10 text-rose-400';
    default:
      return 'bg-zinc-500/10 text-zinc-400';
  }
}
