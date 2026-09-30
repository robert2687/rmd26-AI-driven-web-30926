import React, { useState } from 'react';
import { AGENT_ROLES } from '../data/mockData';
import { AgentRole } from '../types';
import { BrainCircuit, Network, Code2, ShieldCheck, Wrench, Cpu, Check, Terminal, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface AgentGridProps {
  onSelectAgentForDemo?: (agentId: string) => void;
}

export const AgentGrid: React.FC<AgentGridProps> = ({ onSelectAgentForDemo }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>(AGENT_ROLES[0]);

  const getAgentIcon = (iconName: string, color: string) => {
    const className = `w-6 h-6 ${
      color === 'violet' ? 'text-violet-400' :
      color === 'cyan' ? 'text-cyan-400' :
      color === 'emerald' ? 'text-emerald-400' :
      color === 'amber' ? 'text-amber-400' :
      color === 'rose' ? 'text-rose-400' : 'text-indigo-400'
    }`;
    switch (iconName) {
      case 'BrainCircuit': return <BrainCircuit className={className} />;
      case 'Network': return <Network className={className} />;
      case 'Code2': return <Code2 className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      default: return <BrainCircuit className={className} />;
    }
  };

  const getAgentBorder = (color: string, isSelected: boolean) => {
    if (isSelected) {
      return color === 'violet' ? 'border-violet-500 bg-violet-950/20 shadow-lg shadow-violet-900/20' :
             color === 'cyan' ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-900/20' :
             color === 'emerald' ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-900/20' :
             color === 'amber' ? 'border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-900/20' :
             color === 'rose' ? 'border-rose-500 bg-rose-950/20 shadow-lg shadow-rose-900/20' :
             'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-900/20';
    }
    return 'border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80';
  };

  return (
    <section id="agents" className="py-16 sm:py-24 relative bg-zinc-950 border-t border-zinc-800/60 w-full overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 mb-3">
            <span>COGNITIVE TASK DECOMPOSITION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            A Symphony of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
              Specialized Agents
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Monolithic AI coders fail because they blur planning, architecture, styling, and debugging into one hallucination-prone prompt. Sovereign Architect decouples cognition into discrete specialists governed by a shared contextual blackboard.
          </p>
        </div>

        {/* 6-Agent Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {AGENT_ROLES.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 backdrop-blur-xl flex flex-col justify-between ${getAgentBorder(
                  agent.color,
                  isSelected
                )}`}
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner">
                      {getAgentIcon(agent.avatarIcon, agent.color)}
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400">
                      {agent.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mb-4 line-clamp-1">
                    {agent.cognitiveFunction}
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    {agent.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold font-mono text-white">{agent.metric}</span>
                    <span className="block text-[10px] text-zinc-400 font-mono">{agent.metricLabel}</span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-violet-600 text-white border-violet-500'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
                  }`}>
                    {isSelected ? 'Inspecting' : 'View Spec'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Inspector for Selected Agent */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                {getAgentIcon(selectedAgent.avatarIcon, selectedAgent.color)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-white">{selectedAgent.name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                    Role: {selectedAgent.role}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  Cognitive Primitive: <strong className="text-zinc-200">{selectedAgent.cognitiveFunction}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">
                Performance Target: <span className="text-emerald-400 font-bold">{selectedAgent.metric} {selectedAgent.metricLabel}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Core Capabilities Checklist */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Deterministic Operational Invariants</span>
              </h4>
              <ul className="space-y-2.5">
                {selectedAgent.capabilities.map((cap, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Live Blackboard Memory Output */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SharedContext Blackboard Telemetry</span>
                </h4>
                <span className="text-[10px] font-mono text-zinc-400">JSON Payload</span>
              </div>
              <div className="flex-1 rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-300 border border-zinc-800/80 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                {selectedAgent.sampleOutput}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
