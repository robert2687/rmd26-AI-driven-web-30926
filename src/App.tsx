import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Layers, Menu } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AgentGrid } from './components/AgentGrid';
import { TerminalDemo } from './components/TerminalDemo';
import { SecurityCompliance } from './components/SecurityCompliance';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { BenchmarkSection } from './components/BenchmarkSection';
import { Roadmap } from './components/Roadmap';
import { ConsoleModal } from './components/ConsoleModal';
import { Footer } from './components/Footer';
import { LegalModal, LegalTab } from './components/LegalModal';
import { MobileSideDrawer } from './components/MobileSideDrawer';

export default function App() {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab | null>(null);

  // Global listeners for drawer events
  useEffect(() => {
    const handleToggle = () => setIsMobileDrawerOpen((prev) => !prev);
    const handleOpen = () => setIsMobileDrawerOpen(true);
    const handleClose = () => setIsMobileDrawerOpen(false);

    window.addEventListener('toggle-mobile-menu', handleToggle);
    window.addEventListener('open-mobile-drawer', handleOpen);
    window.addEventListener('close-mobile-drawer', handleClose);

    return () => {
      window.removeEventListener('toggle-mobile-menu', handleToggle);
      window.removeEventListener('open-mobile-drawer', handleOpen);
      window.removeEventListener('close-mobile-drawer', handleClose);
    };
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLegalModal = (tab: LegalTab) => {
    setLegalModalTab(tab);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#09090b] text-zinc-100 selection:bg-violet-500/30 selection:text-violet-200 font-sans flex flex-col pb-16 md:pb-0">
      {/* Top Glassmorphic Navigation Bar */}
      <Header
        onOpenConsole={() => setIsConsoleOpen(true)}
        onNavigateSection={handleNavigateSection}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Section with interactive live agent log stream */}
        <Hero
          onExploreDemo={() => handleNavigateSection('terminal-demo')}
          onOpenDocs={() => handleNavigateSection('architecture')}
          onOpenConsole={() => setIsConsoleOpen(true)}
        />

        {/* Multi-Agentic Engine (4-Card + Specialist Symphony) */}
        <AgentGrid
          onSelectAgentForDemo={() => handleNavigateSection('terminal-demo')}
        />

        {/* Interactive Workflow Demo (Terminal & Tabs) */}
        <TerminalDemo />

        {/* Closed-Loop Paradigm & Architecture Diagram */}
        <ArchitectureDiagram />

        {/* Security & Scalability (EU AI Act, On-Premise, Shared Memory) */}
        <SecurityCompliance onOpenLegalModal={handleOpenLegalModal} />

        {/* Benchmarks & Performance Metrics */}
        <BenchmarkSection />

        {/* Development Roadmap (Timeline: Completed vs Upcoming) */}
        <Roadmap onOpenConsole={() => setIsConsoleOpen(true)} />
      </main>

      {/* High-Impact CTA Banner & Clean Footer */}
      <Footer
        onOpenConsole={() => setIsConsoleOpen(true)}
        onNavigateSection={handleNavigateSection}
        onOpenLegalModal={handleOpenLegalModal}
      />

      {/* Persistent Mobile Bottom Navigation Dock (md:hidden) */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-40">
        <div className="bg-zinc-950/90 border border-zinc-800 backdrop-blur-xl rounded-2xl p-1.5 shadow-2xl shadow-black flex items-center justify-between font-mono text-xs">
          <button
            onClick={() => {
              handleNavigateSection('terminal-demo');
              window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'sandbox' }));
            }}
            className="flex-1 py-1.5 px-2 rounded-xl text-center flex flex-col items-center gap-0.5 text-cyan-300 hover:bg-zinc-900 transition-colors"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px]">Sandbox</span>
          </button>

          <button
            onClick={() => {
              handleNavigateSection('terminal-demo');
              window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'architecture' }));
            }}
            className="flex-1 py-1.5 px-2 rounded-xl text-center flex flex-col items-center gap-0.5 text-violet-300 hover:bg-zinc-900 transition-colors"
          >
            <span className="text-sm leading-none">🌲</span>
            <span className="text-[10px]">AST</span>
          </button>

          <button
            onClick={() => {
              handleNavigateSection('terminal-demo');
              window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'chat' }));
            }}
            className="flex-1 py-1.5 px-2 rounded-xl text-center flex flex-col items-center gap-0.5 text-amber-300 hover:bg-zinc-900 transition-colors"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">Stream</span>
          </button>

          <button
            onClick={() => {
              handleNavigateSection('terminal-demo');
              window.dispatchEvent(new CustomEvent('switch-terminal-tab', { detail: 'dag' }));
            }}
            className="flex-1 py-1.5 px-2 rounded-xl text-center flex flex-col items-center gap-0.5 text-indigo-300 hover:bg-zinc-900 transition-colors"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px]">DAG</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open mobile navigation menu"
            className="flex-1 py-1.5 px-2 rounded-xl text-center flex flex-col items-center gap-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-md shadow-violet-950/40 cursor-pointer active:scale-95"
          >
            <Menu className="w-4 h-4 text-cyan-300" />
            <span className="text-[10px]">Menu</span>
          </button>
        </div>
      </div>

      {/* Side-Drawer Navigation Menu (Slides out when Menu is clicked in footer or header) */}
      <MobileSideDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        onNavigateSection={handleNavigateSection}
        onOpenConsole={() => setIsConsoleOpen(true)}
        onOpenLegalModal={handleOpenLegalModal}
      />

      {/* Launch Console Modal */}
      <ConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        onLaunchDemoView={() => handleNavigateSection('terminal-demo')}
      />

      {/* Sovereign Legal & Regulatory Modal (Privacy Policy, Terms of Service, EU AI Act Disclosures) */}
      <LegalModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}
