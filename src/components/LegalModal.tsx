import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, Scale, Check, Copy, ExternalLink, Lock, Globe, Cpu, AlertCircle, ArrowUpRight } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'disclosures';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyNotice = () => {
    const textToCopy = `RMD26 Sovereign Architect Legal Notice - ${activeTab.toUpperCase()}\nDocument Reference: EU-SLA-2026-RMD26\nController: RMD26 (Róbert Málik), Želovce, Slovak Republic (EU)\nContact: rm26@rmd26.com\nCompliance: GDPR (EU) 2016/679 | EU AI Act (EU) 2024/1689`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 font-mono">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/90 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-cyan-400">
              {activeTab === 'privacy' && <Lock className="w-4 h-4 text-cyan-400" />}
              {activeTab === 'terms' && <Scale className="w-4 h-4 text-violet-400" />}
              {activeTab === 'disclosures' && <Shield className="w-4 h-4 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-wide">
                  RMD26 Sovereign Legal &amp; Regulatory Portal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  EU 2026/1689 Compliant
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official legal charters, data sovereignty commitments &amp; statutory disclosures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNotice}
              title="Copy citation"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Cite'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-zinc-800/60 bg-zinc-950/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'privacy'
                ? 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'terms'
                ? 'bg-violet-950/50 border border-violet-500/50 text-violet-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('disclosures')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'disclosures'
                ? 'bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>EU AI Act Disclosures (Art. 50 &amp; 14)</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed font-sans select-text">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
                <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-sm font-bold text-white mb-1">
                    GDPR &amp; Zero-Telemetry Sovereign Privacy Commitment
                  </h4>
                  <p className="text-zinc-400 text-xs">
                    In compliance with the General Data Protection Regulation (Regulation (EU) 2016/679) and the European Union charter of fundamental rights. Effective date: January 1, 2026.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-cyan-300">
                  1. Data Controller Identification
                </h3>
                <p>
                  The data controller responsible for the processing of personal data on this platform is:
                </p>
                <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1">
                  <div><strong>Entity / Brand:</strong> RMD26 (Róbert Málik)</div>
                  <div><strong>Location:</strong> Želovce, Slovak Republic, European Union</div>
                  <div><strong>Email Contact:</strong> rm26@rmd26.com</div>
                  <div><strong>Research Umbrella:</strong> Slovak Copilot &amp; Sovereign Autonomous Architect Initiative</div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-cyan-300">
                  2. Architectural Zero-Telemetry Guarantee
                </h3>
                <p>
                  Unlike legacy cloud coding platforms that mirror your proprietary codebases to unverified remote servers, <strong>RMD26 Sovereign Architect</strong> executes code compilation, AST parsing, and hot reload locally inside your browser via client-side WebContainers (WebAssembly isolation).
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
                  <li><strong>Zero Source Code Transmission:</strong> Your private file tree and business logic remain inside client memory and are never harvested for foundation model training.</li>
                  <li><strong>Ephemeral Sandbox Execution:</strong> In-browser virtual file system (VFS) states are wiped upon session termination.</li>
                  <li><strong>No Third-Party Ad Trackers:</strong> We deploy zero third-party advertising cookies, pixels, or behavioral telemetry beacons.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-cyan-300">
                  3. Information We Collect
                </h3>
                <p>
                  We minimize data collection to the absolute technical minimum:
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
                  <li><strong>Voluntary Early Access Submissions:</strong> When you request early developer or enterprise access, we store your provided email address solely to dispatch authorization credentials and technical release notes.</li>
                  <li><strong>Client-Side Configuration:</strong> Local preference keys (such as active UI themes or preset selection) stored in your browser&apos;s localStorage for your convenience.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-cyan-300">
                  4. Your Statutory GDPR Rights
                </h3>
                <p>
                  Under Articles 15 through 22 of the GDPR, you have the right to:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-white font-bold block">Right to Access (Art. 15):</span> Request confirmation and copies of any personal records.
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-white font-bold block">Right to Erasure (Art. 17):</span> Request complete deletion (&apos;Right to be Forgotten&apos;).
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-white font-bold block">Right to Restrict (Art. 18):</span> Limit processing under specified circumstances.
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800">
                    <span className="text-white font-bold block">Right to Portability (Art. 20):</span> Receive data in a structured, machine-readable format.
                  </div>
                </div>
                <p className="pt-1">
                  To exercise any of these statutory rights, transmit your request directly to <strong>rm26@rmd26.com</strong>. Requests are acknowledged and addressed within 30 calendar days.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-cyan-300">
                  5. Supervisory Authority
                </h3>
                <p>
                  If you believe data processing infringes GDPR standards, you have the statutory right to lodge a complaint with the Slovak Data Protection Authority (Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk) or your local EU Member State supervisory authority.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 flex items-start gap-3">
                <Scale className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-sm font-bold text-white mb-1">
                    Software Architecture &amp; Developer Terms of Service
                  </h4>
                  <p className="text-zinc-400 text-xs">
                    Governing access to the RMD26 Sovereign Architect platform, autonomous multi-agent simulation runtimes, and synthetic AST tools.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-violet-300">
                  1. Acceptance of Terms &amp; Scope
                </h3>
                <p>
                  By accessing, browsing, or utilizing the RMD26 Sovereign Architect application, terminal simulators, or agent orchestration pipelines, you enter into a binding legal agreement with RMD26 under the laws of the Slovak Republic and applicable European Union regulations.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-violet-300">
                  2. 100% User Ownership of Generated Code &amp; Artifacts
                </h3>
                <p className="text-white font-medium">
                  You retain full, unrestricted intellectual property rights, commercial copyright, and title to all source code, architecture specifications, mock data models, and AST representations synthesized by the autonomous agents on your behalf.
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
                  <li><strong>No Royalties:</strong> RMD26 claims zero licensing royalties, patent encumbrances, or downstream commercial claims on applications designed through this platform.</li>
                  <li><strong>Commercial Deployment:</strong> You are free to compile, export, containerize, and deploy all generated code for proprietary, open-source, or commercial enterprise applications.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-violet-300">
                  3. Acceptable Use Policy &amp; Safety Guardrails
                </h3>
                <p>
                  Users may not utilize RMD26 Sovereign Architect to develop, synthesize, or distribute:
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
                  <li>Malicious payloads, ransomware, exploit generation toolkits, or automated vulnerability weaponry.</li>
                  <li>Applications designed to violate the European Union AI Act prohibitions (e.g., untargeted social scoring, biometric categorization for sensitive attributes, or subliminal manipulation).</li>
                  <li>Tools intentionally engineered to deceive end-users regarding human versus artificial origin in violation of Article 50 of the EU AI Act.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-violet-300">
                  4. Automated Self-Healing &amp; Verification Disclaimer
                </h3>
                <p>
                  While our multi-agent closed-loop paradigm (The Medic AST Patcher, Compiler Validator, and Reviewer Agent) enforces strict static type safety, deterministic mockData contracts, and zero fatal errors, software synthesized by artificial intelligence should be tested in staging environments prior to production rollout in critical enterprise systems.
                </p>
                <p className="text-zinc-400">
                  THE SOFTWARE AND SIMULATIONS ARE PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-violet-300">
                  5. Governing Law &amp; Dispute Resolution
                </h3>
                <p>
                  These Terms of Service are governed by and construed in accordance with the substantive laws of the Slovak Republic, without regard to conflict of law principles. Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of the Slovak Republic.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: EU AI ACT DISCLOSURES */}
          {activeTab === 'disclosures' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-sm font-bold text-white mb-1">
                    Statutory Disclosures under Regulation (EU) 2024/1689 (EU AI Act)
                  </h4>
                  <p className="text-zinc-400 text-xs">
                    Comprehensive compliance declaration, transparency registry, and human oversight technical architecture.
                  </p>
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-emerald-300">
                  1. Article 50: AI Transparency &amp; Artificial Origin Notice
                </h3>
                <p>
                  Pursuant to Article 50(1) and 50(2) of the EU AI Act, end-users and developers are hereby formally notified:
                </p>
                <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                    <Check className="w-4 h-4" />
                    <span>Machine-Generated Code Notification</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    The software architectures, source code files, and configuration schemas presented in the terminal and interactive sandbox are generated by specialized artificial intelligence agents (Planner, Visual Designer, Architect, Spark Coder, Reviewer, and Patcher).
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-emerald-300">
                  2. Article 14: Technical Human-in-the-Loop Oversight Invariant
                </h3>
                <p>
                  High-risk and critical software deployment scenarios require human oversight mechanisms. RMD26 Sovereign Architect implements Article 14 through technical architecture:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
                  <li><strong>Human Committal Gate:</strong> Autonomous agents prepare and verify AST mutations in isolated virtual memory; no commits to production repositories occur without affirmative user trigger.</li>
                  <li><strong>Autonomous Execution Interrupter:</strong> Real-time kill switch enables immediate termination of swarm execution pipelines.</li>
                  <li><strong>Transparent Decision Blackboard:</strong> All agent decisions, intent decompositions, and compiler feedback are logged in an immutable, human-readable terminal stream.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-emerald-300">
                  3. Article 10: Data Governance &amp; Synthetic Invariant Contracts
                </h3>
                <p>
                  To eliminate phantom runtime errors and &quot;hollow UI&quot; bugs common in unconstrained AI coding tools, our system enforces deterministic data governance:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded bg-zinc-900/80 border border-zinc-800">
                    <span className="text-cyan-400 font-bold block mb-1">Contract 1: mockData.ts Mandate</span>
                    Every component is bound to rich synthetic data structures. Zero undefined references or unpopulated lists permitted.
                  </div>
                  <div className="p-3 rounded bg-zinc-900/80 border border-zinc-800">
                    <span className="text-violet-400 font-bold block mb-1">Contract 2: theme.json Tokens</span>
                    Strict token inheritance ensures compliance with WCAG AA accessibility contrast ratios without arbitrary color hallucination.
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-emerald-300">
                  4. Article 15: Accuracy, Robustness &amp; Cybersecurity
                </h3>
                <p>
                  Cybersecurity protection under the EU AI Act is anchored by:
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
                  <li><strong>OWASP Top 10 for Agentic AI Guardrails:</strong> Active interception of prompt injection, insecure output handling, and dependency supply chain vulnerabilities.</li>
                  <li><strong>Wasm Sandbox Isolation:</strong> Zero host kernel access; all executions occur inside air-gapped browser WebContainers.</li>
                  <li><strong>Continuous CVE Scanning:</strong> Dependency trees are validated against known security advisory registries.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider text-emerald-300">
                  5. Grant Alignment: Slovak SK-NIC Program Track
                </h3>
                <p className="text-zinc-400">
                  The RMD26 research initiative is formulated in strict alignment with Slovak National Domain (.SK) innovation guidelines (Call SKNICVP26_017, &apos;Slovenský Copilot&apos;), advancing open European technological sovereignty, ethical artificial intelligence, and regional competitiveness.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-zinc-800/90 bg-zinc-950 gap-3">
          <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>Slovak Republic · European Union Jurisdiction</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:rm26@rmd26.com"
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Contact Legal Office
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
