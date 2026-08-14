import type { AboutProfile } from '@izhar-os/types';

/**
 * The content of the About application.
 *
 * Written to be read at a glance: every entry is short enough to survive being
 * set at display size in a 900px window, and nothing here is padding. The
 * numbers are the ones from `SYSTEM_PROFILE` — this file describes the work,
 * not the operator, so it never restates a name, a role or a status.
 */
export const ABOUT_PROFILE: AboutProfile = {
  positioning:
    'Full stack developer with backend expertise — Golang, Node.js, scalable APIs and microservices at the core, Next.js, React and TypeScript interfaces on top, and AI/LLM systems throughout.',

  introduction: [
    'I build the parts of a product that have to keep working when everything else is on fire: the services behind the interface, the data underneath them, and the contracts that hold the two together — then I build the interface too.',
    'Most of my work lives in Go and Node.js — HTTP and GraphQL APIs, event-driven services, realtime channels — and surfaces through Next.js, React, TypeScript and Angular front ends, with a growing share of it now wired into language models rather than around them.',
  ],

  stats: [
    {
      id: 'experience',
      value: '3+',
      label: 'Years Experience',
      detail: 'Shipping production systems',
      countTo: 3,
    },
    {
      id: 'focus',
      value: 'Full Stack',
      label: 'Engineering Focus',
      detail: 'Interfaces, services, data',
    },
    {
      id: 'ai',
      value: 'AI',
      label: 'LLM Integration',
      detail: 'Agents and semantic search',
    },
    {
      id: 'scale',
      value: 'Scalable',
      label: 'Distributed Systems',
      detail: 'Built to grow sideways',
    },
  ],

  journey: [
    {
      id: 'engineering',
      label: 'Software Engineering',
      detail: 'Fundamentals, product work and the habit of shipping.',
    },
    {
      id: 'backend',
      label: 'Backend Development',
      detail: 'Services, persistence and the systems behind the screen.',
    },
    {
      id: 'apis',
      label: 'Scalable APIs & Microservices',
      detail: 'Clear contracts, independent deploys, boring failure modes.',
    },
    {
      id: 'frontend',
      label: 'Frontend & Full Stack',
      detail: 'Next.js and React interfaces owned end to end, from schema to screen.',
    },
    {
      id: 'realtime',
      label: 'Realtime Systems',
      detail: 'WebSockets, events and state that moves as it happens.',
    },
    {
      id: 'ai',
      label: 'AI / LLM Integration',
      detail: 'Retrieval, agents and models as ordinary backend components.',
    },
  ],

  buildAreas: [
    {
      id: 'backend',
      title: 'Backend Systems',
      summary: 'Scalable APIs, microservices and distributed backend services.',
      icon: 'server',
      accent: 'cyan',
      tags: ['Golang', 'Node.js', 'REST', 'GraphQL'],
    },
    {
      id: 'frontend',
      title: 'Frontend Interfaces',
      summary: 'Server-rendered and single-page interfaces on top of my own APIs.',
      icon: 'interface',
      accent: 'rose',
      tags: ['Next.js', 'React', 'TypeScript', 'Angular'],
    },
    {
      id: 'realtime',
      title: 'Realtime Applications',
      summary: 'WebSockets, event-driven services and realtime communication.',
      icon: 'realtime',
      accent: 'violet',
      tags: ['WebSockets', 'Socket.io', 'Events', 'Queues'],
    },
    {
      id: 'ai',
      title: 'AI-Powered Systems',
      summary: 'LLM integrations, semantic search, agents and intelligent workflows.',
      icon: 'ai',
      accent: 'emerald',
      tags: ['LLM APIs', 'RAG', 'Agents', 'Embeddings'],
    },
    {
      id: 'data',
      title: 'Data & Search',
      summary: 'Relational, document, cache, search and vector storage.',
      icon: 'database',
      accent: 'amber',
      tags: ['PostgreSQL', 'MongoDB', 'Redis', 'OpenSearch'],
    },
    {
      id: 'cloud',
      title: 'Cloud & Infrastructure',
      summary: 'Containers, pipelines and the path from commit to production.',
      icon: 'cloud',
      accent: 'slate',
      tags: ['AWS', 'Azure', 'Docker', 'CI/CD'],
    },
  ],

  /**
   * Emphasis, not proficiency. The values describe how the working week is
   * actually spent; the interface says so out loud rather than presenting them
   * as scores.
   */
  focusAreas: [
    { id: 'backend', label: 'Backend', emphasis: 1, note: 'Services and business logic' },
    { id: 'apis', label: 'APIs', emphasis: 0.94, note: 'REST and GraphQL contracts' },
    { id: 'architecture', label: 'Architecture', emphasis: 0.88, note: 'Boundaries and data flow' },
    { id: 'frontend', label: 'Frontend', emphasis: 0.85, note: 'Next.js, React and Angular UIs' },
    { id: 'realtime', label: 'Realtime', emphasis: 0.8, note: 'Sockets and event streams' },
    { id: 'ai', label: 'AI / LLM', emphasis: 0.74, note: 'Retrieval and agent workflows' },
    { id: 'cloud', label: 'Cloud', emphasis: 0.64, note: 'Deployment and infrastructure' },
  ],

  stack: [
    { id: 'languages', label: 'Languages', items: ['Golang', 'TypeScript', 'JavaScript', 'SQL'] },
    {
      id: 'services',
      label: 'Services',
      items: ['Node.js', 'REST', 'GraphQL', 'gRPC', 'Microservices'],
    },
    {
      id: 'frontend',
      label: 'Frontend',
      items: ['Next.js', 'React', 'Angular', 'Tailwind CSS'],
    },
    {
      id: 'data',
      label: 'Data',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'OpenSearch', 'Vector DBs'],
    },
    { id: 'ai', label: 'AI', items: ['LLM APIs', 'Semantic search', 'RAG', 'Agents'] },
    { id: 'platform', label: 'Platform', items: ['AWS', 'Azure', 'Docker', 'CI/CD'] },
  ],

  interests: [
    'Agentic backends that call tools instead of returning text',
    'Retrieval quality — the unglamorous half of every AI feature',
    'Go concurrency patterns for realtime workloads',
    'React Server Components and where the API boundary should actually sit',
    'Keeping distributed systems debuggable at 3am',
  ],
};
