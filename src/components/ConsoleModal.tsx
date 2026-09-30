import React, { useState } from 'react';
import { X, Cpu, Sparkles, Terminal, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, Layers, Play } from 'lucide-react';

interface ConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemoView: () => void;
}

export const ConsoleModal: React.FC<ConsoleModalProps> = ({ isOpen, onClose, onLaunchDemoView }) => {
  const [projectGoal, setProjectGoal] = useState('Create an enterprise micro-SaaS dashboard with real-time billing webhooks and dark mode aesthetic');
  const [runtime, setRuntime] = useState<'wasm' | 'docker'>('wasm');
  const [vibe, setVibe] = useState<'cyberpunk' | 'minimal' | 'fintech'>('cyberpunk');
  const [retries, setRetries] = useState(3);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  if (!isOpen) return null;

  const handleStartDeployment = () => {
    setIsDeploying(true);
    setDeployStep(1);

    setTimeout(() => setDeployStep(2), 700);
    setTimeout(() => setDeployStep(3), 1400);
    setTimeout(() => {
      setIsDeploying(false);
      onLaunchDemoView();
      onClose();
    }, 2100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-violet-950/40 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] pointer-events-none rounded-full" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                SOVEREIGN // CONSOLE LAUNCHER
              </h3>
              <p className="text-xs text-zinc-400">Initialize autonomous agent swarm &amp; sandbox instance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="mt-6 space-y-5">
          {/* Project Goal Input */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5">
              Natural Language Intent / Application Goal:
            </label>
            <textarea
              value={projectGoal}
              onChange={(e) => setProjectGoal(e.target.value)}
              rows={3}
              placeholder="e.g. Build a decentralized token swap interface with chart analytics..."
              className="w-full rounded-xl bg-zinc-900/80 border border-zinc-800 p-3 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono resize-none"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400">Try Sample:</span>
            <button
              onClick={() => setProjectGoal('High-throughput real-time Crypto Arbitrage Scanner with visual order book')}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-white"
            >
              Crypto Sentinel
            </button>
            <button
              onClick={() => setProjectGoal('EU Digital Compliance Engine scanning pipelines for Article 14 Human Oversight')}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-white"
            >
              EU AI Act Engine
            </button>
            <button
              onClick={() => setProjectGoal('RMD26 Slovak Copilot Portal for tender discovery and administrative workflow')}
              className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-white"
            >
              Slovak Copilot
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Runtime selection */}
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Isolated Runtime:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRuntime('wasm')}
                  className={`p-2.5 rounded-lg border text-xs font-mono text-left transition-all ${
                    runtime === 'wasm'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <div className="font-bold">WebContainers</div>
                  <div className="text-[10px] text-zinc-400">In-Browser Wasm (&lt;5ms)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRuntime('docker')}
                  className={`p-2.5 rounded-lg border text-xs font-mono text-left transition-all ${
                    runtime === 'docker'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  <div className="font-bold">Private Docker</div>
                  <div className="text-[10px] text-zinc-400">Air-Gapped Enterprise</div>
                </button>
              </div>
            </div>

            {/* Design Token Vibe */}
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                Design System Token Vibe:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVibe('cyberpunk')}
                  className={`p-2 rounded-lg border text-xs font-mono text-center transition-all ${
                    vibe === 'cyberpunk'
                      ? 'border-violet-500 bg-violet-950/30 text-violet-300'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  Cyberpunk
                </button>
                <button
                  type="button"
                  onClick={() => setVibe('minimal')}
                  className={`p-2 rounded-lg border text-xs font-mono text-center transition-all ${
                    vibe === 'minimal'
                      ? 'border-violet-500 bg-violet-950/30 text-violet-300'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  Minimalist
                </button>
                <button
                  type="button"
                  onClick={() => setVibe('fintech')}
                  className={`p-2 rounded-lg border text-xs font-mono text-center transition-all ${
                    vibe === 'fintech'
                      ? 'border-violet-500 bg-violet-950/30 text-violet-300'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  }`}
                >
                  FinTech
                </button>
              </div>
            </div>
          </div>

          {/* Self-Healing Recursion Limiter */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-zinc-300">Patcher Max Auto-Heal Retries (LangGraph Circuit Breaker):</span>
              <span className="text-amber-400 font-bold">{retries} attempts</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={retries}
              onChange={(e) => setRetries(Number(e.target.value))}
              className="w-full accent-violet-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Deployment Animation Steps */}
          {isDeploying && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-violet-300">
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {deployStep === 1 && 'Planner Agent: Generating DAG specification...'}
                  {deployStep === 2 && 'Nexus Architect: Mounting virtual file system...'}
                  {deployStep === 3 && 'Spark Coder: Injecting theme.json design tokens...'}
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${(deployStep / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>EU AI Act Human Gate Active</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleStartDeployment}
              disabled={isDeploying}
              className="px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-900/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDeploying ? 'Provisioning...' : 'Launch Agent Swarm'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
