import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenConsole: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConsole, onNavigateSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Architecture', id: 'architecture' },
    { label: 'Agents', id: 'agents' },
    { label: 'Interactive Demo', id: 'terminal-demo' },
    { label: 'Security & EU Act', id: 'security' },
    { label: 'Benchmark', id: 'comparison' },
    { label: 'Roadmap', id: 'roadmap' }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-black/50'
          : 'bg-transparent border-b border-zinc-800/40'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 mr-2 md:mr-8 lg:mr-12">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 sm:gap-2.5 group mr-1 sm:mr-4"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-cyan-400 group-hover:text-violet-400 transition-colors" />
              </div>
            </div>
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-white font-mono">
              RMD26
            </span>
          </a>

          {/* Live Engine Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 ml-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-zinc-300">Agents Active</span>
            <span className="text-zinc-600">·</span>
            <span className="text-cyan-400">&lt;5ms Wasm</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-zinc-400 ml-4 lg:ml-8 mr-6 lg:mr-10">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigateSection(link.id)}
              className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-violet-500/60 whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions Zone with guaranteed gap from nav */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 ml-auto">
          <button
            onClick={() => onNavigateSection('terminal-demo')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-mono font-medium text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-950/20"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline sm:inline">Try Sandbox</span>
            <span className="inline xs:hidden sm:hidden">Sandbox</span>
          </button>

          <button
            onClick={onOpenConsole}
            className="relative group overflow-hidden rounded-lg p-px font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-violet-950/40 shrink-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-zinc-950 rounded-[7px] text-white transition-all group-hover:bg-opacity-80">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse shrink-0" />
              <span className="font-semibold whitespace-nowrap">Launch Console</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors shrink-0 hidden xs:inline" />
            </span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white shrink-0 ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 border-b border-zinc-800 px-6 py-4 space-y-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/60 text-xs font-mono text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cluster Status: Online (Docker & Wasm Runtime)</span>
          </div>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigateSection(link.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigateSection('terminal-demo');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-4 text-xs font-mono font-medium rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-center"
            >
              Open Interactive Terminal
            </button>
            <button
              onClick={() => {
                onOpenConsole();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-4 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-center shadow-lg"
            >
              Launch Console
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
