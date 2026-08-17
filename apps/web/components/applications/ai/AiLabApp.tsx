'use client';

import type { AiMessage } from '@izhar-os/types';
import { cn, OSButton } from '@izhar-os/ui';
import {
  Bot,
  CircuitBoard,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  Terminal,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ApplicationViewProps } from '@/components/applications/ApplicationRegistry';
import { useToastStore } from '@/lib/store/toast-store';

const INITIAL_MESSAGES: AiMessage[] = [
  {
    id: 'msg-0',
    sender: 'assistant',
    timestamp: Date.now(),
    content:
      "Hello! I am the **Izhar OS AI Assistant**, connected to Izhar Qadeer's portfolio knowledge graph, architecture specifications, and technical projects.\n\nAsk me anything about Izhar's backend architectures in **Golang & Node.js**, database design in **PostgreSQL & Redis**, or **LLM/RAG agent systems**.",
    suggestions: [
      "What is Izhar's Golang experience?",
      'Explain the Lands & Homes hybrid search architecture',
      'How does BoostAI agent orchestrator work?',
      'What databases has Izhar used in production?',
    ],
  },
];

const PRESET_ANSWERS: Record<string, { content: string; tool?: { name: string; args: Record<string, unknown>; result: string } }> = {
  golang: {
    tool: {
      name: 'query_skill_matrix',
      args: { language: 'Golang', category: 'backend' },
      result: 'Found: Golang (3+ years), Goroutines, gRPC, Gin, Fiber, High-concurrency systems.',
    },
    content:
      "**Izhar's Golang & Backend Engineering Focus:**\n\n- **Production Experience**: 3+ years writing high-throughput, low-latency microservices and distributed APIs.\n- **Core Implementations**:\n  1. **Lands & Homes Search Engine**: Go REST & gRPC endpoints handling hybrid vector + relational queries with <45ms P95 latency.\n  2. **Practice Management ERP**: Concurrency control in Go, appointment schedule conflict resolution, and ACID transactions in PostgreSQL.\n  3. **Chat SDK Engine**: High-concurrency WebSocket channels multiplexed across worker goroutines and Redis Pub/Sub channels.\n- **Key Paradigms**: Goroutine worker pools, context propagation, buffered channels, structured logging, and clean hexagonal architecture.",
  },
  lands: {
    tool: {
      name: 'inspect_project_architecture',
      args: { projectId: 'lands-and-homes' },
      result: 'Retrieved: Hybrid Vector (Pinecone) + Relational (PostgreSQL) + Inverted (OpenSearch) + Cache (Redis).',
    },
    content:
      "**Lands & Homes Discovery Engine Architecture:**\n\n```mermaid\nQuery -> NLP Parser -> [Vector Search (Pinecone) + Relational Filters (Postgres)] -> Reranker -> Redis Cache -> Client\n```\n\n- **Hybrid Retrieval**: Combines semantic embeddings from OpenAI via **Pinecone** with hard structured relational filtering in **PostgreSQL** and full-text keyword indexing in **OpenSearch**.\n- **Performance**: Sub-45ms P95 latency across 50,000+ real estate property records.\n- **Multi-Database Federation**: Redis caching layer with TTL eviction + Neo4j graph relationships for neighborhood amenities.",
  },
  boostai: {
    tool: {
      name: 'inspect_project_architecture',
      args: { projectId: 'boostai' },
      result: 'Retrieved: Multi-agent execution runtime with BullMQ queue, Redis state store, Next.js streaming.',
    },
    content:
      "**BoostAI — Enterprise Agent Orchestrator:**\n\n- **Agent Runtime**: Multi-step autonomous agent loops executing tool calls (APIs, SQL queries, document synthesis).\n- **Job Queue**: Distributed background task execution powered by **BullMQ** and **Redis** for rate limiting and task retries.\n- **Frontend Interface**: Next.js 16 App Router with Server-Sent Events (SSE) streaming tokens directly to the interface in real time.",
  },
  databases: {
    tool: {
      name: 'query_database_stack',
      args: { filter: 'all_storage_engines' },
      result: 'Found: PostgreSQL, MongoDB, Redis, OpenSearch, Pinecone, Neo4j.',
    },
    content:
      "**Production Storage & Database Expertise:**\n\n1. **PostgreSQL**: Complex relational schemas, JSONB indexing, window functions, and migrations.\n2. **Redis**: In-memory caching, Pub/Sub channels, Redlock distributed locking, and BullMQ queues.\n3. **Pinecone Vector DB**: Dense embeddings, cosine similarity search, and hybrid metadata filtering.\n4. **OpenSearch / Elasticsearch**: Inverted index tuning, tokenizers, and BM25 text relevance ranking.\n5. **MongoDB**: Document storage, change streams, and aggregation pipelines.\n6. **Neo4j**: Graph databases and Cypher relationship queries.",
  },
};

