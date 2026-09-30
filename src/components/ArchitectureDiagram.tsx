import React, { useState } from 'react';
import { ArrowRight, RotateCcw, AlertTriangle, CheckCircle2, Shield, Layers, Cpu, Code2, Wrench } from 'lucide-react';
import containerAsset from '../assets/images/sandbox_container_cube_1790742921146.jpg';

export const ArchitectureDiagram: React.FC = () => {
  const [activeCycleIndex, setActiveCycleIndex] = useState(0);

  const loopStages = [
    {
      title: '1. Generate',
      subtitle: 'Spec-Driven Synthesis',
      agent: 'Planner & Coder',
      description: 'Planner constructs DAG and seeds mockData.ts; Coder produces modular TypeScript code bound to theme.json design tokens.',
      metric: '100% Modular'
    },
    {
      title: '2. Execute',
      subtitle: 'In-Browser Runtime',
      agent: 'Isolated Sandbox (Wasm)',
      description: 'WebContainers execute code natively in browser memory. ServiceWorker virtualizes TCP on localhost:3000 with sub-5ms latency.',
      metric: '< 5ms Latency'
    },
    {
      title: '3. Validate',
      subtitle: 'AST Static & Error Sniffer',
      agent: 'Compiler & Reviewer',
      description: 'Compiler runs npm run build in background. Captures exit codes and parses any stderr divergence or OWASP vulnerabilities.',
      metric: '0 Vulnerabilities'
    },
    {
      title: '4. Heal',
      subtitle: 'Closed-Loop Self-Healing',
      agent: 'The Patcher (The Medic)',
      description: 'If exit_code !== 0, Patcher isolates AST divergence from stderr and applies targeted surgical patches in <120ms without breaking undo history.',
      metric: '98.4% Auto-Fix'
    }
  ];

  return (
    <section id="architecture" className="py-24 relative bg-zinc-950/80 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>PARADIGM SHIFT: INTENT OVER SYNTAX</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            From Open-Loop to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
              Closed-Loop Self-Healing
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Legacy AI assistants fire code into the void and leave human engineers to manually debug compilation failures. Sovereign Architect operates an autonomous closed feedback loop that tests, catches, and heals its own code before you ever see it.
          </p>
        </div>

        {/* Comparison: Open Loop vs. Closed Loop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Legacy Open Loop Card */}
          <div className="rounded-2xl border border-rose-950/50 bg-rose-950/10 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-900/40 text-rose-300 border border-rose-800">
                  LEGACY AI CODING ASSISTANTS
                </span>
                <span className="text-xs text-rose-400 font-mono">Open-Loop Architecture</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                &ldquo;Firing Code Into the Void&rdquo;
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Current tools generate raw text without knowing if it compiles, runs, or adheres to dependencies. The human developer carries the entire cognitive burden of debugging, refactoring, and fixing hallucinated packages.
              </p>
              <div className="space-y-3 text-xs font-mono text-zinc-400">
                <div className="p-3 rounded-lg bg-zinc-950/80 border border-rose-900/30 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>50% of AI snippets contain bugs or CVEs (Georgetown CSET)</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/80 border border-rose-900/30 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>21% of imported dependencies hallucinated (arXiv 2025)</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/80 border border-rose-900/30 flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Cloud VM lag: &gt;50ms network roundtrips &amp; high compute bills</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-rose-900/40 text-xs font-mono text-rose-400">
              Result: High cognitive fatigue &amp; hollow applications
            </div>
          </div>

          {/* Sovereign Architect Closed-Loop Card */}
          <div className="rounded-2xl border border-violet-500/40 bg-violet-950/15 p-8 flex flex-col justify-between shadow-2xl shadow-violet-950/40">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-900/50 text-violet-200 border border-violet-600/60 font-semibold">
                  SOVEREIGN ARCHITECT PRO
                </span>
                <span className="text-xs text-cyan-400 font-mono">Closed-Loop Self-Healing</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Autonomous Verification &amp; Surgical Healing
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                Specialized agents run in a cyclic state graph (LangGraph) backed by in-browser WebContainers. If an error occurs during virtual build, the Patcher Agent captures stderr and repairs the source file instantly.
              </p>
              <div className="space-y-3 text-xs font-mono text-zinc-300">
                <div className="p-3 rounded-lg bg-zinc-950/80 border border-violet-800/40 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Continuous closed loop: Generate ➔ Execute ➔ Validate ➔ Heal</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/80 border border-violet-800/40 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Local WebContainers Wasm runtime: sub-5ms feedback, zero cloud VM fees</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950/80 border border-violet-800/40 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Strict theme.json token injection eliminates messy, broken layouts</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-violet-800/40 text-xs font-mono text-emerald-400">
              Result: Production-ready code delivered in seconds
            </div>
          </div>
        </div>

        {/* Interactive 4-Stage Cyclical Flow Visualizer */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 backdrop-blur-xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 mb-8 gap-4">
            <div>
              <span className="text-xs font-mono text-violet-400">STATE MACHINE ARCHITECTURE</span>
              <h3 className="text-2xl font-bold text-white mt-1">The 4 Core Execution Loops</h3>
            </div>
            <div className="flex items-center gap-2">
              {loopStages.map((stage, idx) => (
                <button
                  key={stage.title}
                  onClick={() => setActiveCycleIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeCycleIndex === idx
                      ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-900/40'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  Stage {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loopStages.map((stage, idx) => {
              const isSelected = activeCycleIndex === idx;
              return (
                <div
                  key={stage.title}
                  onClick={() => setActiveCycleIndex(idx)}
                  className={`cursor-pointer rounded-xl p-5 border transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-xl shadow-cyan-950/30'
                      : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {stage.agent}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{stage.metric}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{stage.title}</h4>
                  <div className="text-xs font-mono text-zinc-400 mb-3">{stage.subtitle}</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{stage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
