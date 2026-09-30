import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Play, RotateCcw, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Layers, Sparkles, Cpu } from 'lucide-react';
import heroAsset from '../assets/images/hero_agentic_core_1790742910137.jpg';

interface HeroProps {
  onExploreDemo: () => void;
  onOpenDocs: () => void;
  onOpenConsole: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreDemo, onOpenDocs, onOpenConsole }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState('Next.js Real-time Dashboard with WebContainers');

  const agentSteps = [
    {
      agent: 'Planner',
      badge: 'TASK DECOMPOSITION',
      color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
      action: 'Decomposed intent into 4 sub-modules · Injected mockData.ts (zero-hollow UI guarantee)',
      status: 'DONE',
      time: '+180ms'
    },
    {
      agent: 'Coder',
      badge: 'MODULAR SYNTHESIS',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      action: 'Generating /src/App.tsx with theme.json design tokens (Zinc-950 + Violet-500 accents)',
      status: 'DONE',
      time: '+420ms'
    },
    {
      agent: 'Reviewer',
      badge: 'SECURITY AUDIT',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      action: 'AST Security Audit passed: 0 CVEs, 0 hallucinated packages, 100% WCAG AA contrast',
      status: 'PASS',
      time: '+210ms'
    },
    {
      agent: 'Sandbox',
      badge: 'DOCKER / WASM RUNTIME',
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      action: 'Code successfully mounted in isolated WebContainer. Dev server ready at http://localhost:3000',
      status: 'EXECUTED',
      time: '<3.8ms'
    }
  ];

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < agentSteps.length - 1 ? prev + 1 : 0));
    }, 2800);
    return () => clearInterval(interval);
  }, [isRunning, agentSteps.length]);

  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-cyber-grid bg-radial-gradient w-full">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-full h-[350px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 sm:right-10 w-[320px] sm:w-[450px] max-w-full h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 max-w-full rounded-full bg-zinc-900/90 border border-violet-500/30 text-xs font-mono font-medium text-violet-300 shadow-inner mb-6 backdrop-blur-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-zinc-200 text-[11px] sm:text-xs truncate">⚡ Autonomous AI Systems &amp; Isolated Sandbox Execution</span>
          </div>

          {/* Headline H1 */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Autonomous Software Development with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
              Human Oversight
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            An integrated multi-agent ecosystem for real-time code generation, closed-loop AST review, and hermetic browser-native WebContainers execution.
          </p>

          {/* Centralized Interactive Demo Launchpad CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-600 to-indigo-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-950/40 hover:shadow-cyan-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] ring-1 ring-cyan-400/40"
            >
              <Terminal className="w-4 h-4 text-cyan-200" />
              <span>Try In-Browser Sandbox</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-950/60 text-[10px] text-cyan-300 font-mono border border-cyan-400/30">
                Port 3000
              </span>
            </button>

            <button
              onClick={onOpenConsole}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 hover:text-white border border-zinc-800 hover:border-zinc-700 font-medium text-sm sm:text-base backdrop-blur-md transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
              <span>Launch Studio Console</span>
            </button>

            <button
              onClick={onOpenDocs}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 font-mono text-xs sm:text-sm tracking-tight transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Architecture Specs</span>
            </button>
          </div>

          {/* Quick Sandbox Environment Launchpad */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mb-12 font-mono text-xs max-w-3xl mx-auto shadow-inner">
            <span className="text-zinc-500 text-[11px] px-2 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Launchpad Presets:</span>
            </span>
            <button
              onClick={onExploreDemo}
              className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>🪙 Crypto Arbitrage</span>
            </button>
            <button
              onClick={onExploreDemo}
              className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>💳 SaaS Billing</span>
            </button>
            <button
              onClick={onExploreDemo}
              className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>🇪🇺 EU AI Act Audit</span>
            </button>
            <button
              onClick={onExploreDemo}
              className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <span>🇸🇰 Slovak Copilot (SK/EN)</span>
            </button>
          </div>

          {/* Trust stats & technical invariants */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 pb-2 border-y border-zinc-800/80 text-left">
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">&lt; 5ms</div>
              <div className="text-xs text-zinc-400 mt-0.5">Wasm Sandbox Latency</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">0 CVEs</div>
              <div className="text-xs text-zinc-400 mt-0.5">OWASP GenAI Top 10</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-bold font-mono text-violet-400">Closed-Loop</div>
              <div className="text-xs text-zinc-400 mt-0.5">Self-Healing Patcher</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">EU AI Act</div>
              <div className="text-xs text-zinc-400 mt-0.5">Article 14 Human Oversight</div>
            </div>
          </div>
        </div>

        {/* Hero Visual: Stylish VS Code-style Terminal / Editor Window */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-zinc-800/90 bg-zinc-950/90 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden">
            {/* Top Bar with OS Dots and File Tabs */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-zinc-400 hidden sm:inline">
                  workspace/sovereign-agentic-ide · <span className="text-violet-400">Gemini 3 Pro + WebContainers</span>
                </span>
              </div>

              {/* Simulation status controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                >
                  {isRunning ? <RotateCcw className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  <span>{isRunning ? 'Pause Loop' : 'Resume'}</span>
                </button>
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-zinc-400 px-2 py-1 rounded bg-zinc-950 border border-zinc-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Port 3000 Active</span>
                </div>
              </div>
            </div>

            {/* Split View: Left (Agent Activity Pipeline) + Right (Code Preview & Output) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/80">
              {/* Left Column: Live Agent Log Stream */}
              <div className="lg:col-span-7 p-5 font-mono text-xs space-y-3.5 bg-zinc-950/60">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1 border-b border-zinc-900">
                  <span>ORCHESTRATOR BLACKBOARD</span>
                  <span>SESSION: #ASP-2026-EU</span>
                </div>

                {agentSteps.map((step, idx) => {
                  const isCurrent = idx === activeStep;
                  const isPast = idx < activeStep;
                  return (
                    <div
                      key={step.agent}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        isCurrent
                          ? 'bg-zinc-900/90 border-violet-500/50 shadow-md shadow-violet-950/30 translate-x-1'
                          : isPast
                          ? 'bg-zinc-900/30 border-zinc-800/50 opacity-90'
                          : 'bg-zinc-950 border-zinc-900 opacity-40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${step.color}`}>
                            [{step.agent}]
                          </span>
                          <span className="text-zinc-300 font-semibold">{step.badge}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                          <span>{step.time}</span>
                          {isPast || isCurrent ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-zinc-700" />
                          )}
                        </div>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-relaxed pl-1">
                        {step.action}
                      </p>
                    </div>
                  );
                })}

                {/* Live execution prompt bar */}
                <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400">❯</span>
                    <span>State: <strong className="text-zinc-200">Closed-Loop Self-Healing Verified</strong></span>
                  </span>
                  <button
                    onClick={onExploreDemo}
                    className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect Full Tree</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Right Column: High-Tech Visual Graphic & Executed Preview */}
              <div className="lg:col-span-5 p-5 bg-zinc-900/40 flex flex-col justify-between relative overflow-hidden">
                <div className="relative rounded-xl overflow-hidden border border-zinc-800/80 mb-4 group aspect-[16/10]">
                  <img
                    src={heroAsset}
                    alt="Sovereign Architect Hermetic Sandbox"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                        HERMETIC SANDBOX
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">Wasm Node.js Kernel</span>
                    </div>
                    <p className="text-xs text-zinc-200 font-medium line-clamp-2">
                      Zero server compute. In-memory virtualized TCP stack eliminates roundtrip network latency.
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800/90 font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                    <span>COMPILER METRICS</span>
                    <span className="text-emerald-400">HMR REBUILD: 3.4ms</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="text-zinc-400">Bundle Size:</span>
                    <span>42.8 kB (gzipped)</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="text-zinc-400">Undo History:</span>
                    <span className="text-cyan-400">Preserved via executeEdits()</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="text-zinc-400">Self-Heal Limit:</span>
                    <span>3 Retries (LangGraph Circuit)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
