import { AgentRole, ComplianceRule, ProjectFile, SimulationPreset, TerminalLog } from '../types';

export const AGENT_ROLES: AgentRole[] = [
  {
    id: 'planner',
    name: 'Planner Agent',
    badge: 'Product & Spec Lead',
    role: 'Decomposes complex requirements into micro-tasks & data layers',
    avatarIcon: 'BrainCircuit',
    color: 'violet',
    description: 'Translates high-level natural language intent into an actionable DAG (Directed Acyclic Graph). Crucially mandates and provisions mockData.ts to eradicate the hollow app and empty canvas syndrome.',
    cognitiveFunction: 'Task Decomposition & Semantic Blueprinting',
    capabilities: [
      'Intent parsing into micro-specifications',
      'Mandatory mockData.ts data layer generation',
      'Execution route & dependency graph creation',
      'Context token optimization for downstream agents'
    ],
    sampleOutput: `Planner -> Created 7 execution sub-tasks
Generated data schema in types/schema.ts
Injected realistic mockData.ts (32 state entities)
Status: Blueprint dispatched to Nexus Architect`,
    metric: '100%',
    metricLabel: 'Zero-Hollow Guarantee'
  },
  {
    id: 'architect',
    name: 'Nexus Architect',
    badge: 'File System & AST',
    role: 'Virtual File System manager and dependency import supervisor',
    avatarIcon: 'Network',
    color: 'indigo',
    description: 'Scaffolds virtual file hierarchies, manages modular entry points (App.tsx), guarantees deterministic imports, and synchronizes state with the global SharedContext blackboard.',
    cognitiveFunction: 'VFS Topology & Topological Sorting',
    capabilities: [
      'Dynamic in-memory Virtual File System (VFS)',
      'Circular dependency detection & elimination',
      'Modular export/import graph reconciliation',
      'LangGraph state synchronization'
    ],
    sampleOutput: `Nexus Architect -> Initialized VFS hierarchy
Scaffolded /src/components/TaskBoard.tsx
Scaffolded /src/types/designSystem.ts
Verified 0 orphan imports across 14 components`,
    metric: '< 4ms',
    metricLabel: 'VFS Mount Latency'
  },
  {
    id: 'coder',
    name: 'Spark Coder',
    badge: 'Senior Full-Stack Engineer',
    role: 'Zero-lazy, modular TypeScript, Next.js, and Python generation',
    avatarIcon: 'Code2',
    color: 'cyan',
    description: 'Generates complete, production-grade code adhering strictly to the theme.json design tokens. Never outputs placeholders or lazy comments; implements full interactive state machines.',
    cognitiveFunction: 'AST Code Synthesis & Design Token Injection',
    capabilities: [
      'Strict adherence to theme.json design token contract',
      'Zero lazy coding policy (100% full file completions)',
      'React 19 / Next.js App Router & PySpark DLT pipelines',
      'Type-safe props with zero any casting'
    ],
    sampleOutput: `Spark Coder -> Writing /src/components/MetricCard.tsx
Injected design tokens: bg-zinc-950, text-violet-400
Implemented full Framer Motion transition hooks
File write complete: 184 lines generated`,
    metric: '100%',
    metricLabel: 'Full-Code Completion'
  },
  {
    id: 'auditor',
    name: 'Automated Auditor',
    badge: 'Security & Quality Sentinel',
    role: 'Static AST analysis, OWASP Top 10 for GenAI, and dependency pinning',
    avatarIcon: 'ShieldCheck',
    color: 'emerald',
    description: 'Runs real-time linting, static code analysis, and CVE checks. Prevents dependency hallucination (a known risk in 21% of legacy LLM outputs) and verifies WCAG AA accessibility.',
    cognitiveFunction: 'Semantic AST Static Analysis & CVE Verification',
    capabilities: [
      'Hallucinated npm dependency detection & blocking',
      'OWASP GenAI Top 10 threat mitigation',
      'WCAG AA contrast & focus-visible audit',
      'Memory leak and unmemoized handler inspection'
    ],
    sampleOutput: `Auditor -> AST analysis complete
Scanned 42 imported packages against CVE database
Found 0 hallucinated dependencies
Accessibility check: 100% WCAG AA compliant`,
    metric: '0 CVE',
    metricLabel: 'Vulnerabilities'
  },
  {
    id: 'patcher',
    name: 'The Patcher (Medic)',
    badge: 'Closed-Loop Self-Healing',
    role: 'Surgically repairs compiler stderr & build errors automatically',
    avatarIcon: 'Wrench',
    color: 'amber',
    description: 'Activated on compiler failure (exit_code !== 0). Parses compiler stderr, isolates AST divergence, and applies surgical targeted diffs via executeEdits() in <120ms without human intervention.',
    cognitiveFunction: 'Autonomous Root-Cause Analysis & Surgical Patching',
    capabilities: [
      'Direct interception of WebContainers stderr streams',
      'Monaco executeEdits() preservation of undo history',
      '3-iteration max recursion safety circuit breaker',
      'Self-healing named import mismatches & syntax slips'
    ],
    sampleOutput: `Patcher -> Intercepted stderr: 'Named export Button not found in ./ui'
Isolating component divergence...
Applied diff: import { Button } -> import { ActionButton }
Re-running test suite... Build succeeded (exit 0)`,
    metric: '98.4%',
    metricLabel: 'Auto-Healing Rate'
  },
  {
    id: 'sandbox',
    name: 'Isolated Sandbox',
    badge: 'WebContainers & Wasm',
    role: 'Hermetic in-browser Node.js execution with sub-5ms feedback',
    avatarIcon: 'Cpu',
    color: 'rose',
    description: 'Runs an authentic Node.js micro-OS directly inside browser WebAssembly with virtualized TCP networking. Zero server compute costs, zero telemetry leakage, and instant HMR live reload.',
    cognitiveFunction: 'Hermetic WebAssembly Micro-Kernel Virtualization',
    capabilities: [
      'Native in-browser npm install & node runtime',
      'Sub-5ms Hot Module Reload (HMR) cycle',
      'Zero cloud VM cost & zero server-side data egress',
      'Air-gapped and offline capable operation'
    ],
    sampleOutput: `Sandbox -> WebContainer mounted at /workspace
Virtual TCP ServiceWorker proxy active on port 3000
HMR update acknowledged in 3.4ms
Zero network roundtrip to external cloud`,
    metric: '< 5ms',
    metricLabel: 'Execution Latency'
  }
];

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: 'crypto-bot',
    title: 'Crypto Arbitrage Sentinel',
    description: 'High-frequency DEX/CEX arbitrage monitor with visual order book & WebSockets',
    category: 'FinTech / High-Throughput',
    prompt: 'Build a dark-mode real-time crypto arbitrage monitor with live order books, latency graphs, and automated trigger rules.',
    filesGenerated: 8,
    linesOfCode: 1240,
    selfHealCount: 1,
    initialError: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'lucide-react/dist/esm/icons/chart-bar'`,
    patchSolution: `Patcher redirected named import to standard 'lucide-react' barrel export. Resolved in 82ms.`
  },
  {
    id: 'saas-billing',
    title: 'Enterprise Billing & Invoicing',
    description: 'Stripe webhook listener, multi-tier seat calculator, and PDF invoice generator',
    category: 'B2B SaaS / FinOps',
    prompt: 'Create an enterprise subscription tier configurator with usage-based billing slider and audit log table.',
    filesGenerated: 11,
    linesOfCode: 1890,
    selfHealCount: 0
  },
  {
    id: 'eu-compliance',
    title: 'EU AI Act Compliance Engine',
    description: 'Continuous risk tiering (Art 14 Human Oversight) with automated transparency reports',
    category: 'LegalTech & GovTech',
    prompt: 'Implement an EU Digital Compliance Playground that scans AI pipelines for Article 14 human oversight and data residency.',
    filesGenerated: 9,
    linesOfCode: 1420,
    selfHealCount: 2,
    initialError: `SyntaxError: Unexpected token 'export' in commonjs wrapper`,
    patchSolution: `Patcher updated tsconfig.json moduleResolution to 'bundler' and verified strict mode. Resolved in 110ms.`
  },
  {
    id: 'slovak-copilot',
    title: 'RMD26 Slovak Copilot Portal',
    description: 'Context-aware Slovak administrative & technical AI assistant with SK-NIC grant integration',
    category: 'Sovereign AI / Localized',
    prompt: 'Build a multi-agent portal for Slovak administrative automation, EU tender discovery, and document drafting.',
    filesGenerated: 14,
    linesOfCode: 2310,
    selfHealCount: 1,
    initialError: `TypeError: Cannot read properties of undefined (reading 'slovakGrammar')`,
    patchSolution: `Patcher injected null-safety fallback and populated mockData.ts with regional dictionary entries.`
  }
];

export const INITIAL_TERMINAL_LOGS: TerminalLog[] = [
  {
    id: 'log-1',
    timestamp: '00:00.12',
    agent: 'Planner',
    level: 'info',
    message: 'Analyzing user prompt: "Build modern task orchestration platform with real-time telemetry"'
  },
  {
    id: 'log-2',
    timestamp: '00:00.38',
    agent: 'Planner',
    level: 'success',
    message: 'Generated DAG with 4 stages. Populated mockData.ts with 24 sample records to prevent hollow UI.'
  },
  {
    id: 'log-3',
    timestamp: '00:00.82',
    agent: 'Architect',
    level: 'info',
    message: 'Mounting virtual file system /workspace/src. Scaffolded 8 components and theme.json token layer.'
  },
  {
    id: 'log-4',
    timestamp: '00:01.45',
    agent: 'Coder',
    level: 'code',
    message: 'Compiling App.tsx and DashboardView.tsx adhering to strict theme.json tokens (Zinc-950 + Violet-500).'
  },
  {
    id: 'log-5',
    timestamp: '00:02.10',
    agent: 'Reviewer',
    level: 'warn',
    message: 'AST check identified unpinned dependency: @types/node. Pinned to ^22.14.0 to guarantee reproducible build.'
  },
  {
    id: 'log-6',
    timestamp: '00:02.72',
    agent: 'Patcher',
    level: 'patch',
    message: 'Intercepted named import mismatch in NavHeader.tsx. Surgical AST patch applied. 0 regressions.'
  },
  {
    id: 'log-7',
    timestamp: '00:03.15',
    agent: 'Sandbox',
    level: 'success',
    message: 'WebContainer build executed: 0 vulnerabilities found, bundle size 42.8kB gzip. Port 3000 online in 3.8ms.'
  }
];

export const SAMPLE_PROJECT_FILES: ProjectFile[] = [
  {
    name: 'App.tsx',
    path: '/src/App.tsx',
    language: 'typescript',
    iconType: 'react',
    description: 'Root application entry point with multi-agent state subscriber and reactive layout',
    content: `import React, { useState, useEffect } from 'react';
