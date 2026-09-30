import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Code2, 
  FolderTree, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Wrench, 
  ExternalLink, 
  Cpu, 
  CheckCircle2, 
  FastForward, 
  Send, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  Search,
  Layers,
  Activity,
  Pause,
  Sliders,
  Bug,
  Trash2,
  FileCode,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { INITIAL_TERMINAL_LOGS, SAMPLE_PROJECT_FILES, SIMULATION_PRESETS, COMPLIANCE_RULES } from '../data/mockData';
import { ProjectFile, SimulationPreset, TerminalLog } from '../types';
import { CryptoArbitrageApp } from './sandbox/CryptoArbitrageApp';
import { BillingApp } from './sandbox/BillingApp';
import { ComplianceEngineApp } from './sandbox/ComplianceEngineApp';
import { SlovakCopilotApp } from './sandbox/SlovakCopilotApp';
import { DagVisualizer } from './terminal/DagVisualizer';
import { InteractiveCli } from './terminal/InteractiveCli';

export type TerminalTab = 'sandbox' | 'architecture' | 'chat' | 'dag' | 'cli' | 'compliance';
export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';
export type CodeViewMode = 'source' | 'ast' | 'deps';

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
      currentIndex += 2;
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
  // Main Navigation State
  const [activeTab, setActiveTab] = useState<TerminalTab>('sandbox');
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(SAMPLE_PROJECT_FILES[0]);
  const [selectedPreset, setSelectedPreset] = useState<SimulationPreset>(SIMULATION_PRESETS[0]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>(INITIAL_TERMINAL_LOGS);
  
  // Execution & Simulation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTypingLogId, setActiveTypingLogId] = useState<string | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState<'0.5x' | '1x' | '3x' | 'instant'>('1x');
  const [currentActiveAgent, setCurrentActiveAgent] = useState<string>('Planner');
  
  // Sandbox Viewport & Controls
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [sandboxRoute, setSandboxRoute] = useState<string>('/overview');
  const [sandboxKey, setSandboxKey] = useState<number>(0);
  
  // Code & AST Explorer Controls
  const [codeViewMode, setCodeViewMode] = useState<CodeViewMode>('source');
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [injectedBugLine, setInjectedBugLine] = useState<number | null>(null);
  
  // Multi-Agent Stream Filters & Prompts
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [customPromptInput, setCustomPromptInput] = useState('');
  
  // Interactive Self-Healing states
  const [selfHealPhase, setSelfHealPhase] = useState<'idle' | 'crash' | 'medic' | 'restored'>('idle');
  
  // Compliance Filter States
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'EU AI Act' | 'OWASP GenAI' | 'GDPR / Sovereign AI'>('all');
  const [isAuditingRules, setIsAuditingRules] = useState(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState<string | null>(null);

  // Mobile Architecture View State
  const [mobileArchTab, setMobileArchTab] = useState<'files' | 'code'>('code');

  const studioTabs: { id: TerminalTab; label: string; shortLabel: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'sandbox', label: 'Sandbox Output (Port 3000)', shortLabel: 'Sandbox', icon: Cpu },
    { id: 'architecture', label: 'Architecture & AST', shortLabel: 'AST & Code', icon: FolderTree },
    { id: 'chat', label: `Agent Stream (${terminalLogs.length})`, shortLabel: 'Live Stream', icon: Activity },
    { id: 'dag', label: 'DAG State Engine', shortLabel: 'DAG Engine', icon: Layers },
    { id: 'cli', label: 'Wasm CLI Shell', shortLabel: 'Wasm CLI', icon: Terminal },
    { id: 'compliance', label: 'EU AI Act Audit', shortLabel: 'EU AI Audit', icon: ShieldCheck },
  ];

  const currentTabIndex = studioTabs.findIndex((t) => t.id === activeTab);
  const handlePrevTab = () => {
    const prevIdx = (currentTabIndex - 1 + studioTabs.length) % studioTabs.length;
    setActiveTab(studioTabs[prevIdx].id);
  };
  const handleNextTab = () => {
    const nextIdx = (currentTabIndex + 1) % studioTabs.length;
    setActiveTab(studioTabs[nextIdx].id);
  };

  // Listen for external tab switches from Header or Hero
  useEffect(() => {
    const handleSwitchTab = (e: Event) => {
      const customEvent = e as CustomEvent<TerminalTab>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('switch-terminal-tab', handleSwitchTab);
    return () => window.removeEventListener('switch-terminal-tab', handleSwitchTab);
  }, []);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<TerminalLog[]>([]);

  // Automatically scroll log view
  useEffect(() => {
    if (activeTab === 'chat' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activeTypingLogId, activeTab]);

  // Process sequential stream of logs
  const processNextLog = () => {
    if (isPaused) return;

    if (queueRef.current.length === 0) {
      setIsSimulating(false);
      setActiveTypingLogId(null);
      setCurrentActiveAgent('Sandbox');
      return;
    }

    const nextLog = queueRef.current.shift()!;
    setTerminalLogs((prev) => [...prev, nextLog]);
    setActiveTypingLogId(nextLog.id);
    setCurrentActiveAgent(nextLog.agent);
  };

  // Run a real-time multi-agent execution cycle
  const handleRunSwarm = (preset: SimulationPreset, customPrompt?: string) => {
    setIsSimulating(true);
    setIsPaused(false);
    setSelfHealPhase('idle');
    setSelectedPreset(preset);

    const promptText = customPrompt || preset.prompt;
    setCurrentActiveAgent('Planner');

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

    if (speedMultiplier === 'instant') {
      setTerminalLogs(generatedLogs);
      setIsSimulating(false);
      setActiveTypingLogId(null);
      setCurrentActiveAgent('Sandbox');
      return;
    }

    // Start progressive real-time stream
    setTerminalLogs([]);
    queueRef.current = [...generatedLogs];
    processNextLog();
  };

  // Step next log in stepper mode
  const handleStepNext = () => {
    if (queueRef.current.length > 0) {
      const nextLog = queueRef.current.shift()!;
      setTerminalLogs((prev) => [...prev, nextLog]);
      setActiveTypingLogId(null);
      setCurrentActiveAgent(nextLog.agent);
      if (queueRef.current.length === 0) {
        setIsSimulating(false);
      }
    }
  };

  // Trigger intentional test error and self-healing Medic demonstration
  const handleTriggerSelfHealingDemo = () => {
    setIsSimulating(true);
    setSelfHealPhase('crash');
    setCurrentActiveAgent('Compiler');

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

    setTimeout(() => {
      setSelfHealPhase('medic');
      setCurrentActiveAgent('Patcher');
    }, 1000);

    setTimeout(() => {
      setSelfHealPhase('restored');
      setCurrentActiveAgent('Sandbox');
      setTimeout(() => setSelfHealPhase('idle'), 3500);
    }, 2200);

    if (speedMultiplier === 'instant') {
      setTerminalLogs((prev) => [errorLog, patchLog, ...prev]);
      setIsSimulating(false);
      return;
    }

    queueRef.current = [errorLog, patchLog];
    processNextLog();
  };

  // Inject intentional bug in file explorer
  const handleInjectCodeBug = () => {
    setInjectedBugLine(14);
    setTimeout(() => {
      handleTriggerSelfHealingDemo();
      setTimeout(() => setInjectedBugLine(null), 3500);
    }, 400);
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
      filesGenerated: 7,
      linesOfCode: 980,
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

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWorkspace = () => {
    const jsonContent = JSON.stringify({
      preset: selectedPreset,
      files: SAMPLE_PROJECT_FILES,
      exportedAt: new Date().toISOString(),
      compliance: 'EU AI Act Article 14 Verified'
    }, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sovereign-workspace-${selectedPreset.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
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

  const filteredFiles = SAMPLE_PROJECT_FILES.filter((f) =>
    f.name.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
    f.path.toLowerCase().includes(fileSearchQuery.toLowerCase())
  );

  const filteredLogs = terminalLogs.filter((log) => {
    if (agentFilter === 'all') return true;
    return log.agent.toLowerCase() === agentFilter.toLowerCase();
  });

  const filteredRules = complianceFilter === 'all'
    ? COMPLIANCE_RULES
    : COMPLIANCE_RULES.filter((r) => r.standard.includes(complianceFilter));

  const typingSpeedMs = speedMultiplier === '0.5x' ? 24 : speedMultiplier === '1x' ? 10 : 3;

  const handleLaunchSandboxPreset = (preset: SimulationPreset) => {
    setSelectedPreset(preset);
    setActiveTab('sandbox');
    handleRunSwarm(preset);
  };

  return (
    <section id="terminal-demo" className="py-16 sm:py-24 relative bg-zinc-950/70 border-t border-zinc-800/80 w-full overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centralized Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 mb-3 shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>INTERACTIVE MULTI-AGENT STUDIO LAUNCHPAD // PORT 3000 WASM</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Interactive Multi-Agent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400">
              Demo Launchpad
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Launch isolated in-browser WebContainers sandboxes, test multi-agent task orchestration, or trigger closed-loop self-healing in real time with zero cloud VM fees.
          </p>
        </div>

        {/* Mobile Compact Preset Selector (sm:hidden) */}
        <div className="sm:hidden mb-6 space-y-3 font-mono">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
            <span>SELECT DEMO PRESET:</span>
            <span className="text-cyan-400 font-bold">{selectedPreset.linesOfCode} LOC</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {SIMULATION_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    isSelected
                      ? 'bg-violet-950/80 border-violet-500 text-white font-bold ring-1 ring-violet-500/40'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {preset.id === 'crypto-bot' && <span>🪙</span>}
                    {preset.id === 'saas-billing' && <span>💳</span>}
                    {preset.id === 'eu-compliance' && <span>🇪🇺</span>}
                    {preset.id === 'slovak-copilot' && <span>🇸🇰</span>}
                    <span className="truncate">{preset.title.split(' ')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Preset Summary Card on Mobile */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{selectedPreset.title}</div>
              <div className="text-[10px] text-zinc-400 font-sans line-clamp-1">{selectedPreset.description}</div>
            </div>
            <button
              onClick={() => handleLaunchSandboxPreset(selectedPreset)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 text-zinc-950 flex items-center gap-1 shrink-0 shadow-md shadow-cyan-950/40"
            >
              <Terminal className="w-3 h-3" />
              <span>Try Sandbox</span>
            </button>
          </div>
        </div>

        {/* Centralized 4-App Sandbox Launchpad Cards (Desktop & Tablet) */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-mono">
          {SIMULATION_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between backdrop-blur-xl ${
                  isSelected
                    ? 'bg-gradient-to-b from-zinc-900/90 via-violet-950/20 to-zinc-900/90 border-violet-500 shadow-xl shadow-violet-950/30 ring-1 ring-violet-500/40'
                    : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      {preset.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-cyan-400 font-semibold">
                      {preset.linesOfCode} LOC
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                    {preset.id === 'crypto-bot' && <span>🪙</span>}
                    {preset.id === 'saas-billing' && <span>💳</span>}
                    {preset.id === 'eu-compliance' && <span>🇪🇺</span>}
                    {preset.id === 'slovak-copilot' && <span>🇸🇰</span>}
                    <span>{preset.title}</span>
                  </h3>

                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed mb-4">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-zinc-500">
                    {preset.selfHealCount > 0 ? 'Self-Healing: Yes' : 'Self-Healing: Idle'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchSandboxPreset(preset);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected && activeTab === 'sandbox'
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-md shadow-cyan-950/40'
                        : 'bg-violet-600/90 hover:bg-violet-500 text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Try Sandbox</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Terminal Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-6 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300">
              <span className="text-zinc-500">Active Agent:</span>
              <span className="text-cyan-400 font-bold">{currentActiveAgent}</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            <div className="flex items-center gap-1 text-zinc-400 text-[10px]">
              <span className="hidden xs:inline">Speed:</span>
              {(['0.5x', '1x', '3x', 'instant'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeedMultiplier(spd)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    speedMultiplier === spd
                      ? 'bg-violet-600 text-white font-bold'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'sandbox' && (
              <button
                onClick={() => setActiveTab('sandbox')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 transition-colors shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Try Sandbox</span>
              </button>
            )}

            <button
              onClick={handleTriggerSelfHealingDemo}
              title="Simulate runtime build crash and watch Patcher Medic repair it automatically"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-amber-950/40 border border-amber-500/50 hover:border-amber-400 text-amber-300 transition-colors shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Error</span>
            </button>

            {isSimulating && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            {isPaused && (
              <button
                onClick={handleStepNext}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 transition-colors"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Step Next</span>
              </button>
            )}

            <button
              onClick={() => handleRunSwarm(selectedPreset)}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-md shadow-violet-950/40 transition-all disabled:opacity-50"
            >
              {isSimulating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'Executing...' : 'Run Swarm'}</span>
            </button>

            <button
              onClick={handleExportWorkspace}
              title="Export complete workspace bundle as JSON"
              className="p-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Shell Window */}
        <div className="w-full rounded-2xl border border-zinc-800/90 bg-zinc-900/60 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden font-mono">
          {/* Main Top Navigation Tabs */}
          <div className="border-b border-zinc-800 bg-zinc-950/90 px-3 sm:px-4 py-2.5 w-full">
            {/* Mobile Feature Selector (Visible on small screens so users see ALL 6 features!) */}
            <div className="sm:hidden w-full space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800/80">
                <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>ALL 6 STUDIO FEATURES:</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">
                  {currentTabIndex + 1} of 6
                </span>
              </div>

              {/* 3x2 Grid of All 6 Features */}
              <div className="grid grid-cols-3 gap-1.5">
                {studioTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`p-2 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all border ${
                        isActive
                          ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-cyan-500 text-white shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                      <span className="truncate max-w-full text-center">{tab.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Prev / Next Feature Navigator Bar */}
              <div className="flex items-center justify-between pt-1 text-[11px] bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-800">
                <button
                  onClick={handlePrevTab}
                  className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Prev</span>
                </button>
                <span className="text-cyan-300 font-bold truncate px-2 text-[10px] text-center">
                  {studioTabs[currentTabIndex]?.label}
                </span>
                <button
                  onClick={handleNextTab}
                  className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Desktop / Tablet Horizontal Tab Bar */}
            <div className="hidden sm:flex items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {studioTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                        isActive
                          ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500 ml-auto shrink-0">
                <span>Cluster:</span>
                <span className="text-emerald-400 font-semibold">WebContainers Online</span>
              </div>
            </div>
          </div>

          {/* TAB 1: SANDBOX OUTPUT (PORT 3000) WITH DEVICE VIEWPORTS */}
          {activeTab === 'sandbox' && (
            <div className="p-4 sm:p-6 bg-zinc-950/90 min-h-[540px] flex flex-col justify-between">
              {/* Virtual Browser Top Nav */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-lg text-xs text-zinc-300 flex items-center gap-2 font-mono">
                    <span className="text-emerald-400 font-bold">https://</span>
                    <span>localhost:3000{sandboxRoute}</span>
                  </div>
                  <button
                    onClick={() => setSandboxKey((prev) => prev + 1)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Reload Sandbox"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Device Viewport Toggle & Telemetry */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {/* Route Jumpers */}
                  <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                    {['/overview', '/analytics', '/contracts', '/logs'].map((rt) => (
                      <button
                        key={rt}
                        onClick={() => setSandboxRoute(rt)}
                        className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                          sandboxRoute === rt
                            ? 'bg-violet-600 text-white font-bold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {rt}
                      </button>
                    ))}
                  </div>

                  {/* Device Switcher */}
                  <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                    <button
                      onClick={() => setViewport('desktop')}
                      className={`p-1 rounded ${viewport === 'desktop' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                      title="Desktop View (100%)"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewport('tablet')}
                      className={`p-1 rounded ${viewport === 'tablet' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                      title="Tablet View (768px)"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewport('mobile')}
                      className={`p-1 rounded ${viewport === 'mobile' ? 'bg-zinc-800 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                      title="Mobile View (375px)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-zinc-500">·</span>
                  <span className="text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    HMR 3.4ms
                  </span>
                </div>
              </div>

              {/* Visual Crash & Self-Healing Notifications */}
              {selfHealPhase === 'crash' && (
                <div className="mb-4 p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs flex items-center justify-between animate-pulse">
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
                <div className="mb-4 p-4 rounded-xl bg-amber-950/80 border border-amber-500 text-amber-200 text-xs flex items-center justify-between shadow-lg">
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
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SELF-HEALING SUCCESSFUL: Injected optional chaining. Hot Module Replacement rebuild verified.</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold">Exit Code 0</span>
                </div>
              )}

              {/* Rendered Live Functional Mini Application in Responsive Frame */}
              <div className="flex-1 flex justify-center">
                <div
                  key={sandboxKey}
                  className={`transition-all duration-300 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-6 flex flex-col justify-between backdrop-blur-md ${
                    viewport === 'desktop' ? 'w-full' :
                    viewport === 'tablet' ? 'w-full max-w-[768px]' :
                    'w-full max-w-[390px]'
                  }`}
                >
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3 mb-6">
                      <div>
                        <span className="text-xs text-violet-400 uppercase tracking-wider font-bold">
                          Active Sandbox: {selectedPreset.category}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{selectedPreset.title}</h3>
                        <p className="text-xs text-zinc-400 mt-1 max-w-xl font-sans">{selectedPreset.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-cyan-400">
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
                  <div className="mt-8 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
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
            </div>
          )}

          {/* TAB 2: ARCHITECTURE & AST EXPLORER WITH CODE/AST TOGGLE */}
          {activeTab === 'architecture' && (
            <div className="flex flex-col min-h-[520px]">
              {/* Mobile View Toggle between Files and Code (lg:hidden) */}
              <div className="lg:hidden p-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">View:</span>
                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setMobileArchTab('files')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      mobileArchTab === 'files'
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    📁 Files ({filteredFiles.length})
                  </button>
                  <button
                    onClick={() => setMobileArchTab('code')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      mobileArchTab === 'code'
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    📝 Code ({selectedFile.name})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800 flex-1">
                {/* Virtual File System Explorer */}
                <div className={`lg:col-span-4 p-4 bg-zinc-950/90 text-xs flex flex-col justify-between ${
                  mobileArchTab === 'files' ? 'block' : 'hidden lg:flex'
                }`}>
                  <div>
                    <div className="text-zinc-400 font-semibold mb-3 px-2 flex items-center justify-between">
                      <span>WORKSPACE EXPLORER</span>
                      <span className="text-[10px] text-cyan-400 font-bold">VFS MOUNTED</span>
                    </div>

                    {/* File Search */}
                    <div className="relative mb-3">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
                      <input
                        type="text"
                        value={fileSearchQuery}
                        onChange={(e) => setFileSearchQuery(e.target.value)}
                        placeholder="Search files..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="space-y-1">
                      {filteredFiles.map((file) => (
                        <button
                          key={file.path}
                          onClick={() => {
                            setSelectedFile(file);
                            setMobileArchTab('code');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                            selectedFile.path === file.path
                              ? 'bg-violet-950/50 border border-violet-500/40 text-white font-medium'
                              : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            {file.language === 'json' ? (
                              <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : file.language === 'python' ? (
                              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            )}
                            <span className="truncate">{file.name}</span>
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase">{file.language}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
                    <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AST Contract Invariant:</span>
                    </div>
                    <p className="font-sans text-xs">
                      All components are bound to <strong className="text-zinc-200">mockData.ts</strong> and <strong className="text-zinc-200">theme.json</strong>. Zero placeholder omissions allowed.
                    </p>
                  </div>
                </div>

                {/* Code / AST Viewer Panel */}
                <div className={`lg:col-span-8 p-4 bg-zinc-950 flex flex-col justify-between ${
                  mobileArchTab === 'code' ? 'block' : 'hidden lg:flex'
                }`}>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 text-xs text-zinc-400 mb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-200 font-medium">{selectedFile.path}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-cyan-400 text-[11px]">{selectedFile.language.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Mode Toggle */}
                      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px]">
                        <button
                          onClick={() => setCodeViewMode('source')}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            codeViewMode === 'source' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Source
                        </button>
                        <button
                          onClick={() => setCodeViewMode('ast')}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            codeViewMode === 'ast' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          AST Tree
                        </button>
                        <button
                          onClick={() => setCodeViewMode('deps')}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            codeViewMode === 'deps' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Deps
                        </button>
                      </div>

                      <button
                        onClick={handleInjectCodeBug}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60 text-[11px] transition-colors"
                        title="Inject error on this file to test Patcher Agent"
                      >
                        <Bug className="w-3 h-3 text-amber-400" />
                        <span>Inject Bug</span>
                      </button>

                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={handleDownloadFile}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        title="Download File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Render Mode: Source vs AST vs Dependencies */}
                  {codeViewMode === 'source' && (
                    <div className="relative rounded-xl border border-zinc-900 bg-zinc-950/80 max-h-[380px] overflow-y-auto">
                      <div className="flex">
                        {/* Line Numbers */}
                        <div className="select-none py-4 px-3 text-right text-zinc-600 bg-zinc-950 border-r border-zinc-900 text-xs">
                          {selectedFile.content.split('\n').map((_, i) => (
                            <div key={i} className={injectedBugLine === i + 1 ? 'text-rose-400 font-bold' : ''}>
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        {/* Source Code Content */}
                        <pre className="p-4 font-mono text-xs text-zinc-300 overflow-x-auto flex-1 leading-relaxed">
                          <code>{selectedFile.content}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {codeViewMode === 'ast' && (
                    <pre className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 font-mono text-xs text-cyan-300 overflow-x-auto max-h-[380px] leading-relaxed">
                      <code>{JSON.stringify({
                        type: 'Program',
                        sourceType: 'module',
                        body: [
                          {
                            type: 'ImportDeclaration',
                            source: { value: 'react' },
                            specifiers: ['useState', 'useEffect']
                          },
                          {
                            type: 'ExportDefaultDeclaration',
                            declaration: {
                              type: 'FunctionDeclaration',
                              id: { name: selectedFile.name.replace(/\.[^/.]+$/, '') },
                              params: [],
                              body: { type: 'BlockStatement', bodyStatementsCount: selectedFile.content.split('\n').length }
                            }
                          }
                        ],
                        comments: [],
                        tokens: selectedFile.content.split(/\s+/).length,
                        checksum: 'sha256-d41d8cd98f00b204e9800998ecf8427e'
                      }, null, 2)}</code>
                    </pre>
                  )}

                  {codeViewMode === 'deps' && (
                    <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 text-xs space-y-3">
                      <div className="text-zinc-300 font-bold mb-2">Verified AST Dependencies (OWASP Pass):</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                          <span className="text-white">react</span>
                          <span className="text-emerald-400 text-[10px]">^19.0.0 (Verified)</span>
                        </div>
                        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                          <span className="text-white">lucide-react</span>
                          <span className="text-emerald-400 text-[10px]">^1.16.0 (Verified)</span>
                        </div>
                        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                          <span className="text-white">tailwindcss</span>
                          <span className="text-emerald-400 text-[10px]">^4.0.0 (Verified)</span>
                        </div>
                        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                          <span className="text-white">@types/node</span>
                          <span className="text-emerald-400 text-[10px]">^22.14.0 (Pinned)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-xs text-zinc-400 flex items-center justify-between">
                  <span>{selectedFile.description}</span>
                  <span className="text-violet-400">Validated by Nexus Architect</span>
                </div>
              </div>
            </div>
          </div>
        )}

          {/* TAB 3: MULTI-AGENT STREAM WITH FILTERING & PROMPT EXECUTION */}
          {activeTab === 'chat' && (
            <div className="p-5 bg-zinc-950/95 text-xs min-h-[520px] flex flex-col justify-between">
              {/* Terminal Stream Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 text-[11px] text-zinc-400 gap-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-zinc-200 font-semibold">
                    {isSimulating ? 'AI AGENTS COMPOSING & STREAMING IN REAL-TIME...' : 'BLACKBOARD SYNCED · CLUSTER IDLE'}
                  </span>
                </div>

                {/* Filter logs by agent */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-zinc-500">Filter Agent:</span>
                  {(['all', 'Planner', 'Architect', 'Coder', 'Compiler', 'Patcher', 'Reviewer', 'Sandbox'] as const).map((ag) => (
                    <button
                      key={ag}
                      onClick={() => setAgentFilter(ag)}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                        agentFilter === ag
                          ? 'bg-violet-600 text-white font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {ag}
                    </button>
                  ))}
                  <button
                    onClick={() => setTerminalLogs([])}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 ml-1"
                    title="Clear Log History"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Log Stream Container */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 mt-3">
                {filteredLogs.map((log) => {
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
                          speed={typingSpeedMs}
                          onComplete={processNextLog}
                        />
                      </div>
                    </div>
                  );
                })}
                <div ref={logsEndRef} />
              </div>

              {/* One-Click Prompt Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 pb-1 text-[11px] text-zinc-400">
                <span className="text-zinc-500 mr-1">Suggestions:</span>
                {[
                  '⚡ Add WebSocket real-time ticker stream',
                  '🇪🇺 Verify EU AI Act Article 14 invariant',
                  '🛡️ Scan OWASP Top 10 for GenAI',
                  '🇸🇰 Generate Slovak VAT & SK-NIC tender integration'
                ].map((sugg) => (
                  <button
                    key={sugg}
                    onClick={() => {
                      setCustomPromptInput(sugg);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-[10px]"
                  >
                    {sugg}
                  </button>
                ))}
              </div>

              {/* Custom Prompt Input Bar */}
              <form onSubmit={handleCustomPromptSubmit} className="mt-2 pt-3 border-t border-zinc-800 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">&gt;</span>
                <input
                  type="text"
                  value={customPromptInput}
                  onChange={(e) => setCustomPromptInput(e.target.value)}
                  placeholder={`Type any feature or prompt (e.g., "${selectedPreset.prompt}")...`}
                  className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 text-xs outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSimulating ? 'Composing...' : 'Execute Swarm'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: DAG STATE ENGINE (DIRECTED ACYCLIC GRAPH) */}
          {activeTab === 'dag' && (
            <div className="bg-zinc-950/90 min-h-[520px]">
              <DagVisualizer
                activeAgent={currentActiveAgent}
                selfHealPhase={selfHealPhase}
              />
            </div>
          )}

          {/* TAB 5: INTERACTIVE WEBCONTAINERS WASM CLI SHELL */}
          {activeTab === 'cli' && (
            <div className="bg-zinc-950 min-h-[520px]">
              <InteractiveCli
                onTriggerSelfHealing={handleTriggerSelfHealingDemo}
              />
            </div>
          )}

          {/* TAB 6: COMPLIANCE AUDIT (EU AI ACT) */}
          {activeTab === 'compliance' && (
            <div className="p-6 bg-zinc-950/90 min-h-[520px] flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 mb-6 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">EU AI Act &amp; Security Compliance Ledger</h3>
                    <p className="text-xs text-zinc-400 mt-1 font-sans">
                      Continuous real-time verification against European Union High-Risk AI Invariants and OWASP Top 10 for Agentic AI.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunComplianceAudit}
                      disabled={isAuditingRules}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAuditingRules ? 'animate-spin' : ''}`} />
                      <span>{isAuditingRules ? 'Verifying Invariants...' : 'Verify All Rules'}</span>
                    </button>
                  </div>
                </div>

                {auditSuccessMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{auditSuccessMsg}</span>
                  </div>
                )}

                {/* Filter tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs text-zinc-400">Filter Standard:</span>
                  {(['all', 'EU AI Act', 'OWASP GenAI', 'GDPR / Sovereign AI'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setComplianceFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
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
                        <span className="text-xs text-violet-400 font-semibold">
                          {rule.standard} · {rule.article}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {rule.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{rule.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rule.description}</p>
                      <div className="pt-2 text-[11px] text-zinc-400 border-t border-zinc-800/60">
                        <strong>Audit Evidence:</strong> {rule.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
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
