import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Compass, 
  Calendar, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Globe, 
  GitBranch, 
  Terminal,
  Zap,
  Check,
  Filter
} from 'lucide-react';

export type MilestoneStatus = 'all' | 'completed' | 'in_progress' | 'upcoming';
export type MilestoneTrack = 'all' | 'Core Agentic Engine' | 'Slovak Copilot & SK-NIC' | 'Security & EU AI Act' | 'Enterprise & Cloud';

export interface MilestoneDeliverable {
  label: string;
  done: boolean;
}

export interface RoadmapMilestone {
  id: string;
  phase: string;
  quarter: string;
  year: string;
  title: string;
  track: 'Core Agentic Engine' | 'Slovak Copilot & SK-NIC' | 'Security & EU AI Act' | 'Enterprise & Cloud';
  status: 'completed' | 'in_progress' | 'upcoming';
  summary: string;
  deliverables: MilestoneDeliverable[];
  tags: string[];
  metrics?: { label: string; value: string };
  grantRelevance?: string;
}

const ROADMAP_DATA: RoadmapMilestone[] = [
  {
    id: 'phase-1',
    phase: 'Phase 01',
    quarter: 'Q1 – Q2',
    year: '2026',
    title: 'Multi-Agent Architecture & Deterministic VFS',
    track: 'Core Agentic Engine',
    status: 'completed',
    summary: 'Decomposition of single-prompt monolithic code generation into specialized micro-agents with mandatory mockData.ts seed contracts and zero hollow-UI failures.',
    deliverables: [
      { label: 'LangGraph DAG state engine with SharedContext blackboard', done: true },
      { label: 'Mandatory mockData.ts seed contract to eliminate empty canvas errors', done: true },
      { label: 'In-memory Virtual File System (VFS) with sub-4ms mount speed', done: true },
      { label: 'Strict theme.json design token contract enforcement across components', done: true }
    ],
    tags: ['LangGraph', 'VFS', 'TypeScript', 'AST Parser'],
    metrics: { label: 'Empty Canvas Invariant', value: '100% Eliminated' }
  },
  {
    id: 'phase-2',
    phase: 'Phase 02',
    quarter: 'Q3',
    year: '2026',
    title: 'Closed-Loop Self-Healing & Client Wasm Sandbox',
    track: 'Security & EU AI Act',
    status: 'completed',
    summary: 'Introduction of "The Medic" Patcher Agent with surgical AST diffs and client-side WebContainers for air-gapped code compilation without cloud VM fees.',
    deliverables: [
      { label: 'Patcher Agent (The Medic) with AST diffs via executeEdits()', done: true },
      { label: 'Client-side WebContainers (Wasm micro-kernel) execution on localhost:3000', done: true },
      { label: 'Real-time progressive log streaming with authentic AI typing animation', done: true },
      { label: 'Article 14 Human Oversight kill switch & committal gate', done: true }
    ],
    tags: ['WebContainers', 'Wasm', 'The Medic', 'EU AI Act Art 14'],
    metrics: { label: 'Patcher Healing Speed', value: '<92ms' }
  },
  {
    id: 'phase-3',
    phase: 'Phase 03',
    quarter: 'Q4',
    year: '2026',
    title: 'Slovak Copilot & SK-NIC Grant Track',
    track: 'Slovak Copilot & SK-NIC',
    status: 'in_progress',
    summary: 'Specialization for the Slovak public administration, SK-NIC innovation ecosystem, and local regulatory verification with autonomous administrative workflows.',
    deliverables: [
      { label: 'SK-NIC Fund Track onboarding (Call SKNICVP26_017, Budget €17,580.03)', done: true },
      { label: 'Specialized Slovak legal & tax validation (IČ DPH, Finančná správa SR, SK-NIC)', done: true },
      { label: 'Autonomous grant proposal drafting & tender discovery engine', done: false },
      { label: 'Live Slovak domain (.SK) registry integration and regional compliance auditing', done: false }
    ],
    tags: ['SK-NIC', 'Slovakia', 'Grant Track', 'Public Administration'],
    metrics: { label: 'SK Domain Alignment', value: 'SKNICVP26_017' },
    grantRelevance: 'SK-NIC Grant Track: 1.8.2026 – 31.12.2026'
  },
  {
    id: 'phase-4',
    phase: 'Phase 04',
    quarter: 'Q1 – Q2',
    year: '2027',
    title: 'Sovereign Multi-Cluster & AST Dependency Firewall',
    track: 'Enterprise & Cloud',
    status: 'upcoming',
    summary: 'Enterprise-grade air-gapped deployments, distributed multi-repo refactoring, and automated OWASP dependency firewalls preventing hallucinated CVEs.',
    deliverables: [
      { label: 'OWASP Top 10 for GenAI real-time AST dependency interception firewall', done: false },
      { label: 'Distributed multi-agent swarms with cross-repository refactoring', done: false },
      { label: 'On-premise air-gapped Kubernetes & sovereign European cloud deployment', done: false },
      { label: 'Automated EU AI Act CE Mark conformity certification ledger generator', done: false }
    ],
    tags: ['Kubernetes', 'OWASP GenAI', 'Air-Gapped', 'Multi-Repo'],
    metrics: { label: 'Cloud VM Egress', value: '0 Bytes (Sovereign)' }
  },
  {
    id: 'phase-5',
    phase: 'Phase 05',
    quarter: 'Q3 – Q4',
    year: '2027',
    title: 'Autonomous Production GitOps & Multi-Model Swarms',
    track: 'Core Agentic Engine',
    status: 'upcoming',
    summary: 'Fully autonomous pull request synthesis, dynamic multi-model routing, and cryptographic zero-knowledge execution proofs for industrial critical infrastructure.',
    deliverables: [
      { label: 'Autonomous Pull Request Synthesizer with closed-loop CI/CD verification', done: false },
      { label: 'Dynamic multi-model routing (Claude 3.7 Sonnet, Gemini 2.0 Flash, DeepSeek-R1)', done: false },
      { label: 'Zero-Knowledge cryptographic execution proofs for high-risk industrial AI', done: false },
      { label: 'Self-evolving architectural patterns based on empirical performance telemetry', done: false }
    ],
    tags: ['GitOps', 'Multi-Model', 'ZK-Proofs', 'Autonomous CI/CD'],
    metrics: { label: 'Development Velocity', value: '10x Speedup' }
  }
];