import { useSharedContext } from './hooks/useSharedContext';
import { AgentOrchestrator } from './components/AgentOrchestrator';
import { LivePreview } from './components/LivePreview';
import { TerminalStream } from './components/TerminalStream';
import theme from './theme.json';

export default function App() {
  const { agents, status, activeTask, errorCount } = useSharedContext();
  const [activeTab, setActiveTab] = useState<'preview' | 'terminal' | 'audit'>('preview');

  return (
    <div className={\`min-h-screen \${theme.colors.background} \${theme.colors.foreground}\`}>
      <header className="border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-sm tracking-wide">SOVEREIGN // ENGINE v2.4</span>
        </div>
        <span className="text-xs text-zinc-400 font-mono">Errors Auto-Healed: {errorCount}</span>
      </header>

      <main className="grid grid-cols-12 gap-4 p-6">
        <aside className="col-span-4 border border-zinc-800/80 rounded-xl p-4 bg-zinc-900/40">
          <AgentOrchestrator agents={agents} activeTask={activeTask} />
        </aside>
        <section className="col-span-8 border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-900/20">
          <LivePreview tab={activeTab} onTabChange={setActiveTab} />
        </section>
      </main>
    </div>
  );
}`
  },
  {
    name: 'theme.json',
    path: '/src/theme.json',
    language: 'json',
    iconType: 'json',
    description: 'Strict design token contract enforced on all code generation agents',
    content: `{
  "metadata": {
    "appName": "Sovereign Architect Pro",
    "styleVibe": "Dark Cyberpunk Minimalist",
    "version": "2.4.0"
  },
  "colors": {
    "background": "bg-[#09090b]",
    "foreground": "text-zinc-100",
    "primary": "bg-violet-600 hover:bg-violet-500",
    "primaryForeground": "text-white",
    "secondary": "bg-zinc-900 text-zinc-200 border-zinc-800",
    "accent": "text-cyan-400 border-cyan-500/30",
    "muted": "text-zinc-400",
    "border": "border-zinc-800/80"
  },
  "layout": {
    "radius": "rounded-xl",
    "spacing": "p-6",
    "container": "max-w-7xl mx-auto"
  },
  "typography": {
    "fontSans": "font-sans",
    "fontMono": "font-mono",
    "h1": "text-4xl font-extrabold tracking-tight",
    "h2": "text-2xl font-bold tracking-tight",
    "body": "text-sm text-zinc-400 leading-relaxed"
  },
  "components": {
    "button": "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
    "card": "rounded-xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-xl shadow-lg",
    "input": "flex h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-sm text-zinc-100 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
  }
}`
  },
  {
    name: 'mockData.ts',
    path: '/src/data/mockData.ts',
    language: 'typescript',
    iconType: 'react',
    description: 'Mandatory data layer synthesized by Planner Agent to prevent hollow UI state',
    content: `// Mandated by Planner Agent: Prevents empty state and hollow application syndrome
export interface MetricEntry {
  id: string;
  name: string;
  value: string;
  delta: string;
  status: 'optimal' | 'warning' | 'critical';
}

export const SYSTEM_METRICS: MetricEntry[] = [
  { id: 'm1', name: 'WebContainer Wasm Latency', value: '3.8ms', delta: '-12%', status: 'optimal' },
  { id: 'm2', name: 'Compiler Loop Frequency', value: '240 ops/s', delta: '+34%', status: 'optimal' },
  { id: 'm3', name: 'Patcher Autonomous Intercepts', value: '18 fixes', delta: '100% healed', status: 'optimal' },
  { id: 'm4', name: 'EU AI Act Article 14 Compliance', value: 'Level 4 Certified', delta: 'Audited', status: 'optimal' }
];

export const ACTIVE_TASKS = [
  { id: 'tsk-1', title: 'Verify AST Token Stream', assignee: 'Nexus Architect', progress: 100 },
  { id: 'tsk-2', title: 'Generate Responsive Card Grid', assignee: 'Spark Coder', progress: 85 },
  { id: 'tsk-3', title: 'Run OWASP GenAI Static Audit', assignee: 'Sentinel Reviewer', progress: 92 }
];`
  },
  {
    name: 'dlt_pipeline.py',
    path: '/src/pipelines/dlt_pipeline.py',
    language: 'python',
    iconType: 'python',
    description: 'Databricks Medallion Streaming pipeline (Bronze, Silver, Gold) with automated quality rules',
    content: `# Databricks Delta Live Tables (DLT) Streaming Medallion Pipeline
import dlt
from pyspark.sql.functions import col, from_json, current_timestamp

# Bronze Layer: Ingest raw agent event telemetry
@dlt.table(
    comment="Raw streaming agent execution logs with full fidelity"
)
def bronze_agent_logs():
    return (
        spark.readStream.format("cloudFiles")
        .option("cloudFiles.format", "json")
        .load("/mnt/agentic/raw_events")
    )

# Silver Layer: Conformed, deduplicated, and security-validated
@dlt.table(
    comment="Sanitized agent decisions with schema validation"
)
@dlt.expect_or_drop("valid_agent_id", "agent_id IS NOT NULL")
@dlt.expect_or_drop("no_vulnerabilities", "cve_flag == false")
def silver_agent_decisions():
    return (
        dlt.read_stream("bronze_agent_logs")
        .filter(col("status") == "EXECUTED")
        .dropDuplicatesWithinWatermark(["session_id", "execution_id"], "1 hour")
    )

# Gold Layer: Aggregated compliance & throughput metrics
@dlt.table(
    comment="Executive summary of self-healing rates and latency"
)
def gold_platform_metrics():
    return (
        dlt.read("silver_agent_decisions")
        .groupBy("date", "agent_type")
        .agg({"execution_latency_ms": "avg", "self_heal_count": "sum"})
    )`
  }
];

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'eu-act-art-14',
    standard: 'EU AI Act',
    article: 'Article 14',
    title: 'Human Oversight & Override Capability',
    status: 'Certified',
    description: 'High-risk AI systems must be designed to enable natural persons to oversee operation, detect automation bias, and intervene or halt operations at any micro-step.',
    evidence: 'Interactive approval gates configured before any production code deploy or container egress.'
  },
  {
    id: 'eu-act-art-10',
    standard: 'EU AI Act',
    article: 'Article 10',
    title: 'Data Governance & Bias Mitigation',
    status: 'Compliant',
    description: 'Training and validation datasets must undergo statistical validation, provenance verification, and protection against synthetic data contamination.',
    evidence: 'Pre-seeded synthetic data generated locally via strict schema constraints; no unverified third-party scraping.'
  },
  {
    id: 'owasp-genai-01',
    standard: 'OWASP GenAI',
    article: 'LLM-01',
    title: 'Prompt Injection & AST Boundary Enforcement',
    status: 'Enforced',
    description: 'Rigorous sandboxing preventing prompt injections from modifying compiler rules, file system permissions, or secret environment variables.',
    evidence: 'Context boundaries isolated in WebContainers; prompts strictly typed via SharedContext JSON interface.'
  },
  {
    id: 'data-residency',
    standard: 'GDPR / Sovereign AI',
    article: 'Chapter V',
    title: 'Local-First Execution & Data Localization',
    status: 'Enforced',
    description: 'Customer proprietary source code never leaves the client browser sandbox unless explicitly synced to self-hosted private git remotes.',
    evidence: 'Execution powered by WebContainers Wasm runtime on localhost; zero server-side compilation telemetry.'
  }
];
