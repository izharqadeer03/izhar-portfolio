import type { Project, ProjectCategory, ProjectCategoryId } from '@izhar-os/types';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    id: 'ai-systems',
    name: 'AI & Intelligent Systems',
    shortName: 'AI Systems',
    description: 'LLM agents, vector retrieval, semantic search and AI-driven automation.',
    icon: 'ai',
    accent: 'cyan',
    count: 2,
  },
  {
    id: 'backend-realtime',
    name: 'Backend & Realtime Systems',
    shortName: 'Backend & Realtime',
    description: 'High-concurrency services, WebSockets, event pipelines and API design.',
    icon: 'server',
    accent: 'violet',
    count: 2,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Systems',
    shortName: 'Enterprise',
    description: 'Legacy system modernization, mission-critical workflows and enterprise persistence.',
    icon: 'database',
    accent: 'emerald',
    count: 1,
  },
  {
    id: 'experiments',
    name: 'Experiments / Future',
    shortName: 'Experiments',
    description: 'R&D, proof-of-concepts, and upcoming architectural experiments.',
    icon: 'code',
    accent: 'amber',
    count: 0,
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'lands-and-homes',
    name: 'Lands & Homes',
    shortDescription: 'AI-powered real estate discovery engine with multi-database semantic search.',
    description:
      'A high-performance real estate discovery platform powered by hybrid vector and relational retrieval, combining structured property filtering with natural language query parsing.',
    category: 'ai-systems',
    categoryName: 'AI & Intelligent Systems',
    technologies: [
      'Golang',
      'Python',
      'FastAPI',
      'OpenAI',
      'Redis',
      'PostgreSQL',
      'OpenSearch',
      'Neo4j',
      'Pinecone',
      'Semantic Search',
    ],
    role: 'Lead Backend & AI Systems Engineer',
    duration: '6 Months',
    status: 'production',
    featured: true,
    accent: 'cyan',
    icon: 'ai',
    overview: [
      'Lands & Homes replaces conventional keyword land search with an intelligent, multi-layered retrieval pipeline capable of handling complex natural language queries like "3-acre plot near water body with commercial zoning under $500k".',
      'Built around a Golang core service, the platform orchestrates relational property metadata, spatial open search indexes, knowledge graph relationships for zoning laws, and dense vector embeddings for semantic matches.',
    ],
    problem:
      'Traditional real estate platforms rely strictly on precise SQL filters, making natural language search inflexible and unable to evaluate spatial context, zoning proximity, or subjective property descriptions.',
    solution:
      'Engineered a hybrid retrieval engine using FastAPI for LLM query intent extraction, combined with Pinecone vector search for semantic relevance, OpenSearch for spatial indexing, Neo4j for location graphs, and PostgreSQL for transactional integrity — all unified by a ultra-low-latency Golang orchestration backend.',
    myContribution: [
      'Architected the Golang core backend for high-throughput query orchestration and cache warming via Redis.',
      'Designed the multi-modal search strategy combining dense vectors (Pinecone) with BM25 spatial search (OpenSearch).',
      'Implemented FastAPI microservices for LLM function-calling and natural language intent parsing.',
      'Optimized query execution time from 1.4s down to under 120ms through parallel retrieval and smart connection pooling.',
    ],
    highlights: [
      'Sub-120ms average response time for multi-source hybrid search.',
      '94% search accuracy on natural language property requirements.',
      'Scalable microservice layout separating AI query expansion from transaction processing.',
    ],
    challenges: [
      {
        title: 'Combining Vector Similarity with Hard Relational Filters',
        problem:
          'Vector database cosine similarity search frequently returns properties that violate hard constraints (such as budget ceiling or zoning rights).',
        solution:
          'Implemented a two-stage hybrid retrieval pattern: pre-filtering candidates in PostgreSQL & OpenSearch before performing rescoring against Pinecone vector embeddings.',
      },
      {
        title: 'High Latency in LLM Intent Parsing',
        problem:
          'Direct callouts to LLMs on every web request introduced unacceptable latency spikes for end visitors.',
        solution:
          'Built an in-memory Redis semantic query cache that normalizes and matches recurring intent patterns without invoking full LLM generation passes.',
      },
    ],
    architecture: {
      title: 'Lands & Homes Hybrid AI Retrieval Engine',
      description:
        'Data flow showing natural language query ingestion, parallel multi-database retrieval, and final response synthesis.',
      nodes: [
        {
          id: 'client',
          label: 'Client UI',
          sublabel: 'Web / Mobile',
          type: 'client',
          technology: 'Next.js / React',
          description: 'Submits natural language property search query.',
        },
        {
          id: 'go-backend',
          label: 'Go Backend Gateway',
          sublabel: 'Orchestrator',
          type: 'service',
          technology: 'Golang',
          description: 'Manages request lifecycle, caching, and parallel service dispatch.',
        },
        {
          id: 'ai-service',
          label: 'AI Query Analysis',
          sublabel: 'Intent & Entity Extraction',
          type: 'ai',
          technology: 'Python / FastAPI / OpenAI',
          description: 'Extracts structured parameters, zoning intent, and query embeddings.',
        },
        {
          id: 'redis',
          label: 'Semantic Cache',
          sublabel: 'Query Warm Cache',
          type: 'cache',
          technology: 'Redis',
          description: 'Caches query intent vectors and frequent search responses.',
        },
        {
          id: 'postgres',
          label: 'Property DB',
          sublabel: 'Relational Store',
          type: 'database',
          technology: 'PostgreSQL',
          description: 'Transactional source of truth for listing status, pricing, and owners.',
        },
        {
          id: 'opensearch',
          label: 'Spatial Search',
          sublabel: 'Geo & Keyword Index',
          type: 'database',
          technology: 'OpenSearch',
          description: 'Handles geospatial bounding boxes and keyword text scoring.',
        },
        {
          id: 'neo4j',
          label: 'Location Graph',
          sublabel: 'Zoning & Proximity',
          type: 'database',
          technology: 'Neo4j',
          description: 'Models relationships between plots, utility networks, and municipal zones.',
        },
        {
          id: 'pinecone',
          label: 'Vector Store',
          sublabel: 'Semantic Embeddings',
          type: 'database',
          technology: 'Pinecone',
          description: 'Dense vector search over qualitative property descriptions.',
        },
      ],
      flows: [
        { from: 'client', to: 'go-backend', label: '1. User Query', animated: true },
        { from: 'go-backend', to: 'redis', label: '2. Check Cache', animated: false },
        { from: 'go-backend', to: 'ai-service', label: '3. Intent Parsing', animated: true },
        { from: 'go-backend', to: 'postgres', label: '4a. Hard Filters', animated: false },
        { from: 'go-backend', to: 'opensearch', label: '4b. Geo Search', animated: false },
        { from: 'go-backend', to: 'neo4j', label: '4c. Graph Proximity', animated: false },
        { from: 'ai-service', to: 'pinecone', label: '5. Vector Rescore', animated: true },
      ],
    },
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/izharqadeer03', type: 'github' },
    ],
    stats: [
      { label: 'Latency', value: '<120ms' },
      { label: 'Databases', value: '4 Engines' },
      { label: 'Language', value: 'Go + Python' },
    ],
  },
  {
    id: 'boostai-business-platform',
    name: 'BoostAI Business Platform',
    shortDescription: 'Enterprise AI orchestration platform for automated business workflows & scheduling.',
    description:
      'An end-to-end intelligent platform that automates customer inquiries, calendar scheduling, meeting summaries, and multi-channel CRM synchronization.',
    category: 'ai-systems',
    categoryName: 'AI & Intelligent Systems',
    technologies: [
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'WebSockets',
      'OpenAI',
      'Google Calendar API',
      'Zoom API',
    ],
    role: 'Lead Full Stack Systems Architect',
    duration: '8 Months',
    status: 'production',
    featured: true,
    accent: 'cyan',
    icon: 'ai',
    overview: [
      'BoostAI is an automated business platform that transforms how enterprises interact with incoming leads. It integrates AI conversation agents directly into WebSockets chat streams, Google Calendar, and Zoom APIs.',
      'The platform monitors incoming inquiries, dispatches tool-calling AI agents to answer domain questions, verifies calendar availability in real time, and automatically provisions video meetings.',
    ],
    problem:
      'Businesses waste hundreds of hours manually coordinating client consultations across email, calendar invites, and CRM updates, causing slow response times and missed sales opportunities.',
    solution:
      'Engineered an event-driven Node.js & PostgreSQL platform where OpenAI function-calling tools interact with WebSockets for live chat, Google Calendar API for instant conflict resolution, and Zoom API for automated link generation.',
    myContribution: [
      'Designed the event-driven microservices architecture using Node.js, Express, and PostgreSQL.',
      'Implemented real-time bidirectional WebSocket rooms for seamless human-agent handoffs.',
      'Developed OAuth2 token rotation and webhook listeners for Google Calendar and Zoom integrations.',
      'Built strict tool-use schemas preventing LLM hallucinations during appointment scheduling.',
    ],
    highlights: [
      'Real-time AI voice/text scheduling with zero calendar double-booking.',
      'Automated post-meeting transcript summary generation and CRM insertion.',
      'Fault-tolerant webhook processing with automatic exponential backoff.',
    ],
    challenges: [
      {
        title: 'Handling Real-time Calendar Race Conditions',
        problem:
          'Simultaneous client bookings on the same calendar slot caused double-booking conflicts.',
        solution:
          'Implemented PostgreSQL advisory locks and distributed mutex locks around calendar reservation transactions.',
      },
    ],
    architecture: {
      title: 'BoostAI Automation & Integration Workflow',
      description:
        'Event stream showing live chat interaction, AI tool invocation, and external API sync.',
      nodes: [
        {
          id: 'client',
          label: 'Client Web Application',
          sublabel: 'Realtime Chat',
          type: 'client',
          technology: 'React / WebSockets',
          description: 'Client connects via WebSocket for real-time assistant chat.',
        },
        {
          id: 'node-core',
          label: 'Node.js Core API',
          sublabel: 'Event Orchestrator',
          type: 'service',
          technology: 'Node.js / Express',
          description: 'Handles WebSocket routing, session state, and webhook handling.',
        },
        {
          id: 'postgres',
          label: 'Enterprise Store',
          sublabel: 'ACID Relational DB',
          type: 'database',
          technology: 'PostgreSQL',
          description: 'Stores business state, user permissions, and conversation history.',
        },
        {
          id: 'openai',
          label: 'OpenAI Agent',
          sublabel: 'Function Calling',
          type: 'ai',
          technology: 'GPT-4o API',
          description: 'Processes text intent and triggers booking function calls.',
        },
        {
          id: 'gcal',
          label: 'Google Calendar API',
          sublabel: 'Scheduling',
          type: 'service',
          technology: 'OAuth2 / REST API',
          description: 'Verifies availability and creates calendar events.',
        },
        {
          id: 'zoom',
          label: 'Zoom API',
          sublabel: 'Video Meetings',
          type: 'service',
          technology: 'REST API',
          description: 'Provisions unique meeting URLs and passcode credentials.',
        },
      ],
      flows: [
        { from: 'client', to: 'node-core', label: '1. Live Message', animated: true },
        { from: 'node-core', to: 'openai', label: '2. Agent Prompt', animated: true },
        { from: 'openai', to: 'node-core', label: '3. Tool Call Trigger', animated: false },
        { from: 'node-core', to: 'gcal', label: '4. Check & Reserve Slot', animated: true },
        { from: 'node-core', to: 'zoom', label: '5. Create Meeting', animated: true },
        { from: 'node-core', to: 'postgres', label: '6. Persist Booking', animated: false },
      ],
    },
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/izharqadeer03', type: 'github' },
    ],
    stats: [
      { label: 'Integrations', value: 'GCal + Zoom' },
      { label: 'Backend', value: 'Node.js' },
      { label: 'Realtime', value: 'WebSockets' },
    ],
  },
  {
    id: 'practice-management-system',
    name: 'Practice Management System',
    shortDescription: 'Enterprise healthcare & legal practice system modernized from legacy code to Go & Angular.',
    description:
      'A comprehensive enterprise management platform engineered to modernize legacy monolithic infrastructure into a modular Golang backend with an Angular frontend and MSSQL database.',
    category: 'enterprise',
    categoryName: 'Enterprise Systems',
    technologies: ['Golang', 'Angular', 'MSSQL', 'Legacy Modernization', 'REST APIs', 'Docker'],
    role: 'Enterprise Systems Modernization Engineer',
    duration: '1 Year',
    status: 'production',
    featured: true,
    accent: 'emerald',
    icon: 'database',
    overview: [
      'The Practice Management System is an enterprise-grade ERP designed for multi-branch healthcare and professional practices. It manages patient/client billing, electronic records, staff scheduling, and compliance audit trails.',
      'I led the backend modernization effort, decomposing a fragile 12-year-old monolithic desktop codebase into a clean, containerized Golang REST API coupled with an Angular single-page application.',
    ],
    problem:
      'The legacy monolithic application suffered from frequent database locks, slow reporting queries, and inability to run on modern web and mobile platforms.',
    solution:
      'Designed a phased migration plan that wrapped existing MSSQL procedures with a high-concurrency Golang backend service, providing clean OpenAPI endpoints to a modern, responsive Angular frontend without disrupting ongoing operations.',
    myContribution: [
      'Refactored legacy stored procedures and optimized complex SQL queries in Microsoft SQL Server.',
      'Built a robust Go micro-service layer using gRPC and REST for core business domain logic.',
      'Implemented role-based access control (RBAC) and audit log tracking for HIPAA compliance.',
      'Constructed responsive Angular modules for complex tabbed data tables and report exports.',
    ],
    highlights: [
      'Zero downtime during data model migration for active practice operations.',
      '60% reduction in database CPU utilization following stored procedure optimization.',
      'Unified web interface serving desktop workstations and tablet devices.',
    ],
    challenges: [
      {
        title: 'Preserving 10+ Years of Historical Stored Procedures',
        problem:
          'Over a decade of undocumented business logic was embedded directly in database triggers and procedures.',
        solution:
          'Created automated regression test suites that validated Go API outputs against legacy procedure results before deprecating old paths.',
      },
    ],
    architecture: {
      title: 'Practice Management Modernization Flow',
      description:
        'Structural shift from monolithic desktop setup to modern Go service layer.',
      nodes: [
        {
          id: 'legacy',
          label: 'Legacy Desktop Monolith',
          sublabel: 'Deprecated System',
          type: 'legacy',
          technology: 'Legacy Desktop App',
          description: 'Original desktop application causing database bottlenecks.',
        },
        {
          id: 'angular-ui',
          label: 'Modern Angular Frontend',
          sublabel: 'Web & Tablet Interface',
          type: 'client',
          technology: 'Angular / TypeScript',
          description: 'Fast, accessible single-page web app for practice staff.',
        },
        {
          id: 'go-api',
          label: 'Golang Core API',
          sublabel: 'Microservice Layer',
          type: 'service',
          technology: 'Golang / REST',
          description: 'High-throughput Go service layer enforcing business logic.',
        },
        {
          id: 'mssql',
          label: 'MSSQL Database',
          sublabel: 'Enterprise Store',
          type: 'database',
          technology: 'Microsoft SQL Server',
          description: 'Optimized relational database with audited schemas.',
        },
      ],
      flows: [
        { from: 'angular-ui', to: 'go-api', label: '1. REST API Requests', animated: true },
        { from: 'go-api', to: 'mssql', label: '2. Optimized SQL Queries', animated: true },
      ],
    },
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/izharqadeer03', type: 'github' },
    ],
    stats: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Architecture', value: 'Go + Angular' },
      { label: 'Database', value: 'MSSQL' },
    ],
  },
  {
    id: 'chat-sdk',
    name: 'Chat SDK',
    shortDescription: 'High-concurrency realtime messaging & WebRTC video communication SDK.',
    description:
      'A modular, developer-friendly communication SDK supporting scalable WebSocket chat channels, message persistence, typing indicators, presence tracking, and WebRTC peer connection signaling.',
    category: 'backend-realtime',
    categoryName: 'Backend & Realtime Systems',
    technologies: ['Node.js', 'Socket.io', 'WebRTC', 'MongoDB', 'MySQL', 'Redis'],
    role: 'Realtime Infrastructure Engineer',
    duration: '5 Months',
    status: 'completed',
    featured: true,
    accent: 'violet',
    icon: 'server',
    overview: [
      'Chat SDK provides drop-in realtime messaging and audio/video calling capabilities for web applications. It abstracts away complex socket lifecycle management, binary payload chunking, and peer-to-peer signaling.',
      'Engineered around Socket.io cluster adapter architecture with Redis pub/sub backplane, allowing seamless horizontal scaling across multi-node server instances.',
    ],
    problem:
      'Building reliable realtime messaging with offline sync, message read receipts, and WebRTC fallback requires substantial boilerplate and custom socket state management.',
    solution:
      'Developed an end-to-end SDK combining Socket.io for low-latency channel streaming, MongoDB for flexible unstructured chat payload storage, MySQL for relational user identities, and WebRTC STUN/TURN signaling wrappers.',
    myContribution: [
      'Built the socket cluster architecture using Redis Pub/Sub for horizontal scaling across nodes.',
      'Implemented WebRTC signaling protocols for peer connection negotiation and media renegotiation.',
      'Engineered local IndexedDB queueing with optimistic UI updates and automatic retry on connection drops.',
      'Designed efficient MongoDB indexes for fast pagination of million-message chat threads.',
    ],
    highlights: [
      'Capable of handling 50,000+ concurrent active socket connections per cluster.',
      'Sub-15ms socket message broadcast latency.',
      'End-to-end WebRTC audio/video call signaling with automatic TURN relay failover.',
    ],
    challenges: [
      {
        title: 'Connection Drops & Message Duplication',
        problem:
          'Mobile network switching caused socket reconnections that led to duplicate message delivery.',
        solution:
          'Implemented idempotent client message IDs and server-side deduplication tables with vector clocks.',
      },
    ],
    architecture: {
      title: 'Realtime Socket & WebRTC Signal Topology',
      description:
        'Bidirectional socket streaming, pub/sub broadcasting, and WebRTC signaling path.',
      nodes: [
        {
          id: 'client-a',
          label: 'Client A',
          sublabel: 'WebRTC Peer',
          type: 'client',
          technology: 'Socket Client / WebRTC',
          description: 'Sends messages and initiates video stream.',
        },
        {
          id: 'client-b',
          label: 'Client B',
          sublabel: 'WebRTC Peer',
          type: 'client',
          technology: 'Socket Client / WebRTC',
          description: 'Receives messages and joins video stream.',
        },
        {
          id: 'socket-node',
          label: 'Socket.io Gateway',
          sublabel: 'Node.js Cluster',
          type: 'service',
          technology: 'Node.js / Socket.io',
          description: 'Manages socket connections, heartbeat, and signaling.',
        },
        {
          id: 'redis-pubsub',
          label: 'Redis Pub/Sub',
          sublabel: 'Cluster Backplane',
          type: 'cache',
          technology: 'Redis',
          description: 'Broadcasts messages across horizontal gateway nodes.',
        },
        {
          id: 'mongo',
          label: 'Chat Message Store',
          sublabel: 'Document Store',
          type: 'database',
          technology: 'MongoDB',
          description: 'Stores message history, attachments, and reactions.',
        },
      ],
      flows: [
        { from: 'client-a', to: 'socket-node', label: '1. Send Message / SDP Signal', animated: true },
        { from: 'socket-node', to: 'redis-pubsub', label: '2. Cluster Pub/Sub', animated: true },
        { from: 'redis-pubsub', to: 'socket-node', label: '3. Relay to Node', animated: false },
        { from: 'socket-node', to: 'client-b', label: '4. Deliver Event', animated: true },
        { from: 'socket-node', to: 'mongo', label: '5. Async Persist', animated: false },
        { from: 'client-a', to: 'client-b', label: '6. Direct P2P Video Stream', animated: true },
      ],
    },
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/izharqadeer03', type: 'github' },
    ],
    stats: [
      { label: 'Connections', value: '50k+ Sockets' },
      { label: 'Latency', value: '<15ms' },
      { label: 'Media', value: 'WebRTC' },
    ],
  },
  {
    id: 'dekhbhal',
    name: 'DekhBhal',
    shortDescription: 'Realtime backend telemetry, service health monitoring & event alerting platform.',
    description:
      'A robust backend monitoring and alerting engine engineered to collect infrastructure metrics, service health pings, and realtime telemetry over WebSockets and REST APIs.',
    category: 'backend-realtime',
    categoryName: 'Backend & Realtime Systems',
    technologies: ['Node.js', 'PostgreSQL', 'WebSockets', 'Redis', 'Docker'],
    role: 'Backend Systems Engineer',
    duration: '4 Months',
    status: 'completed',
    featured: false,
    accent: 'violet',
    icon: 'server',
    overview: [
      'DekhBhal (meaning "Care & Vigilance") is an automated telemetry and uptime monitoring platform designed to keep constant watch over application endpoints, databases, and microservices.',
      'It collects diagnostic metrics, aggregates performance statistics in PostgreSQL, and instantly broadcasts alert threshold breaches to live dashboards via WebSockets.',
    ],
    problem:
      'Distributed microservices require active heartbeat checking and instant incident alerting to minimize service downtime without causing alert fatigue.',
    solution:
      'Built a low-overhead Node.js monitoring service with background worker pools, PostgreSQL time-series metric retention, and WebSockets live dashboard streaming.',
    myContribution: [
      'Architected the Node.js metric ingestion pipeline handling thousands of metric ticks per second.',
      'Designed PostgreSQL schema optimizations for high-frequency write workloads.',
      'Implemented customizable alert rules engine evaluating moving averages and failure thresholds.',
      'Created WebSocket channels delivering live health status updates to operator consoles.',
    ],
    highlights: [
      'Sub-second incident alerting upon HTTP endpoint or socket failure.',
      'Automated background health checks with configurable cron schedules.',
      'Lightweight footprint easily deployed via Docker containers.',
    ],
    challenges: [
      {
        title: 'High-Volume Time-Series Metric Ingestion',
        problem:
          'Writing every incoming telemetry tick directly to database disk threatened storage I/O limits.',
        solution:
          'Implemented batching buffers in Redis before performing bulk upserts into PostgreSQL at fixed intervals.',
      },
    ],
    architecture: {
      title: 'DekhBhal Metric Ingestion & Alert Flow',
      description:
        'Telemetry ingestion, Redis buffering, database persistence, and WebSocket alerting.',
      nodes: [
        {
          id: 'monitored-service',
          label: 'Target Microservices',
          sublabel: 'Monitored Assets',
          type: 'client',
          technology: 'HTTP / Sockets',
          description: 'Application services emitting health metrics.',
        },
        {
          id: 'ingestor',
          label: 'Telemetry Ingestor',
          sublabel: 'Node.js Collector',
          type: 'service',
          technology: 'Node.js',
          description: 'Receives metric payloads and performs health checks.',
        },
        {
          id: 'buffer',
          label: 'Metric Buffer',
          sublabel: 'In-Memory Queue',
          type: 'cache',
          technology: 'Redis',
          description: 'Buffers telemetry streams for batch processing.',
        },
        {
          id: 'postgres',
          label: 'Telemetry Store',
          sublabel: 'Time-Series DB',
          type: 'database',
          technology: 'PostgreSQL',
          description: 'Stores historical uptime metrics and incident logs.',
        },
        {
          id: 'dashboard',
          label: 'Operator Console',
          sublabel: 'Live Dashboard',
          type: 'client',
          technology: 'WebSockets UI',
          description: 'Displays live status and receives immediate failure alerts.',
        },
      ],
      flows: [
        { from: 'monitored-service', to: 'ingestor', label: '1. Health Metrics / Ping', animated: true },
        { from: 'ingestor', to: 'buffer', label: '2. Buffer Stream', animated: false },
        { from: 'buffer', to: 'postgres', label: '3. Bulk Insert', animated: false },
        { from: 'ingestor', to: 'dashboard', label: '4. Live Alert Stream', animated: true },
      ],
    },
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/izharqadeer03', type: 'github' },
    ],
    stats: [
      { label: 'Alert Time', value: '<1s' },
      { label: 'Stack', value: 'Node + Postgres' },
      { label: 'Protocol', value: 'WebSockets' },
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}

export function getProjectsByCategory(category: ProjectCategoryId | 'all' | 'featured'): Project[] {
  if (category === 'all') return PROJECTS;
  if (category === 'featured') return PROJECTS.filter((p) => p.featured);
  return PROJECTS.filter((p) => p.category === category);
}

export function searchProjects(query: string, category: string = 'all'): Project[] {
  const term = query.trim().toLowerCase();
  const list = category === 'all' ? PROJECTS : getProjectsByCategory(category as ProjectCategoryId);

  if (!term) return list;

  return list.filter((project) => {
    const nameMatch = project.name.toLowerCase().includes(term);
    const catMatch = project.categoryName.toLowerCase().includes(term);
    const techMatch = project.technologies.some((tech) => tech.toLowerCase().includes(term));
    const descMatch = project.description.toLowerCase().includes(term);
    const shortDescMatch = project.shortDescription.toLowerCase().includes(term);
    const roleMatch = project.role.toLowerCase().includes(term);

    return nameMatch || catMatch || techMatch || descMatch || shortDescMatch || roleMatch;
  });
}
