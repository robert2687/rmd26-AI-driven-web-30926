import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Code2, FolderTree, ShieldCheck, Play, RotateCcw, Copy, Check, Sparkles, AlertCircle, Wrench, ExternalLink, Cpu, CheckCircle2, FastForward, Send, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { INITIAL_TERMINAL_LOGS, SAMPLE_PROJECT_FILES, SIMULATION_PRESETS, COMPLIANCE_RULES } from '../data/mockData';
import { ProjectFile, SimulationPreset, TerminalLog } from '../types';
import { CryptoArbitrageApp } from './sandbox/CryptoArbitrageApp';
import { BillingApp } from './sandbox/BillingApp';
import { ComplianceEngineApp } from './sandbox/ComplianceEngineApp';
import { SlovakCopilotApp } from './sandbox/SlovakCopilotApp';

// Real-time AI typing animation component for individual log messages
interface TypedLogMessageProps {
  message: string;
  isTyping: boolean;
  speed?: number;
  onComplete?: () => void;
}

const TypedLogMessage: React.FC<TypedLogMessageProps> = ({
  message,
  isTyping,
  speed = 10,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState(isTyping ? '' : message);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(message);
      return;
    }

    setDisplayedText('');
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += 2; // Stream 2 characters per tick for authentic LLM typing cadence
      if (currentIndex >= message.length) {
        setDisplayedText(message);
        clearInterval(interval);
        if (onComplete) onComplete();
      } else {
        setDisplayedText(message.slice(0, currentIndex));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [message, isTyping, speed]);

  return (
    <span className="leading-relaxed">
      {displayedText}
      {isTyping && displayedText.length < message.length && (
        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 align-middle animate-pulse" />
      )}
    </span>
  );
};

