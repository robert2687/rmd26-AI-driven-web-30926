import React, { useState } from 'react';
import { Terminal, Shield, ArrowRight, CheckCircle2, Cpu, Github, Twitter, Linkedin, Sparkles, Lock, Scale, FileText } from 'lucide-react';
import { LegalTab } from './LegalModal';

interface FooterProps {
  onOpenConsole: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenLegalModal: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsole, onNavigateSection, onOpenLegalModal }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid enterprise or developer email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/80 overflow-hidden w-full">
      {/* High-Impact CTA Banner */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="relative rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-6 sm:p-14 text-center overflow-hidden shadow-2xl">
          {/* Subtle glow cloud */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 max-w-full h-80 sm:h-96 bg-violet-600/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>EARLY DEVELOPER ACCESS &amp; ENTERPRISE SANDBOX</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to transition from writing syntax to an{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
                architecture of intent?
              </span>
            </h2>

            <p className="text-zinc-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Join engineering teams deploying autonomous self-healing agent pipelines with zero cloud VM fees, sub-5ms Wasm execution, and full EU AI Act compliance.
            </p>

            {/* Email Capture Form */}
            {submitted ? (
              <div className="max-w-md mx-auto p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-sm flex items-center justify-center gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verification link dispatched. Welcome to Sovereign Architect.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your developer email..."
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-violet-950/40 transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Request Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && (
                  <p className="text-xs font-mono text-rose-400 mt-2 text-left">{error}</p>
                )}
                <div className="mt-3 text-xs font-mono text-zinc-500 flex items-center justify-center gap-4">
                  <span>🔒 Air-gapped SDK</span>
                  <span>·</span>
                  <span>⚡ WebContainers Wasm</span>
                  <span>·</span>
                  <span>🇪🇺 EU Data Localization</span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-16 pb-12 border-b border-zinc-800/80">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-4">
              Platform &amp; Core
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <button onClick={() => onNavigateSection('architecture')} className="hover:text-white transition-colors">
                  Closed-Loop Self-Healing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('terminal-demo')} className="hover:text-white transition-colors">
                  Interactive Terminal Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('agents')} className="hover:text-white transition-colors">
                  Specialist Symphony
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('roadmap')} className="hover:text-cyan-400 transition-colors">
                  Development Roadmap
                </button>
              </li>
              <li>
                <button onClick={onOpenConsole} className="hover:text-white transition-colors">
                  Console Launcher
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-4">
              Specialized Agents
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <span className="text-zinc-300">Planner Agent</span> (DAG &amp; mockData)
              </li>
              <li>
                <span className="text-zinc-300">Nexus Architect</span> (VFS &amp; AST)
              </li>
              <li>
                <span className="text-zinc-300">Spark Coder</span> (theme.json Tokens)
              </li>
              <li>
                <span className="text-zinc-300">The Patcher (Medic)</span> (Auto-Fix)
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-4">
              Security &amp; Grants
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <button onClick={() => onOpenLegalModal('disclosures')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left">
                  <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>EU AI Act Disclosures</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegalModal('privacy')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left">
                  <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>GDPR Privacy Charter</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegalModal('terms')} className="hover:text-violet-400 transition-colors flex items-center gap-1.5 text-left">
                  <Scale className="w-3 h-3 text-violet-400 shrink-0" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <span className="text-zinc-400">SK-NIC Fund Track (SKNICVP26)</span>
              </li>
              <li>
                <span className="text-zinc-400">OWASP Top 10 for GenAI</span>
              </li>
              <li>
                <span className="text-zinc-400">Zero Cloud VM Egress</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold mb-4">
              Initiative &amp; Author
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Crafted by <strong>RMD26 (Róbert Málik)</strong> as part of the Slovak Copilot and Sovereign Architect autonomous software engineering research program.
            </p>
            <div className="text-xs font-mono text-violet-400">
              Želovce, Slovakia · European Union
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span className="text-zinc-400">
              SOVEREIGN // ARCHITECT &copy; 2026. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="text-zinc-400 hover:text-cyan-400 transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="text-zinc-400 hover:text-violet-400 transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenLegalModal('disclosures')}
              className="text-zinc-400 hover:text-emerald-400 transition-colors underline-offset-4 hover:underline"
            >
              EU AI Act Disclosures
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
