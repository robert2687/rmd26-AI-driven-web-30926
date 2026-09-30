import React, { useState } from 'react';
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

export default function App() {
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab | null>(null);

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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#09090b] text-zinc-100 selection:bg-violet-500/30 selection:text-violet-200 font-sans flex flex-col">
      {/* Top Glassmorphic Navigation Bar */}
      <Header
        onOpenConsole={() => setIsConsoleOpen(true)}
        onNavigateSection={handleNavigateSection}
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
