import React from 'react';
import { ShieldCheck, Lock, Database, FileCheck2, Cpu, Server, Check, ArrowRight, Shield, Scale } from 'lucide-react';
import shieldAsset from '../assets/images/security_compliance_shield_1790742931407.jpg';
import containerAsset from '../assets/images/sandbox_container_cube_1790742921146.jpg';
import { LegalTab } from './LegalModal';

interface SecurityComplianceProps {
  onOpenLegalModal?: (tab: LegalTab) => void;
}

export const SecurityCompliance: React.FC<SecurityComplianceProps> = ({ onOpenLegalModal }) => {
  return (
    <section id="security" className="py-24 relative bg-zinc-950 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>SOVEREIGN DATA INFRASTRUCTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Deterministic Security &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              EU AI Act Compliance
            </span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-6">
            Enterprise and public sector engineering teams cannot risk unvetted cloud leaks or hallucinated code. Sovereign Architect provides mathematically verifiable sandboxing and local-first execution.
          </p>

          {/* Quick Legal Disclosures Access Bar */}
          {onOpenLegalModal && (
            <div className="inline-flex flex-wrap items-center justify-center gap-3 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 font-mono text-xs">
              <button
                onClick={() => onOpenLegalModal('disclosures')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>EU AI Act Disclosures (Art. 50 &amp; 14)</span>
              </button>
              <button
                onClick={() => onOpenLegalModal('privacy')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 text-cyan-300 hover:text-white border border-zinc-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>GDPR Privacy Policy</span>
              </button>
              <button
                onClick={() => onOpenLegalModal('terms')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 text-violet-300 hover:text-white border border-zinc-800 transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-violet-400" />
                <span>Terms of Service</span>
              </button>
            </div>
          )}
        </div>

        {/* 3-Column Core Architecture Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Column 1: On-Premise & Local-First WebContainers */}
          <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/50 backdrop-blur-xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-cyan-400 mb-6 shadow-inner">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Local-First &amp; Air-Gapped Sandboxing
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Execution runs inside WebContainers (Wasm micro-kernel) within the user&apos;s browser memory. Zero cloud virtual machine per-minute costs and zero network hops.
              </p>
              <ul className="space-y-3 font-mono text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Sub-5ms Hot Module Reload (HMR)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Zero server-side code telemetry egress</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Compatible with offline &amp; air-gapped VPCs</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
              Standard: WebAssembly ISO/IEC 18014
            </div>
          </div>

          {/* Column 2: EU AI Act & Data Localization */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-xl p-8 flex flex-col justify-between hover:border-emerald-500/50 transition-colors relative shadow-xl shadow-emerald-950/20">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
              EU CERTIFIED
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 mb-6 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                EU AI Act Article 14 Compliance
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Designed to satisfy stringent EU High-Risk AI mandates. Ensures continuous human oversight, deterministic validation logs, and localized EU-only data processing.
              </p>
              <ul className="space-y-3 font-mono text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Mandatory Human-in-the-Loop review gates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>SK-NIC &amp; Horizon Europe grant ready</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>OWASP GenAI Top 10 automated scanner</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-800/80 text-xs font-mono text-emerald-400">
              Certified: EU AI Act (Regulation 2024/1689)
            </div>
          </div>

          {/* Column 3: Shared Memory Context (Contextual Blackboard) */}
          <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/50 backdrop-blur-xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-violet-400 mb-6 shadow-inner">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                SharedContext Blackboard Architecture
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Prevents hallucination drift across agents. A strictly typed JSON memory blackboard shared via LangGraph state machines guarantees that every agent sees identical logs and file trees.
              </p>
              <ul className="space-y-3 font-mono text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>Typed JSON schema prevents context drift</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>Patcher accesses exact compiler stderr streams</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-violet-400" />
                  <span>Cyclic state machine limits retries to 3</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400">
              Protocol: LangGraph Cyclic State Graph
            </div>
          </div>
        </div>

        {/* Visual Proof Banner with Generated High-Fidelity Assets */}
        <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-r from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-8 flex flex-col lg:flex-row items-center gap-8 overflow-hidden">
          <div className="w-full lg:w-1/3 aspect-[4/3] rounded-xl overflow-hidden border border-zinc-800 shadow-xl relative group">
            <img
              src={shieldAsset}
              alt="Cryptographic security compliance shield"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 text-[11px] font-mono text-emerald-300 bg-zinc-950/80 px-2.5 py-1 rounded border border-emerald-900/60">
              EU Sovereign Compliance Core
            </div>
          </div>

          <div className="w-full lg:w-2/3 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-violet-400">
              <FileCheck2 className="w-4 h-4" />
              <span>INDEPENDENT SECURITY AUDIT VERIFICATION</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Eliminating the &ldquo;Code into the Void&rdquo; Hazard
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              According to Georgetown CSET research, over 50% of raw AI-generated code contains bugs or security vulnerabilities, and 21% of dependency references in legacy LLM responses are hallucinated. Sovereign Architect resolves this by requiring empirical verification in a deterministic WebContainers sandbox before any code is approved.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="text-lg font-bold font-mono text-emerald-400">0%</span>
                <span className="block text-[11px] text-zinc-400">Hallucinated Packages</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="text-lg font-bold font-mono text-cyan-400">100%</span>
                <span className="block text-[11px] text-zinc-400">Human Override Ready</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                <span className="text-lg font-bold font-mono text-violet-400">&lt;120ms</span>
                <span className="block text-[11px] text-zinc-400">Patcher Healing Speed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
