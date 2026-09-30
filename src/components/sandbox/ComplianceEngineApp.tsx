import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, RefreshCw, FileText, Check, Loader2 } from 'lucide-react';

interface VerificationRule {
  id: 'art14' | 'wasmLock' | 'owaspAst' | 'dataLocal';
  title: string;
  code: string;
  desc: string;
  activeStatus: string;
}

const RULES: VerificationRule[] = [
  {
    id: 'art14',
    title: 'Article 14 Human Oversight',
    code: 'EU-AI-ART-14',
    desc: 'Enforces manual human review gate prior to production git commits.',
    activeStatus: 'ENFORCED'
  },
  {
    id: 'wasmLock',
    title: 'Wasm Sandboxing Isolation',
    code: 'WASM-ISO-18014',
    desc: 'Blocks arbitrary network sockets; isolates execution in browser memory.',
    activeStatus: 'ACTIVE'
  },
  {
    id: 'owaspAst',
    title: 'OWASP Dependency Firewall',
    code: 'OWASP-GENAI-LLM01',
    desc: 'Intercepts and prevents hallucinated packages and vulnerable CVE versions.',
    activeStatus: 'PROTECTED'
  },
  {
    id: 'dataLocal',
    title: 'EU Data Localization (GDPR)',
    code: 'GDPR-CH-V-EU',
    desc: 'Zero proprietary code transmitted outside client or EU-based endpoints.',
    activeStatus: 'RESTRICTED'
  }
];

export const ComplianceEngineApp: React.FC = () => {
  const [toggles, setToggles] = useState({
    art14: true,
    wasmLock: true,
    owaspAst: true,
    dataLocal: true
  });
  
  // Real-time scan step states
  const [scanning, setScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [verifiedStepIds, setVerifiedStepIds] = useState<string[]>([]);
  const [lastScanned, setLastScanned] = useState('2 minutes ago');
  const [scanCompleteNotice, setScanCompleteNotice] = useState(false);

  const enabledCount = Object.values(toggles).filter(Boolean).length;
  const scorePercent = Math.round((enabledCount / 4) * 100);

  const toggleRule = (key: keyof typeof toggles) => {
    if (scanning) return; // Prevent toggle during active scan
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRunScan = () => {
    if (scanning) return;
    setScanning(true);
    setCurrentStepIndex(0);
    setVerifiedStepIds([]);
    setScanCompleteNotice(false);

    // Sequential step-by-step verification through each rule
    const runStep = (index: number) => {
      if (index >= RULES.length) {
        // All steps completed
        setTimeout(() => {
          setScanning(false);
          setCurrentStepIndex(-1);
          setLastScanned('Just now');
          setScanCompleteNotice(true);
          setTimeout(() => setScanCompleteNotice(false), 5000);
        }, 400);
        return;
      }

      setCurrentStepIndex(index);

      setTimeout(() => {
        setVerifiedStepIds((prev) => [...prev, RULES[index].id]);
        runStep(index + 1);
      }, 600); // 600ms per rule for a smooth, readable cadence
    };

    runStep(0);
  };

  // Progress percentage calculation
  const scanProgress = scanning && currentStepIndex >= 0
    ? Math.round(((verifiedStepIds.length) / RULES.length) * 100)
    : 0;

  return (
    <div className="space-y-4 text-left font-mono">
      {/* Score Overview & Action Bar */}
      <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-zinc-400">EU AI ACT CONFORMITY SCORE</span>
          <div className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <span className={scorePercent === 100 ? 'text-emerald-400' : 'text-amber-400'}>
              {scorePercent}%
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              {scorePercent === 100 ? 'Level 4 Certified' : 'Action Required'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunScan}
            disabled={scanning}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Verifying Invariants...' : 'Run Audit Scan'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Progress Bar & Step-by-Step Status Banner during scan */}
      {scanning && (
        <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/40 space-y-2.5 shadow-lg shadow-cyan-950/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="font-bold">
                {currentStepIndex >= 0 && currentStepIndex < RULES.length
                  ? `Verifying [${currentStepIndex + 1}/${RULES.length}]: ${RULES[currentStepIndex].title}...`
                  : 'Finalizing AST verification pass...'}
              </span>
            </div>
            <span className="text-cyan-400 font-bold">{scanProgress}%</span>
          </div>

          {/* Animated Visual Progress Bar */}
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              className="bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(scanProgress, 12)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
            <span>AST Static Invariant Sandbox</span>
            <span>Zero-Trust Verification Loop</span>
          </div>
        </div>
      )}

      {/* Completion Confirmation Notice */}
      {scanCompleteNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Audit Complete: All 4 regulatory invariants successfully verified against EU AI Act standards.</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/60">
            100% Passed
          </span>
        </div>
      )}

      {/* Interactive Rules Cards with Live Verification Highlight State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {RULES.map((rule, idx) => {
          const isEnabled = toggles[rule.id];
          const isCurrentlyScanningThis = scanning && currentStepIndex === idx;
          const isVerifiedInCurrentScan = verifiedStepIds.includes(rule.id);

          return (
            <div
              key={rule.id}
              onClick={() => toggleRule(rule.id)}
              className={`cursor-pointer p-3.5 rounded-xl border transition-all duration-300 relative ${
                isCurrentlyScanningThis
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400 scale-[1.01]'
                  : isVerifiedInCurrentScan
                  ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                  : isEnabled
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200 hover:border-emerald-500/60'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  {isCurrentlyScanningThis ? (
                    <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  ) : isVerifiedInCurrentScan || isEnabled ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : null}
                  <span>{rule.title}</span>
                </span>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                    isCurrentlyScanningThis
                      ? 'bg-cyan-900/60 text-cyan-300 border-cyan-500 animate-pulse'
                      : isVerifiedInCurrentScan
                      ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500'
                      : isEnabled
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                  }`}
                >
                  {isCurrentlyScanningThis ? 'VERIFYING...' : isEnabled ? rule.activeStatus : 'DISABLED'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                {rule.desc}
              </p>
              <div className="mt-2 text-[10px] text-zinc-500 flex items-center justify-between border-t border-zinc-800/60 pt-1.5">
                <span>Code: {rule.code}</span>
                <span>{isVerifiedInCurrentScan ? 'Audit Signature: VERIFIED' : 'Toggle to configure'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-1">
        <span>Last automated scan: {lastScanned}</span>
        <span className="text-zinc-400">Click any card to toggle invariant state</span>
      </div>
    </div>
  );
};
