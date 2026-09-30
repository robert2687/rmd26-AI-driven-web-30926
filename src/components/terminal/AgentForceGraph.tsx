import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Play, 
  RotateCcw, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Wrench, 
  CheckCircle2, 
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';

export interface ForceNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  role: string;
  agent: string;
  status: 'idle' | 'running' | 'completed' | 'healed' | 'error';
  color: string;
  radius: number;
  icon: string;
  inputs: string[];
  outputs: string[];
  latency: string;
  description: string;
}

export interface ForceLink extends d3.SimulationLinkDatum<ForceNode> {
  id: string;
  source: string | ForceNode;
  target: string | ForceNode;
  label: string;
  isSelfHeal?: boolean;
  value?: number;
}

interface AgentForceGraphProps {
  activeAgent?: string;
  selfHealPhase?: 'idle' | 'crash' | 'medic' | 'restored';
  onSelectAgent?: (agentId: string) => void;
  selectedAgentId?: string;
}

export const AgentForceGraph: React.FC<AgentForceGraphProps> = ({
  activeAgent = 'Planner',
  selfHealPhase = 'idle',
  onSelectAgent,
  selectedAgentId
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<ForceNode | null>(null);
  const [isPhysicsPaused, setIsPhysicsPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical-path' | 'self-heal'>('all');

  const simulationRef = useRef<d3.Simulation<ForceNode, ForceLink> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Nodes configuration matching autonomous swarm architecture
  const initialNodes: ForceNode[] = [
    {
      id: 'planner',
      name: 'Planner Agent',
      role: 'Intent & Task Graph',
      agent: 'Planner',
      status: activeAgent === 'Planner' ? 'running' : 'completed',
      color: '#8b5cf6', // Violet
      radius: 28,
      icon: '🧠',
      inputs: ['Natural Language Intent', 'System Skills'],
      outputs: ['DAG Task Plan', 'mockData.ts Contract'],
      latency: '24ms',
      description: 'Parses user prompt into acyclic task DAG with seeded mockData to eliminate hollow UI.'
    },
    {
      id: 'architect',
      name: 'Nexus Architect',
      role: 'VFS Mount & AST Scaffolding',
      agent: 'Architect',
      status: activeAgent === 'Architect' 
        ? 'running' 
        : (['Coder', 'Reviewer', 'Compiler', 'Patcher', 'Sandbox'].includes(activeAgent) ? 'completed' : 'idle'),
      color: '#3b82f6', // Blue
      radius: 26,
      icon: '📐',
      inputs: ['DAG Task Plan', 'Component Specs'],
      outputs: ['In-Memory VFS Tree', 'Design Tokens'],
      latency: '18ms',
      description: 'Mounts virtual file system and enforces design tokens & component topology.'
    },
    {
      id: 'coder',
      name: 'Spark Coder',
      role: 'TypeScript Unit Synthesis',
      agent: 'Coder',
      status: activeAgent === 'Coder' 
        ? 'running' 
        : (['Reviewer', 'Compiler', 'Patcher', 'Sandbox'].includes(activeAgent) ? 'completed' : 'idle'),
      color: '#06b6d4', // Cyan
      radius: 30,
      icon: '⚡',
      inputs: ['VFS Topology', 'Design Tokens', 'mockData'],
      outputs: ['App.tsx', 'Dashboard.tsx', 'types/index.ts'],
      latency: '95ms',
      description: 'Synthesizes type-safe, modular React 19 / TypeScript components bound to design tokens.'
    },
    {
      id: 'reviewer',
      name: 'Sentinel Reviewer',
      role: 'OWASP & CVE Firewall',
      agent: 'Reviewer',
      status: activeAgent === 'Reviewer' 
        ? 'running' 
        : (['Compiler', 'Patcher', 'Sandbox'].includes(activeAgent) ? 'completed' : 'idle'),
      color: '#10b981', // Emerald
      radius: 26,
      icon: '🛡️',
      inputs: ['Synthesized Source AST', 'CVE Database'],
      outputs: ['0 Hallucinated Packages', 'WCAG AA Audit'],
      latency: '42ms',
      description: 'Audits ASTs against OWASP Top 10 for GenAI, validating dependencies before compile.'
    },
    {
      id: 'compiler',
      name: 'Compiler Validator',
      role: 'WebContainers Virtual Build',
      agent: 'Compiler',
      status: selfHealPhase === 'crash'
        ? 'error'
        : (activeAgent === 'Compiler' ? 'running' : (['Patcher', 'Sandbox'].includes(activeAgent) ? 'completed' : 'idle')),
      color: selfHealPhase === 'crash' ? '#f43f5e' : '#eab308', // Rose / Yellow
      radius: 28,
      icon: '⚙️',
      inputs: ['VFS Workspace', 'Vite / TypeScript Core'],
      outputs: ['Wasm Executable Bundle', 'Exit Code 0 / 1'],
      latency: '112ms',
      description: 'Runs real npm build inside isolated WebContainers sandbox. Captures stderr divergence.'
    },
    {
      id: 'patcher',
      name: 'The Medic (Patcher)',
      role: 'Autonomous Self-Healing',
      agent: 'Patcher',
      status: selfHealPhase === 'medic'
        ? 'running'
        : (selfHealPhase === 'restored' || activeAgent === 'Patcher' ? 'healed' : 'idle'),
      color: '#f59e0b', // Amber
      radius: 27,
      icon: '🩹',
      inputs: ['Compiler stderr Stream', 'AST Divergence'],
      outputs: ['executeEdits() Surgical Diff', 'Test Suite Pass'],
      latency: '82ms',
      description: 'Activated on compiler failure. Parses stderr, isolates AST node, and injects surgical diff.'
    },
    {
      id: 'sandbox',
      name: 'Isolated Sandbox',
      role: 'Wasm Node.js Micro-OS',
      agent: 'Sandbox',
      status: activeAgent === 'Sandbox' || selfHealPhase === 'restored' ? 'completed' : 'idle',
      color: '#a855f7', // Purple
      radius: 32,
      icon: '🚀',
      inputs: ['Compiled Bundle', 'Virtual TCP ServiceWorker'],
      outputs: ['localhost:3000 Port', 'Sub-5ms HMR Socket'],
      latency: '3.6ms',
      description: 'Hosts interactive live preview inside browser memory with zero cloud VM fees.'
    }
  ];

  // Directed delegation links
  const initialLinks: ForceLink[] = [
    { id: 'l1', source: 'planner', target: 'architect', label: 'Task DAG' },
    { id: 'l2', source: 'architect', target: 'coder', label: 'VFS Topology' },
    { id: 'l3', source: 'coder', target: 'reviewer', label: 'Source AST' },
    { id: 'l4', source: 'reviewer', target: 'compiler', label: 'Clean Build' },
    { id: 'l5', source: 'compiler', target: 'sandbox', label: 'Wasm Deploy' },
    { id: 'l6', source: 'compiler', target: 'patcher', label: 'stderr Stream', isSelfHeal: true },
    { id: 'l7', source: 'patcher', target: 'compiler', label: 'Surgical Diff', isSelfHeal: true },
    { id: 'l8', source: 'planner', target: 'reviewer', label: 'Security Specs' }
  ];

  // Initialize selected node
  useEffect(() => {
    if (!selectedNode) {
      const defaultNode = initialNodes.find((n) => n.agent === activeAgent) || initialNodes[0];
      setSelectedNode(defaultNode);
    }
  }, [activeAgent]);

  // Main D3 Force Simulation Setup
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 700;
    const height = 420;

    // Filter links based on user filter
    let visibleLinks = [...initialLinks];
    if (activeFilter === 'critical-path') {
      visibleLinks = visibleLinks.filter((l) => !l.isSelfHeal);
    } else if (activeFilter === 'self-heal') {
      visibleLinks = visibleLinks.filter((l) => l.isSelfHeal || l.source === 'compiler' || l.target === 'compiler');
    }

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    svg.selectAll('*').remove();

    // Defs for gradients, glowing filters, and arrow markers
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers for normal and self-heal links
    defs.append('marker')
      .attr('id', 'arrow-normal')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#8b5cf6');

    defs.append('marker')
      .attr('id', 'arrow-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#06b6d4');

    defs.append('marker')
      .attr('id', 'arrow-heal')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#f59e0b');

    // Zoom container
    const g = svg.append('g').attr('class', 'zoom-container');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Background grid
    const gridPattern = defs.append('pattern')
      .attr('id', 'force-grid')
      .attr('width', 24)
      .attr('height', 24)
      .attr('patternUnits', 'userSpaceOnUse');
    gridPattern.append('circle')
      .attr('cx', 12)
      .attr('cy', 12)
      .attr('r', 0.8)
      .attr('fill', '#27272a');

    g.append('rect')
      .attr('width', width * 3)
      .attr('height', height * 3)
      .attr('x', -width)
      .attr('y', -height)
      .attr('fill', 'url(#force-grid)')
      .attr('opacity', 0.5);

    // Deep copy nodes and links for d3 mutation
    const nodesData = initialNodes.map((n) => ({ ...n }));
    const linksData = visibleLinks.map((l) => ({ ...l }));

    // Create D3 Force Simulation
    const simulation = d3.forceSimulation<ForceNode>(nodesData)
      .force(
        'link',
        d3.forceLink<ForceNode, ForceLink>(linksData)
          .id((d) => d.id)
          .distance((d) => (d.isSelfHeal ? 85 : 120))
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<ForceNode>().radius((d) => d.radius + 18));

    simulationRef.current = simulation;

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup.selectAll<SVGLineElement, ForceLink>('line')
      .data(linksData)
      .enter()
      .append('line')
      .attr('stroke', (d) => (d.isSelfHeal ? '#f59e0b' : '#3f3f46'))
      .attr('stroke-width', (d) => (d.isSelfHeal ? 2 : 1.5))
      .attr('stroke-dasharray', (d) => (d.isSelfHeal ? '4,4' : 'none'))
      .attr('marker-end', (d) => (d.isSelfHeal ? 'url(#arrow-heal)' : 'url(#arrow-normal)'))
      .attr('opacity', 0.7);

    // Link Labels
    const linkLabel = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(linksData)
      .enter()
      .append('text')
      .attr('font-size', '9px')
      .attr('fill', '#71717a')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .text((d) => d.label);

    // Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup.selectAll<SVGGElement, ForceNode>('g')
      .data(nodesData)
      .enter()
      .append('g')
      .attr('class', 'node-item')
      .attr('cursor', 'grab')
      .call(
        d3.drag<SVGGElement, ForceNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            if (!isPhysicsPaused) {
              d.fx = null;
              d.fy = null;
            }
          })
      )
      .on('click', (event, d) => {
        setSelectedNode(d);
        if (onSelectAgent) onSelectAgent(d.id);
      });

    // Outer Pulsing Glow for Active / Healed Agents
    node.filter((d) => d.status === 'running' || d.status === 'healed' || d.status === 'error')
      .append('circle')
      .attr('r', (d) => d.radius + 8)
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,2')
      .attr('opacity', 0.8)
      .attr('filter', 'url(#glow)')
      .append('animateTransform')
      .attr('attributeName', 'transform')
      .attr('type', 'rotate')
      .attr('from', '0')
      .attr('to', '360')
      .attr('dur', '10s')
      .attr('repeatCount', 'indefinite');

    // Main Node Circle
    node.append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => {
        if (d.status === 'running') return '#082f49';
        if (d.status === 'error') return '#4c0519';
        if (d.status === 'healed') return '#451a03';
        if (d.status === 'completed') return '#064e3b';
        return '#18181b';
      })
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => (d.status === 'running' ? 3 : 2))
      .attr('filter', (d) => (d.status === 'running' ? 'url(#glow)' : null));

    // Node Icon
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '14px')
      .text((d) => d.icon);

    // Node Title Badge
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', (d) => d.radius + 14)
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', (d) => (d.status === 'running' ? '#67e8f9' : '#e4e4e7'))
      .text((d) => d.agent);

    // Node Latency Pill
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', (d) => d.radius + 25)
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-size', '8px')
      .attr('fill', '#a1a1aa')
      .text((d) => d.latency);

    // Simulation Tick Updates
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as ForceNode).x || 0)
        .attr('y1', (d) => (d.source as ForceNode).y || 0)
        .attr('x2', (d) => (d.target as ForceNode).x || 0)
        .attr('y2', (d) => (d.target as ForceNode).y || 0);

      linkLabel
        .attr('x', (d) => (((d.source as ForceNode).x || 0) + ((d.target as ForceNode).x || 0)) / 2)
        .attr('y', (d) => (((d.source as ForceNode).y || 0) + ((d.target as ForceNode).y || 0)) / 2);

      node.attr('transform', (d) => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [activeAgent, selfHealPhase, activeFilter, isPhysicsPaused]);

  // Zoom controls
  const handleZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const handleRestartPhysics = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(1).restart();
    }
  };

  return (
    <div className="space-y-4 font-mono text-left text-xs">
      {/* Top Controls Header */}
      <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-md shadow-violet-950/40 shrink-0">
            <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                D3.js Force-Directed Multi-Agent Orchestration Graph
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Live Physics</span>
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans block">
              Drag nodes, inspect task handoffs, and monitor real-time closed-loop self-healing delegation paths.
            </span>
          </div>
        </div>

        {/* View Controls & Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Path Filters */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[10px]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Paths (8)
            </button>
            <button
              onClick={() => setActiveFilter('critical-path')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                activeFilter === 'critical-path'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Linear DAG
            </button>
            <button
              onClick={() => setActiveFilter('self-heal')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                activeFilter === 'self-heal'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Self-Heal Loop
            </button>
          </div>

          {/* D3 Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleZoom(1.2)}
              title="Zoom In"
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(0.8)}
              title="Zoom Out"
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset View"
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRestartPhysics}
              title="Reheat Force Physics"
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG D3 Graph Canvas */}
      <div
        ref={containerRef}
        className="relative w-full h-[420px] rounded-2xl bg-zinc-950/95 border border-zinc-800 overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

        {/* Legend Overlay */}
        <div className="absolute top-3 left-3 pointer-events-none bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-2.5 space-y-1.5 backdrop-blur-md text-[10px]">
          <div className="text-zinc-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Active Swarm Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-zinc-300">Active Executing:</span>
            <span className="text-cyan-300 font-bold">{activeAgent}</span>
          </div>
          {selfHealPhase !== 'idle' && (
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Wrench className="w-2.5 h-2.5 text-amber-400" />
              <span>Self-Healing Phase: {selfHealPhase}</span>
            </div>
          )}
        </div>

        {/* Floating Hint */}
        <div className="absolute bottom-3 right-3 pointer-events-none bg-zinc-950/80 border border-zinc-800 text-zinc-500 rounded-lg px-2.5 py-1 text-[9px] backdrop-blur-md">
          Scroll to Zoom · Click & Drag to inspect nodes
        </div>
      </div>

      {/* Selected Node Real-time Contract Inspector */}
      {selectedNode && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-3 backdrop-blur-md shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-zinc-800 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{selectedNode.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{selectedNode.name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${
                      selectedNode.status === 'running'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                        : selectedNode.status === 'healed'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                        : selectedNode.status === 'error'
                        ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>
                <span className="text-zinc-400 text-xs">{selectedNode.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-zinc-400">
                P99 Latency: <strong className="text-cyan-400">{selectedNode.latency}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90">
              <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1.5 flex items-center gap-1.5">
                <span>INPUT TASK CONTRACTS</span>
              </div>
              <ul className="space-y-1 text-zinc-300 text-[11px]">
                {selectedNode.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold">➔</span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90">
              <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5">
                <span>OUTPUT VERIFIED ARTIFACTS</span>
              </div>
              <ul className="space-y-1 text-zinc-300 text-[11px]">
                {selectedNode.outputs.map((out, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