export function AiLabApp(_props: ApplicationViewProps) {
  const addToast = useToastStore((state) => state.addToast);
  const [messages, setMessages] = useState<AiMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isGenerating]);

  const handleSend = useCallback(
    (textToSend?: string) => {
      const query = (textToSend ?? input).trim();
      if (!query || isGenerating) return;

      const userMsg: AiMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        content: query,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInput('');
      setIsGenerating(true);

      // Determine response logic
      const q = query.toLowerCase();
      let matched: { content: string; tool?: { name: string; args: Record<string, unknown>; result: string } } =
        PRESET_ANSWERS.golang ?? {
          content: 'Information from Izhar Qadeer portfolio.',
        };

      if (q.includes('land') || q.includes('search') || q.includes('estate') || q.includes('hybrid')) {
        matched = PRESET_ANSWERS.lands ?? matched;
      } else if (q.includes('boost') || q.includes('agent') || q.includes('orchestrat')) {
        matched = PRESET_ANSWERS.boostai ?? matched;
      } else if (q.includes('data') || q.includes('sql') || q.includes('redis') || q.includes('postgres')) {
        matched = PRESET_ANSWERS.databases ?? matched;
      } else if (q.includes('go') || q.includes('backend') || q.includes('microservice')) {
        matched = PRESET_ANSWERS.golang ?? matched;
      } else {
        matched = {
          tool: {
            name: 'search_knowledge_graph',
            args: { query },
            result: 'Matched: Full Stack Developer (Izhar Qadeer) · Golang, Node.js, Next.js, AI Systems.',
          },
          content: `Here is information on **${query}** based on Izhar's portfolio:\n\nIzhar Qadeer is a **Full Stack & Backend Developer** with 3+ years of production experience across **Golang, Node.js, Next.js, React, PostgreSQL, Redis, and AI/LLM agent systems**.\n\nYou can explore deep-dive case studies in the **Projects Explorer** or view his full career timeline in the **Experience** application.`,
        };
      }

      setTimeout(() => {
        const assistantMsg: AiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          content: matched.content,
          timestamp: Date.now(),
          toolCall: matched.tool,
          suggestions: [
            'Explain Lands & Homes architecture',
            "What is Izhar's Golang experience?",
            'What databases has Izhar used?',
          ],
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsGenerating(false);
      }, 1000);
    },
    [input, isGenerating],
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface/15 select-none @container">
      {/* OS Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface/40 px-3 py-2 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-line bg-void/40 px-2.5 py-1 text-[12px] text-fg">
            <CircuitBoard size={13} className="text-cyan-400" />
            <span className="font-medium">AI Lab · Portfolio Agent Copilot</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 font-mono text-[10.5px] text-cyan-300 border border-cyan-500/20">
            <Sparkles size={10} /> Model: Izhar-Agent-RAG
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <OSButton
            size="sm"
            variant="ghost"
            onClick={() => {
              setMessages(INITIAL_MESSAGES);
              addToast('Conversation reset.', 'info');
            }}
            className="text-[11.5px]"
          >
            <RotateCcw size={12} />
            <span className="hidden sm:inline">Reset Chat</span>
          </OSButton>
        </div>
      </header>

      {/* Chat Messages Container */}
      <main ref={scrollRef} className="os-scroll flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-3 max-w-[88%]',
              msg.sender === 'user' ? 'ms-auto flex-row-reverse' : 'me-auto',
            )}
          >
            <div
              className={cn(
                'size-8 shrink-0 rounded-xl grid place-items-center border text-[12px]',
                msg.sender === 'user'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
              )}
            >
              {msg.sender === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>

            <div className="space-y-2 min-w-0">
              {/* Tool call execution badge if present */}
              {msg.toolCall ? (
                <div className="rounded-lg border border-line/60 bg-void/60 px-3 py-1.5 font-mono text-[11px] text-muted space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                    <Terminal size={11} /> Tool Executed: {msg.toolCall.name}()
                  </div>
                  <div className="text-faint text-[10px] truncate">
                    Args: {JSON.stringify(msg.toolCall.args)}
                  </div>
                </div>
              ) : null}

              {/* Message Bubble */}
              <div
                className={cn(
                  'rounded-2xl p-4 text-[13px] leading-relaxed shadow-sm',
                  msg.sender === 'user'
                    ? 'bg-white/10 text-white rounded-tr-xs border border-white/15'
                    : 'bg-surface/50 text-fg/90 rounded-tl-xs border border-line',
                )}
              >
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>
              </div>

              {/* Suggestion Chips */}
              {msg.suggestions?.length ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="rounded-lg border border-line bg-surface/30 px-2.5 py-1 text-[11.5px] text-muted hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {isGenerating ? (
          <div className="flex gap-3 max-w-[80%] me-auto">
            <div className="size-8 shrink-0 rounded-xl grid place-items-center border bg-cyan-500/20 border-cyan-500/40 text-cyan-300">
              <Bot size={15} />
            </div>
            <div className="rounded-2xl rounded-tl-xs border border-line bg-surface/50 p-3.5 flex items-center gap-2 text-[12.5px] text-muted">
              <Loader2 size={14} className="animate-spin text-cyan-400" />
              <span>Synthesizing answer from architecture docs...</span>
            </div>
          </div>
        ) : null}
      </main>

      {/* Input Form Bar */}
      <footer className="border-t border-line bg-surface/40 p-3 backdrop-blur-md shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            placeholder="Ask about Golang microservices, Lands & Homes, BoostAI, DBs..."
            className="flex-1 h-10 rounded-xl border border-line bg-void/70 px-3.5 text-[13px] text-fg placeholder:text-faint focus:border-cyan-500/60 focus:outline-hidden"
          />

          <OSButton
            size="md"
            variant="accent"
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="shrink-0"
          >
            <Send size={13} />
            <span className="hidden sm:inline">Ask AI</span>
          </OSButton>
        </form>
      </footer>
    </div>
  );
}
