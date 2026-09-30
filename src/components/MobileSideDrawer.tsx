import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Cpu,
  Terminal,
  FolderTree,
  Activity,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  FileText,
  Shield,
  BarChart3,
  Calendar,
  Layers as LayersIcon
} from 'lucide-react';
import { LegalTab } from './LegalModal';
import { SIMULATION_PRESETS } from '../data/mockData';

interface MobileSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenConsole: () => void;
  onOpenLegalModal: (tab: LegalTab) => void;
}

export const MobileSideDrawer: React.FC<MobileSideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
  onOpenConsole,
  onOpenLegalModal
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navSections = [
    {
      id: 'architecture',
      label: 'Architecture',
      desc: 'Closed-loop compiler paradigm',
      icon: Cpu
    },
    {
      id: 'agents',
      label: 'Multi-Agent Engine',
      desc: '4 Core Roles & Specialist Symphony',
      icon: LayersIcon
    },
    {
      id: 'terminal-demo',
      label: 'Interactive Studio Demo',
      desc: 'Port 3000 WebContainers Sandbox',
      icon: Terminal
    },
    {
      id: 'security',
      label: 'Security & EU AI Act',
      desc: 'Article 14 Human Oversight & OWASP',
      icon: Shield
    },
    {
      id: 'comparison',
      label: 'Benchmarks & Latency',
      desc: 'Sub-5ms Wasm vs Cloud VMs',
      icon: BarChart3
    },
    {
      id: 'roadmap',
      label: 'Roadmap & Milestones',
      desc: 'Production rollout timeline',
      icon: Calendar
    }
  ];

  const studioFeatures = [
    { id: 'sandbox', label: 'Sandbox Output (Port 3000)', short: '⚡ Sandbox', color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-950/30' },
    { id: 'architecture', label: 'Architecture & AST Inspector', short: '🌲 AST & Code', color: 'text-violet-400', border: 'border-violet-500/40', bg: 'bg-violet-950/30' },
    { id: 'chat', label: 'Multi-Agent Stream (Live Chat)', short: '💬 Stream', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/30' },
    { id: 'dag', label: 'DAG State Machine (7 Nodes)', short: '🕸️ DAG Graph', color: 'text-indigo-400', border: 'border-indigo-500/40', bg: 'bg-indigo-950/30' },
    { id: 'cli', label: 'Wasm WebContainers CLI', short: '💻 Wasm Shell', color: 'text-zinc-200', border: 'border-zinc-700', bg: 'bg-zinc-900/60' },
    { id: 'compliance', label: 'EU AI Act Compliance Audit', short: '🇪🇺 EU Audit', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/30' }
  ];

  const handleSelectSection = (id: string) => {
    onNavigateSection(id);
    onClose();
  };

  const handleSelectStudioTab = (tabId: string) => {
    onNavigateSection('terminal-demo');
    window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: tabId }));
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[99999] transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Sliding Side Drawer Panel */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-[88vw] sm:w-96 max-w-[420px] bg-[#0c0c0e] border-l border-zinc-800/90 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out font-sans ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/90 bg-zinc-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-md shadow-violet-950/50 shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[9px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-sm text-white font-mono tracking-tight flex items-center gap-1.5">
                <span>RMD26 STUDIO</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                  PORT 3000
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>WebContainers Runtime Online</span>
              </div>
            </div>
          </div>

          {/* Close Button with >=44px touch target */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="w-11 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-6">
          {/* Section 1: All 6 Platform Navigation Sections */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-2.5">
              <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Application Sections:
              </span>
              <span className="text-[10px] font-mono text-zinc-600">6 Sections</span>
            </div>

            <div className="space-y-1.5">
              {navSections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    className="w-full min-h-[46px] p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-violet-500/50 transition-colors">
                        <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                          {sec.label}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">
                          {sec.desc}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: All 6 Studio Features Direct Jump */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-2.5">
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>All 6 Studio Features:</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Direct Jump</span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono">
              {studioFeatures.map((feat) => (
                <button
                  key={feat.id}
                  onClick={() => handleSelectStudioTab(feat.id)}
                  className={`p-2.5 rounded-xl ${feat.bg} border ${feat.border} hover:opacity-90 text-left transition-all flex flex-col justify-between min-h-[58px] cursor-pointer`}
                >
                  <span className={`text-xs font-bold ${feat.color} truncate`}>
                    {feat.short}
                  </span>
                  <span className="text-[9px] text-zinc-400 truncate mt-1">
                    {feat.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: In-Browser Demo Presets */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-2.5">
              <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Demo App Presets:
              </span>
              <span className="text-[10px] font-mono text-zinc-600">Port 3000</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SIMULATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onNavigateSection('terminal-demo');
                    window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'sandbox' }));
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800/80 text-left transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-white text-[11px] truncate flex items-center gap-1">
                    {preset.id === 'crypto-bot' && <span>🪙</span>}
                    {preset.id === 'saas-billing' && <span>💳</span>}
                    {preset.id === 'eu-compliance' && <span>🇪🇺</span>}
                    {preset.id === 'slovak-copilot' && <span>🇸🇰</span>}
                    <span className="truncate">{preset.title.split(' ')[0]}</span>
                  </div>
                  <div className="text-[9px] text-cyan-400 font-mono mt-0.5">
                    {preset.linesOfCode} LOC Compiled
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/90 bg-zinc-950 space-y-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              handleSelectStudioTab('sandbox');
            }}
            className="w-full min-h-[46px] px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-cyan-300" />
            <span>Launch Live Sandbox (Port 3000)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenConsole();
              onClose();
            }}
            className="w-full min-h-[42px] px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Open Studio Console Modal</span>
          </button>

          {/* Legal Modal Links for Regulatory Accessibility */}
          <div className="pt-2 flex items-center justify-center gap-3 text-[10px] font-mono text-zinc-500 border-t border-zinc-800/60">
            <button
              onClick={() => {
                onOpenLegalModal('privacy');
                onClose();
              }}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => {
                onOpenLegalModal('terms');
                onClose();
              }}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <span>·</span>
            <button
              onClick={() => {
                onOpenLegalModal('disclosures');
                onClose();
              }}
              className="text-cyan-400 hover:underline transition-colors cursor-pointer"
            >
              EU AI Act Art. 14
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
