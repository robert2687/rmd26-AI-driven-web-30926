import React, { useState } from 'react';
import { BrainCircuit, Network, Code2, ShieldCheck, Wrench, Cpu, CheckCircle2, AlertTriangle, ArrowRight, Play, Check, Clock } from 'lucide-react';

export interface DagNode {
  id: string;
  name: string;
  role: string;
  agent: string;
  status: 'idle' | 'running' | 'completed' | 'healed' | 'error';
  inputs: string[];
  outputs: string[];
  latency: string;
  description: string;
}

interface DagVisualizerProps {
  activeAgent?: string;
  selfHealPhase?: 'idle' | 'crash' | 'medic' | 'restored';
  onSelectNode?: (nodeId: string) => void;
}

export const DagVisualizer: React.FC<DagVisualizerProps> = ({
  activeAgent = 'Planner',
  selfHealPhase = 'idle',
  onSelectNode
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('planner');

  const nodes: DagNode[] = [
    {
      id: 'planner',
      name: 'Planner Agent',
      role: 'Intent Parsing & DAG Generation',
      agent: 'Planner',
      status: activeAgent === 'Planner' ? 'running' : 'completed',
      inputs: ['User Natural Language Intent', 'Target Constraints'],
      outputs: ['Execution Graph DAG', 'mockData.ts Seed Contract'],
      latency: '24ms',
      description: 'Decomposes intent into actionable task graph and provisions mockData contracts to eliminate hollow UI.'
    },
    {
      id: 'architect',
      name: 'Nexus Architect',
      role: 'VFS Mount & AST Scaffolding',
      agent: 'Architect',
      status: activeAgent === 'Architect' ? 'running' : (['Coder', 'Reviewer', 'Compiler', 'Patcher', 'Sandbox'].includes(activeAgent) ? 'completed' : 'idle'),
      inputs: ['DAG Task Plan', 'Component Hierarchy Specs'],
      outputs: ['In-Memory VFS Tree', 'theme.json Token Layer'],
      latency: '18ms',
      description: 'Mounts in-browser virtual file system, configures module exports, and enforces design token contracts.'
    },
    {
      id: 'coder',
      name: 'Spark Coder',
      role: 'Modular TypeScript Synthesis',
      agent: 'Coder',
      status: activeAgent === 'Coder' ? 'running' : (['Reviewer', 'Compiler', 'Patcher', 'Sandbox'].includes(activeAgent) ? 'completed' : 'idle'),
      inputs: ['VFS Topology', 'theme.json Tokens', 'mockData.ts'],
      outputs: ['App.tsx', 'Dashboard.tsx', 'types/index.ts'],
      latency: '95ms',
      description: 'Synthesizes clean, typed, modular TypeScript units bound strictly to injected design tokens.'
    },
    {
      id: 'reviewer',
      name: 'Sentinel Reviewer',
      role: 'OWASP & Dependency Firewall',
      agent: 'Reviewer',
      status: activeAgent === 'Reviewer' ? 'running' : (['Compiler', 'Patcher', 'Sandbox'].includes(activeAgent) ? 'completed' : 'idle'),
      inputs: ['Synthesized Source ASTs', 'CVE Vulnerability Registry'],
      outputs: ['0 Hallucinated Packages Stamp', 'WCAG AA Audit'],
      latency: '42ms',
      description: 'Audits ASTs against the OWASP Top 10 for GenAI, validating all package versions before compilation.'
    },
    {
      id: 'compiler',
      name: 'Compiler Validator',
      role: 'WebContainers Virtual Build',
      agent: 'Compiler',
      status: selfHealPhase === 'crash'
        ? 'error'
        : (activeAgent === 'Compiler' ? 'running' : (['Patcher', 'Sandbox'].includes(activeAgent) ? 'completed' : 'idle')),
      inputs: ['VFS Workspace', 'Vite / TypeScript Compiler Core'],
      outputs: ['Wasm Executable Bundle', 'Exit Code: 0 / 1 (stderr)'],
      latency: '112ms',
      description: 'Runs real npm build inside isolated WebContainers sandbox. Captures stderr divergence immediately.'
    },
    {
      id: 'patcher',
      name: 'The Medic (Patcher)',
      role: 'Autonomous Surgical Self-Healing',
      agent: 'Patcher',
      status: selfHealPhase === 'medic'
        ? 'running'
        : (selfHealPhase === 'restored' || activeAgent === 'Patcher' ? 'healed' : 'idle'),
      inputs: ['Compiler stderr Stream', 'AST Divergence Delta'],
      outputs: ['executeEdits() Patch', 'Regression Test Suite Pass'],
      latency: '82ms',
      description: 'Activated on compiler failure. Parses stderr, isolates AST node, and injects surgical diff in <120ms.'
    },
    {
      id: 'sandbox',
      name: 'Isolated Sandbox',
      role: 'Wasm Node.js Micro-OS Runtime',
      agent: 'Sandbox',
      status: activeAgent === 'Sandbox' || selfHealPhase === 'restored' ? 'completed' : 'idle',
      inputs: ['Compiled Bundle', 'Virtual TCP ServiceWorker'],
      outputs: ['localhost:3000 Active Port', 'Sub-5ms HMR Live Socket'],
      latency: '3.6ms',
      description: 'Hosts interactive live preview inside browser memory with zero cloud VM fees or remote egress.'
    }
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const getNodeColor = (status: DagNode['status']) => {
    switch (status) {
      case 'running':
        return 'border-cyan-400 bg-cyan-950/40 text-cyan-300 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/40';
      case 'completed':
        return 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300';
      case 'healed':
        return 'border-amber-400 bg-amber-950/40 text-amber-300 shadow-md shadow-amber-950/30';
      case 'error':
        return 'border-rose-500 bg-rose-950/40 text-rose-300 animate-pulse';
      default:
        return 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700';
    }
  };

  const getStatusBadge = (status: DagNode['status']) => {
    switch (status) {
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/50">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Executing
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
            <Check className="w-3 h-3 text-emerald-400" />
            Verified
          </span>
        );
      case 'healed':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40">
            <Wrench className="w-3 h-3 text-amber-400" />
            Self-Healed
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-500/50">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            Exit Code 1
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 border border-zinc-800">
            <Clock className="w-3 h-3 text-zinc-600" />
            Idle / Queue
          </span>
        );
    }
  };

  return (
    <div className="p-5 font-mono text-xs space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">Autonomous Multi-Agent DAG State Machine</span>
            <span className="px-2 py-0.5 rounded bg-violet-950 border border-violet-500/40 text-violet-300 text-[10px]">
              LangGraph State Engine
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-0.5">
            Real-time directed acyclic graph visualizing agent handoffs, input contracts, and self-healing loops.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span>Active Phase:</span>
          <span className="text-cyan-400 font-bold uppercase">{selfHealPhase !== 'idle' ? `Self-Healing (${selfHealPhase})` : activeAgent}</span>
        </div>
      </div>

      {/* Mobile Stage Stepper (Visible on mobile/tablet) */}
      <div className="sm:hidden space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
          <span>SELECT AGENT STAGE:</span>
          <span>{nodes.findIndex((n) => n.id === selectedNodeId) + 1} of {nodes.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {nodes.map((n, i) => (
            <button
              key={n.id}
              onClick={() => {
                setSelectedNodeId(n.id);
                if (onSelectNode) onSelectNode(n.id);
              }}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all truncate border ${
                selectedNodeId === n.id
                  ? 'bg-violet-600 text-white border-violet-400 shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {i + 1}. {n.agent}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Horizontal Flow Graph (Desktop / Wide View) */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="text-[10px] text-zinc-500 mb-1.5 sm:hidden flex items-center justify-between">
          <span>Interactive DAG Pipeline:</span>
          <span>← Swipe horizontally →</span>
        </div>
        <div className="flex items-center gap-3 min-w-[760px]">
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    if (onSelectNode) onSelectNode(node.id);
                  }}
                  className={`cursor-pointer w-44 rounded-xl p-3 border transition-all duration-200 flex flex-col justify-between shrink-0 ${getNodeColor(
                    node.status
                  )} ${isSelected ? 'scale-105 ring-2 ring-violet-500' : ''}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-zinc-400 font-semibold">STAGE 0{index + 1}</span>
                      {getStatusBadge(node.status)}
                    </div>
                    <div className="font-bold text-white text-xs truncate">{node.name}</div>
                    <div className="text-[11px] text-zinc-400 line-clamp-1">{node.role}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>Latency:</span>
                    <span className="font-semibold text-zinc-200">{node.latency}</span>
                  </div>
                </div>

                {index < nodes.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 text-zinc-600">
                    <ArrowRight className="w-4 h-4 text-violet-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Inspector */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{selectedNode.name}</span>
            <span className="text-zinc-500">·</span>
            <span className="text-violet-400 text-xs">{selectedNode.role}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-xs">Observed Latency: <strong className="text-cyan-400">{selectedNode.latency}</strong></span>
            {getStatusBadge(selectedNode.status)}
          </div>
        </div>

        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
          {selectedNode.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
            <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
              <span>INPUT CONTRACT ARTIFACTS</span>
            </div>
            <ul className="space-y-1 text-zinc-300 text-[11px]">
              {selectedNode.inputs.map((inp, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-cyan-500">➔</span>
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5">
              <span>OUTPUT VERIFIED GUARANTEES</span>
            </div>
            <ul className="space-y-1 text-zinc-300 text-[11px]">
              {selectedNode.outputs.map((out, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
