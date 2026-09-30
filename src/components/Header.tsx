import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Terminal, Shield, Cpu, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenConsole: () => void;
  onNavigateSection: (sectionId: string) => void;
  isMobileDrawerOpen?: boolean;
  onToggleMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConsole,
  onNavigateSection,
  isMobileDrawerOpen,
  onToggleMobileDrawer
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDrawerActive = isMobileDrawerOpen !== undefined ? isMobileDrawerOpen : mobileMenuOpen;

  const handleToggleMenu = () => {
    if (onToggleMobileDrawer) {
      onToggleMobileDrawer();
    } else {
      setMobileMenuOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open (if not using external drawer)
  useEffect(() => {
    if (mobileMenuOpen && !onToggleMobileDrawer) {
      document.body.style.overflow = 'hidden';
    } else if (!onToggleMobileDrawer) {
      document.body.style.overflow = '';
    }
    return () => {
      if (!onToggleMobileDrawer) document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, onToggleMobileDrawer]);

  // Listen for external open-mobile-menu events
  useEffect(() => {
    const handleToggle = () => {
      if (onToggleMobileDrawer) {
        onToggleMobileDrawer();
      } else {
        setMobileMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('toggle-mobile-menu', handleToggle);
    return () => window.removeEventListener('toggle-mobile-menu', handleToggle);
  }, [onToggleMobileDrawer]);

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
        scrolled || mobileMenuOpen
          ? 'bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-black/50'
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
              setMobileMenuOpen(false);
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

        {/* Navigation Links (Desktop) */}
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

        {/* Actions Zone with high-visibility Mobile Menu button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
          {/* Quick Sandbox Link */}
          <button
            onClick={() => {
              onNavigateSection('terminal-demo');
              window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'sandbox' }));
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-mono font-medium text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-950/20"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xs:inline">Try Sandbox</span>
            <span className="inline xs:hidden">Sandbox</span>
          </button>

          {/* Launch Console - Visible on sm+ */}
          <button
            onClick={onOpenConsole}
            className="hidden sm:inline-flex relative group overflow-hidden rounded-lg p-px font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-violet-950/40 shrink-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-950 rounded-[7px] text-white transition-all group-hover:bg-opacity-80">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse shrink-0" />
              <span className="font-semibold whitespace-nowrap">Console</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
            </span>
          </button>

          {/* Prominent, High-Visibility Mobile Menu Button */}
          <button
            type="button"
            onClick={handleToggleMenu}
            aria-expanded={isDrawerActive}
            aria-label={isDrawerActive ? 'Close navigation drawer' : 'Open navigation drawer'}
            className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border shrink-0 cursor-pointer touch-manipulation select-none ${
              isDrawerActive
                ? 'bg-rose-950 text-rose-200 border-rose-500 shadow-lg shadow-rose-950/60 ring-2 ring-rose-500/50'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700 shadow-md ring-1 ring-violet-500/40 hover:ring-violet-400'
            }`}
          >
            {isDrawerActive ? <X className="w-4 h-4 text-rose-300" /> : <Menu className="w-4 h-4 text-cyan-400" />}
            <span>{isDrawerActive ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {/* Fallback Mobile Menu Drawer mounted to document.body via Portal if no external drawer is wired */}
      {!onToggleMobileDrawer && mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-[9999] bg-zinc-950/98 backdrop-blur-2xl border-b border-zinc-800 overflow-y-auto overscroll-contain px-5 py-6 space-y-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header cluster status */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-zinc-200 font-semibold">WebContainers Online</span>
              </div>
              <span className="text-cyan-400">&lt;5ms Wasm</span>
            </div>

            {/* Platform Navigation Sections */}
            <div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-2.5 font-bold">
                Navigation Sections:
              </span>
              <div className="space-y-1.5">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigateSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 transition-all text-left"
                  >
                    <span>{link.label}</span>
                    <span className="text-zinc-500 text-xs font-mono">➔</span>
                  </button>
                ))}
              </div>
            </div>

            {/* All 6 Studio Features */}
            <div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-2.5 font-bold">
                All 6 Studio Features:
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  onClick={() => {
                    onNavigateSection('terminal-demo');
                    window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'sandbox' }));
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/60 text-left flex flex-col gap-1 transition-all"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>⚡ Sandbox</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans">Port 3000 HMR</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateSection('terminal-demo');
                    window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'architecture' }));
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-violet-950/30 border border-violet-500/40 text-violet-300 hover:bg-violet-950/60 text-left flex flex-col gap-1 transition-all"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <span>🌲 AST & Code</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans">VFS & Parser</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateSection('terminal-demo');
                    window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'chat' }));
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300 hover:bg-amber-950/60 text-left flex flex-col gap-1 transition-all"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <span>💬 Agent Stream</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans">Multi-Agent Chat</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateSection('terminal-demo');
                    window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'dag' }));
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/60 text-left flex flex-col gap-1 transition-all"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <span>🕸️ DAG Graph</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans">7-Node State</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateSection('terminal-demo');
                    window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'cli' }));
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:bg-zinc-850 text-left flex flex-col gap-1 transition-all"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <span>💻 Wasm Shell</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans">Bash Terminal</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateSection('terminal-demo');
                    window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'compliance' }));
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 text-left flex flex-col gap-1 transition-all"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <span>🇪🇺 EU AI Audit</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans">Article 14 Pass</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Actions inside Menu */}
          <div className="pt-4 border-t border-zinc-800 space-y-2.5">
            <button
              onClick={() => {
                onNavigateSection('terminal-demo');
                window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'sandbox' }));
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 text-xs font-mono font-bold rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white text-center flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
            >
              <Terminal className="w-4 h-4 text-cyan-300" />
              <span>Launch Live Sandbox (Port 3000)</span>
            </button>

            <button
              onClick={() => {
                onOpenConsole();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-center hover:bg-zinc-850 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Open Studio Console Modal</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 text-center"
            >
              ✕ Close Menu
            </button>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
