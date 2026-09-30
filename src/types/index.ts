export interface AgentRole {
  id: string;
  name: string;
  badge: string;
  role: string;
  avatarIcon: string;
  color: 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo';
  description: string;
  cognitiveFunction: string;
  capabilities: string[];
  sampleOutput: string;
  metric: string;
  metricLabel: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'patch' | 'system' | 'code';
  codeSnippet?: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  content: string;
  description: string;
  iconType: 'react' | 'json' | 'python' | 'markdown' | 'config';
}

export interface SimulationPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  filesGenerated: number;
  linesOfCode: number;
  selfHealCount: number;
  initialError?: string;
  patchSolution?: string;
}

export interface ComplianceRule {
  id: string;
  standard: string;
  article: string;
  title: string;
  status: 'Compliant' | 'Certified' | 'Enforced';
  description: string;
  evidence: string;
}