export const TerminalDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'chat' | 'sandbox' | 'compliance'>('sandbox');
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(SAMPLE_PROJECT_FILES[0]);
  const [selectedPreset, setSelectedPreset] = useState<SimulationPreset>(SIMULATION_PRESETS[0]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>(INITIAL_TERMINAL_LOGS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTypingLogId, setActiveTypingLogId] = useState<string | null>(null);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState('');
  
  // Interactive Self-Healing visual states
  const [selfHealPhase, setSelfHealPhase] = useState<'idle' | 'crash' | 'medic' | 'restored'>('idle');
  
  // Interactive Compliance filter state
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'EU AI Act' | 'OWASP GenAI' | 'GDPR / Sovereign AI'>('all');
  const [isAuditingRules, setIsAuditingRules] = useState(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<TerminalLog[]>([]);

  // Automatically scroll down smoothly as the AI types out logs
  useEffect(() => {
    if (activeTab === 'chat' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activeTypingLogId, activeTab]);

  // Sequentially process the queue of logs one by one with typing animation
  const processNextLog = () => {
    if (queueRef.current.length === 0) {
      setIsSimulating(false);
      setActiveTypingLogId(null);
      return;
    }

    const nextLog = queueRef.current.shift()!;
    setTerminalLogs((prev) => [...prev, nextLog]);
    setActiveTypingLogId(nextLog.id);
  };

  // Run a real-time multi-agent execution cycle with typing animation
  const handleRunSwarm = (preset: SimulationPreset, customPrompt?: string) => {
    setIsSimulating(true);
    setSelfHealPhase('idle');
    setSelectedPreset(preset);

    const promptText = customPrompt || preset.prompt;

    const generatedLogs: TerminalLog[] = [
      {
        id: `log-${Date.now()}-1`,
        timestamp: '00:00.08',
        agent: 'Planner',
        level: 'info',
        message: `Ingesting intent: "${promptText}"`
      },
      {
        id: `log-${Date.now()}-2`,
        timestamp: '00:00.32',
        agent: 'Planner',
        level: 'success',
        message: `Generated execution graph (${preset.filesGenerated} target files). Enforcing mockData.ts seed contract to prevent hollow UI.`
      },
      {
        id: `log-${Date.now()}-3`,
        timestamp: '00:00.74',
        agent: 'Architect',
        level: 'info',
        message: `Mounting in-memory VFS at /workspace. Scaffolding component tree and theme.json token layer.`
      },
      {
        id: `log-${Date.now()}-4`,
        timestamp: '00:01.20',
        agent: 'Coder',
        level: 'code',
        message: `Synthesizing ${preset.linesOfCode} LOC across ${preset.filesGenerated} modular TypeScript units.`
      }
    ];

    if (preset.selfHealCount > 0 && preset.initialError) {
      generatedLogs.push(
        {
          id: `log-${Date.now()}-5`,
          timestamp: '00:01.88',
          agent: 'Compiler',
          level: 'error',
          message: preset.initialError
        },
        {
          id: `log-${Date.now()}-6`,
          timestamp: '00:02.12',
          agent: 'Patcher',
          level: 'patch',
          message: preset.patchSolution || 'AST patch applied via executeEdits(). Re-triggering HMR rebuild.'
        }
      );
    }

    generatedLogs.push(
      {
        id: `log-${Date.now()}-7`,
        timestamp: '00:02.65',
        agent: 'Reviewer',
        level: 'success',
        message: 'Security & compliance verification: 0 CVEs, 0 orphan packages, WCAG AA compliant.'
      },
      {
        id: `log-${Date.now()}-8`,
        timestamp: '00:02.98',
        agent: 'Sandbox',
        level: 'success',
        message: `WebContainer active on localhost:3000/${preset.id}. Real-time HMR mounted in 3.6ms.`
      }
    );

    if (skipAnimation) {
      setTerminalLogs(generatedLogs);
      setIsSimulating(false);
      setActiveTypingLogId(null);
      return;
    }

    // Start progressive real-time stream
    setTerminalLogs([]);
    queueRef.current = [...generatedLogs];
    processNextLog();
  };

  // Trigger intentional test error and self-healing Medic demonstration
  const handleTriggerSelfHealingDemo = () => {
    setIsSimulating(true);
    setSelfHealPhase('crash');

    const errorLog: TerminalLog = {
      id: `err-${Date.now()}`,
      timestamp: '00:01.05',
      agent: 'Compiler',
      level: 'error',
      message: `TypeError in /src/components/Header.tsx: Cannot read properties of undefined (reading 'brandGlow'). Process exited with code 1.`
    };
    const patchLog: TerminalLog = {
      id: `patch-${Date.now()}`,
      timestamp: '00:01.18',
      agent: 'Patcher',
      level: 'patch',
      message: `[The Medic Intercept] Analyzed stderr. Injected optional chaining (theme?.brandGlow ?? '#8b5cf6') via executeEdits(). Build restored in 92ms. Exit code 0.`
    };

    // Transition visual self-heal states in the Sandbox preview
    setTimeout(() => {
      setSelfHealPhase('medic');
    }, 1000);

    setTimeout(() => {
      setSelfHealPhase('restored');
      setTimeout(() => setSelfHealPhase('idle'), 3500);
    }, 2200);

    if (skipAnimation) {
      setTerminalLogs((prev) => [errorLog, patchLog, ...prev]);
      setIsSimulating(false);
      return;
    }

    queueRef.current = [errorLog, patchLog];
    processNextLog();
  };

  // Handle custom user-entered prompt in the Multi-Agent Stream
  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPromptInput.trim()) return;

    const customPreset: SimulationPreset = {
      id: `custom-${Date.now()}`,
      title: 'Custom User Specification',
      description: customPromptInput,
      category: 'User Custom DAG',
      prompt: customPromptInput,
      filesGenerated: 6,
      linesOfCode: 840,
      selfHealCount: 0
    };

    handleRunSwarm(customPreset, customPromptInput);
    setCustomPromptInput('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunComplianceAudit = () => {
    setIsAuditingRules(true);
    setAuditSuccessMsg(null);
    setTimeout(() => {
      setIsAuditingRules(false);
      setAuditSuccessMsg('All 4 regulatory invariant checks passed (EU AI Act Art 14, Art 10, OWASP LLM-01, GDPR Ch V).');
      setTimeout(() => setAuditSuccessMsg(null), 6000);
    }, 1000);
  };

  const filteredRules = complianceFilter === 'all'
    ? COMPLIANCE_RULES
    : COMPLIANCE_RULES.filter((r) => r.standard.includes(complianceFilter));

  return (
    <section id="terminal-demo" className="py-24 relative bg-zinc-950/70 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-violet-400 mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>LIVE WORKFLOW SIMULATOR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Multi-Agent{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                Studio Terminal
              </span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              Select presets or type custom prompts to test live application generation, file AST inspection, multi-agent chat streaming, and automated self-healing.
            </p>
          </div>

          {/* Quick Presets Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 mr-1 hidden sm:inline">Scenario Preset:</span>
            {SIMULATION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleRunSwarm(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  selectedPreset.id === preset.id
                    ? 'bg-violet-950/60 border-violet-500 text-violet-200 shadow-md shadow-violet-900/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {preset.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Studio Shell Window */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden">
          {/* Main Top Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-2.5 gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'sandbox'
                    ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sandbox Output (Port 3000)</span>
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'architecture'
                    ? 'bg-zinc-800 text-violet-300 border border-violet-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5 text-violet-400" />
                <span>Architecture &amp; AST</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Multi-Agent Stream ({terminalLogs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('compliance')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'compliance'
                    ? 'bg-zinc-800 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compliance Audit (EU AI Act)</span>
              </button>
            </div>

            {/* Simulation trigger buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleTriggerSelfHealingDemo}
                title="Simulate runtime build crash and watch Patcher Medic repair it automatically"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-950/40 border border-amber-600/40 hover:border-amber-500 text-amber-300 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Simulate Error &amp; Auto-Heal</span>
              </button>

              <button
                onClick={() => handleRunSwarm(selectedPreset)}
                disabled={isSimulating}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-900/30 transition-all disabled:opacity-50"
              >
                {isSimulating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isSimulating ? 'Executing...' : 'Run Swarm'}</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Live Sandbox Preview with Dynamic Presets & Self-Healing Overlay */}
          {activeTab === 'sandbox' && (
            <div className="p-6 bg-zinc-950/90 min-h-[520px] flex flex-col justify-between">
              {/* Virtual Browser Top Nav */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded text-xs font-mono text-zinc-300 flex items-center gap-2">
                    <span className="text-emerald-400">https://</span>
                    <span>localhost:3000/{selectedPreset.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    HMR Hot Reload Active
                  </span>
                  <span>Latency: 3.4ms</span>
                </div>
              </div>

              {/* Visual Crash & Self-Healing Notifications */}
              {selfHealPhase === 'crash' && (
                <div className="mb-4 p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 font-mono text-xs flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <div className="font-bold">COMPILER CRASH INTERCEPTED (Exit Code 1)</div>
                      <div className="text-[11px] text-rose-300">TypeError: Cannot read properties of undefined (reading &apos;brandGlow&apos;)</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-rose-900 text-[10px] uppercase font-bold">Deploying Medic</span>
                </div>
              )}

              {selfHealPhase === 'medic' && (
                <div className="mb-4 p-4 rounded-xl bg-amber-950/80 border border-amber-500 text-amber-200 font-mono text-xs flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
                    <div>
                      <div className="font-bold">THE PATCHER AGENT (THE MEDIC) AT WORK</div>
                      <div className="text-[11px] text-amber-300">Parsing compiler stderr ➔ Applying surgical AST diff via executeEdits() without breaking undo history...</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-300">&lt;92ms</span>
                </div>
              )}

              {selfHealPhase === 'restored' && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 font-mono text-xs flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SELF-HEALING SUCCESSFUL: Injected optional chaining. Hot Module Replacement rebuild verified.</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold">Exit Code 0</span>
                </div>
              )}

              {/* Rendered Live Functional Mini Application */}
              <div className="flex-1 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 flex flex-col justify-between backdrop-blur-md">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3 mb-6">
                    <div>
                      <span className="text-xs font-mono text-violet-400 uppercase tracking-wider">
                        Active App Template: {selectedPreset.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-1">{selectedPreset.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 max-w-xl">{selectedPreset.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-cyan-400">
                        {selectedPreset.linesOfCode} LOC Compiled
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Interactive App Component based on selected preset */}
                  {selectedPreset.id === 'crypto-bot' && <CryptoArbitrageApp />}
                  {selectedPreset.id === 'saas-billing' && <BillingApp />}
                  {selectedPreset.id === 'eu-compliance' && <ComplianceEngineApp />}
                  {selectedPreset.id === 'slovak-copilot' && <SlovakCopilotApp />}
                  {selectedPreset.id.startsWith('custom-') && <CryptoArbitrageApp />}
                </div>

                {/* Bottom telemetry footer of the sandbox */}
                <div className="mt-8 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>WebContainers Isolation · Memory: 48.2 MB / 512 MB</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Generated LOC: {selectedPreset.linesOfCode}</span>
                    <span>Self-Heal Intercepts: {selectedPreset.selfHealCount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Architecture & File Tree with Token Styler */}
          {activeTab === 'architecture' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
              {/* Virtual File System Explorer */}
              <div className="lg:col-span-4 p-4 bg-zinc-950/90 font-mono text-xs">
                <div className="text-zinc-400 font-semibold mb-3 px-2 flex items-center justify-between">
                  <span>WORKSPACE EXPLORER</span>
                  <span className="text-[10px] text-zinc-400">VFS MOUNTED</span>
                </div>
                <div className="space-y-1">
                  {SAMPLE_PROJECT_FILES.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedFile.path === file.path
                          ? 'bg-violet-950/50 border border-violet-500/40 text-white font-medium'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase">{file.language}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
                  <div className="font-semibold text-zinc-300">File Invariant Contract:</div>
                  <p>
                    All files are compiled strictly from AST trees. No lazy omissions or placeholder code snippets allowed.
                  </p>
                </div>
              </div>

              {/* Code Viewer Panel */}
              <div className="lg:col-span-8 p-4 bg-zinc-950 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono text-zinc-400 mb-3">
                    <span className="text-zinc-200 font-medium">{selectedFile.path}</span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[380px] leading-relaxed">
                    <code>{selectedFile.content}</code>
                  </pre>
                </div>
                <div className="mt-3 text-xs text-zinc-400 font-mono flex items-center justify-between">
                  <span>{selectedFile.description}</span>
                  <span className="text-violet-400">Validated by Nexus Architect</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Multi-Agent Stream with Interactive User Input */}
          {activeTab === 'chat' && (
            <div className="p-5 bg-zinc-950/95 font-mono text-xs min-h-[500px] flex flex-col justify-between">
              {/* Terminal Stream Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-zinc-200 font-semibold">
                    {isSimulating ? 'AI AGENTS COMPOSING & STREAMING IN REAL-TIME...' : 'BLACKBOARD SYNCED · CLUSTER IDLE'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSkipAnimation(!skipAnimation)}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <FastForward className="w-3 h-3 text-cyan-400" />
                    <span>{skipAnimation ? 'Typing Effect: Off' : 'Typing Effect: On'}</span>
                  </button>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400">{terminalLogs.length} events logged</span>
                </div>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 mt-3">
                {terminalLogs.map((log) => {
                  const badgeColor =
                    log.level === 'error'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : log.level === 'patch'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : log.level === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : log.level === 'code'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-violet-500/10 text-violet-400 border-violet-500/30';

                  const isCurrentlyTyping = activeTypingLogId === log.id;

                  return (
                    <div
                      key={log.id}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                        isCurrentlyTyping
                          ? 'bg-zinc-900/90 border-cyan-500/50 shadow-md shadow-cyan-950/20'
                          : 'bg-zinc-900/40 border-zinc-800/80'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 shrink-0 mt-0.5">{log.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${badgeColor}`}>
                        [{log.agent}]
                      </span>
                      <div className="text-zinc-200 text-xs leading-relaxed flex-1">
                        <TypedLogMessage
                          message={log.message}
                          isTyping={isCurrentlyTyping}
                          speed={10}
                          onComplete={processNextLog}
                        />
                      </div>
                    </div>
                  );
                })}
                <div ref={logsEndRef} />
              </div>

              {/* Fully Interactive Custom Prompt Input Bar */}
              <form onSubmit={handleCustomPromptSubmit} className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">&gt;</span>
                <input
                  type="text"
                  value={customPromptInput}
                  onChange={(e) => setCustomPromptInput(e.target.value)}
                  placeholder={`Type any feature or prompt (e.g., "${selectedPreset.prompt}")...`}
                  className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 font-mono text-xs outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-mono font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSimulating ? 'Composing...' : 'Execute Swarm'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 4: Compliance & Security Audit with Interactive Verification */}
          {activeTab === 'compliance' && (
            <div className="p-6 bg-zinc-950/90 min-h-[500px] flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 mb-6 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">EU AI Act &amp; Security Compliance Ledger</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Continuous real-time verification against European Union High-Risk AI Invariants and OWASP Top 10 for Agentic AI.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunComplianceAudit}
                      disabled={isAuditingRules}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAuditingRules ? 'animate-spin' : ''}`} />
                      <span>{isAuditingRules ? 'Verifying Invariants...' : 'Verify All Rules'}</span>
                    </button>
                  </div>
                </div>

                {auditSuccessMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{auditSuccessMsg}</span>
                  </div>
                )}

                {/* Filter tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-mono text-zinc-400">Filter Standard:</span>
                  {(['all', 'EU AI Act', 'OWASP GenAI', 'GDPR / Sovereign AI'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setComplianceFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                        complianceFilter === cat
                          ? 'bg-violet-950 border border-violet-500 text-white'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat === 'all' ? 'All Invariants' : cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRules.map((rule) => (
                    <div key={rule.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-violet-400 font-semibold">
                          {rule.standard} · {rule.article}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {rule.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{rule.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{rule.description}</p>
                      <div className="pt-2 text-[11px] font-mono text-zinc-400 border-t border-zinc-800/60">
                        <strong>Audit Evidence:</strong> {rule.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Certification Target: EU AI Act Regulation (EU) 2024/1689</span>
                <span className="text-emerald-400 font-bold">100% Passed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