interface RoadmapProps {
  onOpenConsole?: () => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({ onOpenConsole }) => {
  const [statusFilter, setStatusFilter] = useState<MilestoneStatus>('all');
  const [trackFilter, setTrackFilter] = useState<MilestoneTrack>('all');

  const filteredMilestones = ROADMAP_DATA.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesTrack = trackFilter === 'all' || item.track === trackFilter;
    return matchesStatus && matchesTrack;
  });

  const completedCount = ROADMAP_DATA.filter((m) => m.status === 'completed').length;
  const inProgressCount = ROADMAP_DATA.filter((m) => m.status === 'in_progress').length;
  const upcomingCount = ROADMAP_DATA.filter((m) => m.status === 'upcoming').length;
  const totalCount = ROADMAP_DATA.length;
  const overallProgressPercent = Math.round(((completedCount + inProgressCount * 0.5) / totalCount) * 100);

  return (
    <section id="roadmap" className="py-16 sm:py-24 relative bg-zinc-950 border-t border-zinc-800/80 overflow-hidden w-full">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] max-w-full h-[400px] bg-violet-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 mb-3 shadow-inner">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEVELOPMENT TIMELINE &amp; ARCHITECTURAL HORIZON</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            RMD26 Sovereign Engineering{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400">
              Roadmap
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            From the initial multi-agent blackboard paradigm to closed-loop self-healing, the SK-NIC Slovak Copilot initiative, and autonomous sovereign enterprise GitOps.
          </p>
        </div>

        {/* High-Level Roadmap Status KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 font-mono">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">OVERALL COMPLETION</div>
            <div className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">{overallProgressPercent}%</span>
              <span className="text-xs text-zinc-400 font-normal">({completedCount}/{totalCount} phases)</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500" 
                style={{ width: `${overallProgressPercent}%` }} 
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">CURRENT SPRINT</div>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400 flex items-center gap-2">
              <span>Phase 03</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div className="text-xs text-zinc-400 mt-2 truncate">SK-NIC Slovak Copilot (Q4 2026)</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">VERIFICATION REGIME</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400">EU AI Act</div>
            <div className="text-xs text-zinc-400 mt-2">Article 14 Human Oversight</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-1">GRANT TRACK STATUS</div>
            <div className="text-xl sm:text-2xl font-bold text-violet-300 truncate">SKNICVP26_017</div>
            <div className="text-xs text-zinc-400 mt-2">Fund Allocation: €17,580.03</div>
          </div>
        </div>

        {/* Interactive Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 mb-12 font-mono text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-zinc-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'completed'
                  ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold'
                  : 'text-zinc-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Completed ({completedCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'in_progress'
                  ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold'
                  : 'text-zinc-400 hover:text-cyan-400'
              }`}
            >
              <Clock className="w-3 h-3 text-cyan-400 animate-spin" />
              <span>In Progress ({inProgressCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                statusFilter === 'upcoming'
                  ? 'bg-violet-950/70 border border-violet-500/50 text-violet-300 font-bold'
                  : 'text-zinc-400 hover:text-violet-400'
              }`}
            >
              <Compass className="w-3 h-3 text-violet-400" />
              <span>Upcoming ({upcomingCount})</span>
            </button>
          </div>

          {/* Track Filter */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px]">Track:</span>
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value as MilestoneTrack)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="all">All Tracks</option>
              <option value="Core Agentic Engine">Core Agentic Engine</option>
              <option value="Slovak Copilot & SK-NIC">Slovak Copilot &amp; SK-NIC</option>
              <option value="Security & EU AI Act">Security &amp; EU AI Act</option>
              <option value="Enterprise & Cloud">Enterprise &amp; Cloud</option>
            </select>
          </div>
        </div>

        {/* Timeline Stream Visualizer */}
        <div className="relative">
          {/* Vertical central timeline spine (desktop) */}
          <div className="hidden md:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-400 via-violet-500 to-zinc-800" />

          {/* Milestone Cards Stream */}
          <div className="space-y-8">
            {filteredMilestones.map((milestone) => {
              const isCompleted = milestone.status === 'completed';
              const isInProgress = milestone.status === 'in_progress';
              const isUpcoming = milestone.status === 'upcoming';

              return (
                <div
                  key={milestone.id}
                  className={`relative md:pl-20 transition-all duration-300 ${
                    isInProgress ? 'scale-[1.01]' : ''
                  }`}
                >
                  {/* Timeline Node Indicator on the spine */}
                  <div className="hidden md:flex absolute left-4 top-8 -translate-x-1/2 w-8 h-8 rounded-full items-center justify-center border-2 z-10 bg-zinc-950 transition-all">
                    {isCompleted && (
                      <div className="w-full h-full rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    {isInProgress && (
                      <div className="w-full h-full rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/50">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="w-full h-full rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500">
                        <Compass className="w-4 h-4 text-zinc-400" />
                      </div>
                    )}
                  </div>

                  {/* Main Milestone Card */}
                  <div
                    className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
                      isInProgress
                        ? 'bg-gradient-to-r from-zinc-900/90 via-cyan-950/20 to-zinc-900/90 border-cyan-500/50 shadow-2xl shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                        : isCompleted
                        ? 'bg-zinc-900/40 border-zinc-800/90 hover:border-zinc-700'
                        : 'bg-zinc-950/60 border-zinc-800/60 opacity-90 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    {/* Top Meta Line: Phase Badge, Quarter, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs font-bold text-violet-400">
                          {milestone.phase}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{milestone.quarter} {milestone.year}</span>
                        </div>
                        <span className="text-zinc-600">·</span>
                        <span className="text-xs font-mono text-zinc-400">{milestone.track}</span>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>COMPLETED</span>
                          </span>
                        )}
                        {isInProgress && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold shadow-sm shadow-cyan-500/30">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span>CURRENT SPRINT</span>
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 font-mono text-xs">
                            <Compass className="w-3.5 h-3.5 text-zinc-500" />
                            <span>PLANNED HORIZON</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Milestone Title & Summary */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-3xl">
                      {milestone.summary}
                    </p>

                    {/* Deliverables Checklist Grid */}
                    <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 mb-6 font-mono text-xs space-y-2.5">
                      <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-2 flex items-center justify-between">
                        <span>ENGINEERING DELIVERABLES</span>
                        <span>
                          {milestone.deliverables.filter((d) => d.done).length} / {milestone.deliverables.length} VERIFIED
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {milestone.deliverables.map((del, dIdx) => (
                          <div
                            key={dIdx}
                            className={`flex items-start gap-2.5 p-2 rounded-lg transition-colors ${
                              del.done
                                ? 'bg-zinc-900/60 text-zinc-200'
                                : 'bg-zinc-900/20 text-zinc-400'
                            }`}
                          >
                            <span className="mt-0.5 shrink-0">
                              {del.done ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border border-zinc-700 inline-block" />
                              )}
                            </span>
                            <span className={del.done ? 'line-through text-zinc-400' : 'text-zinc-300'}>
                              {del.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Row: Tags, Metrics & Grant Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
                      {/* Tech Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                        {milestone.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Special Metrics or Grant Badge */}
                      <div className="flex items-center gap-3 font-mono text-xs">
                        {milestone.metrics && (
                          <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                            <span className="text-zinc-500">{milestone.metrics.label}:</span>
                            <span className="font-bold text-cyan-400">{milestone.metrics.value}</span>
                          </div>
                        )}
                        {milestone.grantRelevance && (
                          <div className="px-3 py-1 rounded-lg bg-violet-950/50 border border-violet-500/40 text-violet-300 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-violet-400" />
                            <span>{milestone.grantRelevance}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Roadmap Action Callout */}
        <div className="mt-16 p-8 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white font-mono">
              Participate in Phase 03: Slovak Copilot Sandbox Pilot
            </h4>
            <p className="text-sm text-zinc-400 max-w-xl">
              Are you an enterprise engineering lead or public sector administrator in Slovakia or the EU? Test early access builds of our autonomous agent pipelines today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenConsole && (
              <button
                onClick={onOpenConsole}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold font-mono text-xs shadow-lg shadow-violet-950/40 transition-all flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Agent Console</span>
              </button>
            )}
            <a
              href="mailto:rm26@rmd26.com?subject=RMD26%20Roadmap%20Inquiry%20Phase%2003"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-mono text-xs transition-colors flex items-center gap-2"
            >
              <span>Contact Architecture Office</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
