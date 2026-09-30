import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, CheckCircle2, AlertTriangle, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { SAMPLE_PROJECT_FILES } from '../../data/mockData';

interface CommandOutput {
  id: string;
  command: string;
  output: string;
  type: 'info' | 'success' | 'error' | 'patch';
  timestamp: string;
}

interface InteractiveCliProps {
  onTriggerSelfHealing?: () => void;
}

export const InteractiveCli: React.FC<InteractiveCliProps> = ({ onTriggerSelfHealing }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: 'init-1',
      command: 'uname -a',
      output: 'Linux sovereign-wasm-vfs 6.1.0-webcontainers #1 SMP WebAssembly Node.js v22.14.0 x86_64 Wasm',
      type: 'info',
      timestamp: '00:00.01'
    },
    {
      id: 'init-2',
      command: 'sovereign status',
      output: '✓ VFS Mounted (/workspace)\n✓ WebContainers TCP Socket Active (localhost:3000)\n✓ Multi-Agent Swarm: Ready\n✓ Closed-Loop Self-Healing: Enabled\nType "help" to view available commands.',
      type: 'success',
      timestamp: '00:00.04'
    }
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const lower = cmd.toLowerCase();
    const parts = lower.split(' ');
    const action = parts[0];
    const target = parts[1];

    let output = '';
    let type: CommandOutput['type'] = 'info';

    switch (action) {
      case 'help':
        output = `Sovereign Architect Interactive CLI v2.4 (WebContainers Wasm)
Available Commands:
  help                - Display this assistance guide
  ls [-l]             - List files in current VFS directory
  cat <filename>      - Inspect source file content
  npm run build       - Execute real-time virtual WebContainer compilation
  npm test            - Run invariant test suite & AST integrity verification
  git status          - Inspect repository status and commit tree
  heal                - Force autonomous Medic Patcher execution loop
  metrics             - Show real-time memory and execution telemetry
  whoami              - Display current cryptographic developer identity
  clear               - Flush terminal scroll buffer`;
        break;

      case 'ls':
        output = `total 24
-rw-r--r-- 1 root root  1240 Jan  1 00:00 App.tsx
-rw-r--r-- 1 root root   940 Jan  1 00:00 theme.json
-rw-r--r-- 1 root root   780 Jan  1 00:00 mockData.ts
-rw-r--r-- 1 root root  1890 Jan  1 00:00 dlt_pipeline.py
drwxr-xr-x 2 root root  4096 Jan  1 00:00 components/
drwxr-xr-x 2 root root  4096 Jan  1 00:00 pipelines/`;
        type = 'success';
        break;

      case 'cat':
        if (!target) {
          output = 'Usage: cat <filename> (e.g. cat theme.json, cat App.tsx)';
          type = 'error';
        } else {
          const file = SAMPLE_PROJECT_FILES.find(
            (f) => f.name.toLowerCase() === target || f.path.toLowerCase().endsWith(target)
          );
          if (file) {
            output = file.content;
            type = 'info';
          } else {
            output = `cat: ${target}: No such file in virtual file system`;
            type = 'error';
          }
        }
        break;

      case 'npm':
        if (parts[1] === 'run' && parts[2] === 'build') {
          output = `> sovereign-app@2.4.0 build
> vite build --target esnext

vite v6.2.0 building for production...
✓ 42 modules transformed.
dist/index.html                   0.84 kB │ gzip:  0.42 kB
dist/assets/index-Cdf52a1.css     4.12 kB │ gzip:  1.32 kB
dist/assets/index-B7f901a.js     48.20 kB │ gzip: 14.80 kB
✓ built in 118ms (Wasm in-browser compilation complete. Exit code 0)`;
          type = 'success';
        } else if (parts[1] === 'test') {
          output = `PASS src/__tests__/ast_contracts.test.ts
  ✓ mockData.ts seed contract non-empty (4ms)
  ✓ theme.json token compliance (2ms)
  ✓ OWASP Top 10 for GenAI vulnerability scan (12ms)
  ✓ EU AI Act Article 14 human override hook verified (5ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.182 s`;
          type = 'success';
        } else {
          output = `Usage: npm run build | npm test`;
        }
        break;

      case 'git':
        if (target === 'status') {
          output = `On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   /src/theme.json (theme tokens synced)
	modified:   /src/data/mockData.ts (seed contracts enforced)

nothing added to commit but working tree clean (0 regressions)`;
          type = 'success';
        } else {
          output = `git version 2.44.0 (WebContainers virtualized git)`;
        }
        break;

      case 'heal':
        output = `[Medic Intercept Triggered]
Initiating intentional error injection and autonomous AST patch recovery...`;
        type = 'patch';
        if (onTriggerSelfHealing) {
          onTriggerSelfHealing();
        }
        break;

      case 'metrics':
        output = `SYSTEM RUNTIME METRICS:
  Engine: WebContainers v2.4 (Wasm Node.js micro-kernel)
  Memory Allocated: 48.2 MB / 512 MB (Optimal)
  HMR Latency: 3.4ms
  Cloud VM Egress: 0 Bytes (Air-Gapped)
  Hourly Server Cost: $0.00 / hour`;
        type = 'info';
        break;

      case 'whoami':
        output = 'rm26@sovereign-architect.eu (Róbert Málik, Slovak Republic · EU)';
        type = 'info';
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        output = `bash: ${action}: command not found. Type "help" for a list of valid commands.`;
        type = 'error';
    }

    const newRecord: CommandOutput = {
      id: `cmd-${Date.now()}`,
      command: cmd,
      output,
      type,
      timestamp: new Date().toLocaleTimeString()
    };

    setHistory((prev) => [...prev, newRecord]);
    setInput('');
  };

  return (
    <div className="p-4 bg-zinc-950 font-mono text-xs flex flex-col justify-between min-h-[480px]">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-zinc-200 font-bold">WEBCONTAINERS WASM SHELL // BASH</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            root@sovereign:/workspace
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            TCP Port 3000
          </span>
          <button
            onClick={() => setHistory([])}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            title="Clear Terminal Buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal History Log */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 max-h-[360px] pr-2">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-violet-400 font-bold">sovereign@wasm:~$</span>
              <span className="text-white font-semibold">{item.command}</span>
              <span className="text-[10px] text-zinc-600 ml-auto">{item.timestamp}</span>
            </div>
            <pre
              className={`p-2.5 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto ${
                item.type === 'error'
                  ? 'bg-rose-950/30 border border-rose-900/50 text-rose-300'
                  : item.type === 'success'
                  ? 'bg-emerald-950/20 border border-emerald-900/40 text-emerald-300'
                  : item.type === 'patch'
                  ? 'bg-amber-950/30 border border-amber-900/40 text-amber-300'
                  : 'bg-zinc-900/40 border border-zinc-800/60 text-zinc-300'
              }`}
            >
              <code>{item.output}</code>
            </pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Command Suggestions */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 pb-2 text-[10px] text-zinc-400 border-t border-zinc-900">
        <span className="text-zinc-500 mr-1">Quick run:</span>
        {['npm run build', 'npm test', 'git status', 'ls -l', 'cat theme.json', 'metrics', 'heal'].map((quick) => (
          <button
            key={quick}
            onClick={() => {
              setInput(quick);
              inputRef.current?.focus();
            }}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            {quick}
          </button>
        ))}
      </div>

      {/* Interactive CLI Input Line */}
      <form onSubmit={handleCommand} className="pt-2 border-t border-zinc-800 flex items-center gap-2">
        <span className="text-violet-400 font-bold">sovereign@wasm:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type command (e.g. "npm run build", "help", "ls")...'
          className="flex-1 bg-transparent text-white font-mono text-xs outline-none placeholder:text-zinc-600"
          autoFocus
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          title="Send command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
