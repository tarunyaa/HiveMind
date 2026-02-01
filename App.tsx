
import React, { useState, useEffect } from 'react';
import { 
  Plus, Play, FileCode, Users, Hexagon as Hive, X, Trash2, 
  Download, LogOut, Monitor, Heart, Cpu, ShieldCheck, 
  ArrowRight, GitBranch, FileText, MessageSquare, Presentation,
  CheckCircle2, AlertCircle, Coffee, Briefcase, DollarSign,
  UserCheck, ShieldAlert, Send, Zap, HardDrive, Layout, 
  Layers, Settings, Search, Terminal
} from 'lucide-react';
import { ALU, ToolType, ModelType, MODELS, Deliverable, PodConfig, WorkUnit } from './types';
import OfficeMap from './components/OfficeMap';
import { generateYamlConfig, generateAgentLog } from './services/gemini';

const TOOL_OPTIONS: ToolType[] = ['GitHub', 'Slack', 'PowerPoint', 'Terminal', 'Email', 'ResearchDB', 'BillingAPI', 'Jira', 'Calendar'];

const App: React.FC = () => {
  const [phase, setPhase] = useState<'charter' | 'architect' | 'mapping' | 'live'>('charter');
  const [podConfig, setPodConfig] = useState<PodConfig>({
    name: '',
    goal: '',
    approvalRule: '',
    budget: 100.00,
    currentSpend: 0.00
  });
  
  const [agents, setAgents] = useState<ALU[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [activeWork, setActiveWork] = useState<WorkUnit | null>(null);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] HiveMind Control Plane Ready for Initialization..."]);

  const deployPod = () => {
    if (!podConfig.name) {
      alert("Please enter a Pod Name for the demo.");
      return;
    }
    if (agents.length < 3) {
      alert("Please recruit at least 3 agents to demonstrate parallel labor.");
      return;
    }
    setPhase('live');
    setLogs(prev => [...prev, `[COMMAND] Deploying "${podConfig.name}"...`, `[SYSTEM] Budget Lock: $${podConfig.budget.toFixed(2)}`]);
    setAgents(prev => prev.map((a, idx) => ({
      ...a,
      status: 'idle',
      isManager: idx === 0,
      position: idx === 0 ? { x: 50, y: 15 } : { x: 20 + (idx * 15), y: 55 }
    })));
  };

  const addAgent = () => {
    const id = `agent-${Date.now()}`;
    const model: ModelType = 'gemini-3-flash-preview';
    const newAgent: ALU = {
      id,
      name: '',
      role: '',
      goal: '',
      backstory: '',
      model,
      costPerHour: MODELS[model].cost,
      reliability: MODELS[model].reliability,
      status: 'idle',
      progress: 0,
      avatar: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${id}&backgroundColor=f1f5f9`,
      tools: ['Terminal'],
      connections: [],
      position: { x: 50, y: 50 }
    };
    setAgents([...agents, newAgent]);
    setSelectedAgentId(id);
  };

  const updateAgent = (id: string, updates: Partial<ALU>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const submitWork = (content: string) => {
    const isPR = content.toLowerCase().includes('314') || content.toLowerCase().includes('pr');
    const type = isPR ? 'pr' : 'ticket';
    setActiveWork({ id: 'WORK-' + Math.floor(Math.random()*1000), content, type });
    
    if (isPR) {
      setLogs(prev => [
        ...prev, 
        `[MGR] PR #314 Detected: "CI checks failing". Initiating parallel decomposition...`,
        `[MGR] SUBTASK A: Backend refactor audit (Logic Check)`,
        `[MGR] SUBTASK B: CI Pipeline reconfiguration (Infra Check)`,
        `[MGR] SUBTASK C: Production policy compliance check (Safety Check)`,
        `[MGR] Deploying 3+ agents in parallel execution mode.`
      ]);
    } else {
      setLogs(prev => [...prev, `[MGR] Intake received: "${content}". Decomposing into subtasks.`]);
    }

    // Assign work to at least 3 agents simultaneously
    setAgents(prev => prev.map((a, i) => {
      if (i < 4) return { ...a, status: 'working', progress: 0, currentTask: isPR ? `Resolving PR #314 Subtask ${String.fromCharCode(65 + i)}` : 'Processing Task' };
      return a;
    }));
  };

  const handleApprove = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) return { ...a, status: 'idle', progress: 0 };
      return a;
    }));
    setLogs(prev => [...prev, `[MGR] HUMAN OVERRIDE GRANTED. Merging validated code blocks to staging.`]);
  };

  useEffect(() => {
    if (phase !== 'live' || !activeWork) return;
    const interval = setInterval(() => {
      setAgents(prev => {
        let budgetUsed = 0;
        const newAgents = prev.map(a => {
          if (a.status !== 'working') return a;
          
          budgetUsed += (a.costPerHour / 3600) * 15; // Simulated high burn rate
          const inc = 15 + Math.random() * 25; // Target ~30s cycle (fast demo)
          
          if (a.progress + inc >= 100) {
            // Check for Production Risk trigger (any agent with 'policy' or 'checker' or 'compliance' in role)
            const isRiskAgent = a.role.toLowerCase().includes('checker') || a.role.toLowerCase().includes('policy') || a.role.toLowerCase().includes('compliance');
            if (isRiskAgent) {
              setLogs(curr => [...curr, `[MGR] !!! PRODUCTION RISK: Deployment contains unverified main-branch dependencies. BLOCKING AUTOMATED MERGE. Awaiting human authority.`]);
              return { ...a, progress: 100, status: 'waiting_approval' };
            }

            const type: Deliverable['type'] = a.tools.includes('GitHub') ? 'git' : 'log';
            const newD: Deliverable = {
              id: Math.random().toString(),
              agentId: a.id,
              type,
              title: `${a.role} Task Finalized`,
              text: `${a.name || 'Unit'} completed ${a.currentTask || 'sub-module'}. Code validated via static analysis.`,
              timestamp: new Date().toLocaleTimeString()
            };
            setDeliverables(curr => [newD, ...curr].slice(0, 15));

            return { ...a, status: 'idle', progress: 0 };
          }
          return { ...a, progress: a.progress + inc };
        });

        setPodConfig(c => ({ ...c, currentSpend: c.currentSpend + budgetUsed }));
        return newAgents;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [phase, activeWork]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="flex h-screen w-full bg-[#fdf6e3] text-[#5d4037] overflow-hidden">
      {/* Sidebar UI */}
      <aside className="w-80 border-r-4 border-[#5d4037] bg-white flex flex-col p-6 z-[1000] shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#5d4037] border-4 border-[#5d4037] rounded-lg flex items-center justify-center shadow-[4px_4px_0px_#d7ccc8]">
            <Hive size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold pixel-font tracking-widest text-[#5d4037] uppercase">HIVEMIND</h1>
            <p className="text-[10px] font-bold text-indigo-500 tracking-tighter uppercase -mt-1">Manager Control Plane</p>
          </div>
        </div>

        {phase === 'charter' && (
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 px-1">
              <div className="w-2 h-4 bg-indigo-500 rounded-full animate-pulse" />
              <label className="text-[10px] uppercase font-bold text-[#5d4037] tracking-widest">01 / Pod Initialization</label>
            </div>
            <div className="space-y-4 bg-white border-4 border-[#5d4037] p-4 shadow-[4px_4px_0px_#d7ccc8]">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-stone-500">Workspace Name (Pod)</label>
                <input 
                  placeholder="e.g. Apollo Infrastructure" 
                  className="w-full bg-white !text-black border-2 border-[#5d4037] rounded px-3 py-2 text-xs font-bold focus:ring-4 ring-indigo-50 outline-none" 
                  value={podConfig.name} 
                  onChange={e => setPodConfig({...podConfig, name: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-stone-500">Core Mission Goal</label>
                <textarea 
                  placeholder="Primary objective..." 
                  className="w-full bg-white !text-black border-2 border-[#5d4037] rounded px-3 py-2 text-xs h-24 font-bold focus:ring-4 ring-indigo-50 outline-none" 
                  value={podConfig.goal} 
                  onChange={e => setPodConfig({...podConfig, goal: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-stone-500">Automated Approval Rule</label>
                <input 
                  placeholder="e.g. Staging branch auto-merge" 
                  className="w-full bg-white !text-black border-2 border-[#5d4037] rounded px-3 py-2 text-xs font-bold" 
                  value={podConfig.approvalRule} 
                  onChange={e => setPodConfig({...podConfig, approvalRule: e.target.value})} 
                />
              </div>
            </div>
            <button onClick={() => setPhase('architect')} className="w-full py-4 bg-[#5d4037] text-white border-4 border-black rounded-lg text-sm font-bold shadow-[6px_6px_0px_#d7ccc8] flex items-center justify-center gap-2 hover:translate-x-1 transition-transform">
              RECRUIT WORKFORCE <ArrowRight size={18} />
            </button>
          </div>
        )}

        {phase === 'architect' && (
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center gap-2 px-1">
              <div className="w-2 h-4 bg-indigo-500 rounded-full" />
              <label className="text-[10px] uppercase font-bold text-[#5d4037] tracking-widest">02 / Specialist Recruitment</label>
            </div>
            {selectedAgent ? (
              <div className="bg-white border-4 border-[#5d4037] p-4 space-y-4 shadow-[4px_4px_0px_#e2e8f0]">
                 <div className="flex justify-between items-center pb-2 border-b-2 border-slate-100">
                   <div className="w-16 h-16 rounded bg-slate-50 border-2 border-[#5d4037] flex items-center justify-center overflow-hidden">
                     <img src={selectedAgent.avatar} className="pixelated w-full h-full" />
                   </div>
                   <button onClick={() => { setAgents(agents.filter(a => a.id !== selectedAgentId)); setSelectedAgentId(null); }} className="text-rose-400 hover:text-rose-600"><Trash2 size={20}/></button>
                 </div>
                 <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-stone-500">Unit Identifier (Name)</label>
                      <input className="w-full bg-white !text-black border-2 border-[#5d4037] rounded px-2 py-2 text-xs font-bold" value={selectedAgent.name} onChange={e => updateAgent(selectedAgent.id, { name: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-stone-500">Operational Role</label>
                      <input className="w-full bg-white !text-black border-2 border-[#5d4037] rounded px-2 py-2 text-xs font-bold" value={selectedAgent.role} onChange={e => updateAgent(selectedAgent.id, { role: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-stone-500">Specialization & Logic</label>
                      <textarea className="w-full bg-white !text-black border-2 border-[#5d4037] rounded px-2 py-2 text-xs h-20 font-bold" value={selectedAgent.backstory} onChange={e => updateAgent(selectedAgent.id, { backstory: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-stone-500">Core Logic Engine</label>
                      <select className="w-full bg-white !text-black border-2 border-[#5d4037] rounded px-2 py-2 text-xs font-bold" value={selectedAgent.model} onChange={e => {
                        const m = e.target.value as ModelType;
                        updateAgent(selectedAgent.id, { model: m, costPerHour: MODELS[m].cost, reliability: MODELS[m].reliability });
                      }}>
                        {Object.entries(MODELS).map(([k,v]) => <option key={k} value={k}>{v.name} (${v.cost}/hr)</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-stone-500">Tool Permission Set</label>
                      <div className="flex flex-wrap gap-1">
                        {TOOL_OPTIONS.map(t => (
                          <button key={t} onClick={() => updateAgent(selectedAgent.id, { tools: selectedAgent.tools.includes(t) ? selectedAgent.tools.filter(x => x !== t) : [...selectedAgent.tools, t] })} className={`px-2 py-1 rounded text-[8px] font-bold border-2 ${selectedAgent.tools.includes(t) ? 'bg-[#5d4037] text-white border-black' : 'bg-white text-slate-400 border-slate-200'}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="p-8 text-center border-4 border-dashed border-slate-300 rounded-lg text-[10px] text-slate-400 italic font-bold">
                Assign a slot in the roster to begin recruitment...
              </div>
            )}
            <button onClick={() => setPhase('mapping')} className="w-full py-4 bg-white text-[#5d4037] border-4 border-[#5d4037] rounded-lg text-sm font-bold shadow-[4px_4px_0px_#d7ccc8] flex items-center justify-center gap-2">
              FINALIZE SQUAD <ArrowRight size={16} />
            </button>
          </div>
        )}

        {phase === 'mapping' && (
          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-4 bg-indigo-500 rounded-full" />
                <label className="text-[10px] uppercase font-bold text-[#5d4037] tracking-widest">03 / Logic Protocol Graph</label>
             </div>
             <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1">
               {agents.map(a => (
                 <div key={a.id} className="bg-white border-4 border-[#5d4037] p-3 shadow-[2px_2px_0px_#e2e8f0] mb-2">
                   <div className="flex items-center gap-2 mb-2 font-bold uppercase text-[10px]">{a.name || a.role || 'Labor Unit'}</div>
                   <div className="flex flex-col gap-1">
                     {agents.filter(t => t.id !== a.id).map(t => (
                       <button key={t.id} onClick={() => updateAgent(a.id, { connections: a.connections.includes(t.id) ? a.connections.filter(x => x !== t.id) : [t.id] })} className={`text-[9px] px-2 py-2 rounded border-2 flex justify-between ${a.connections.includes(t.id) ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                         <span>Handover to {t.name || t.role}</span>
                         {a.connections.includes(t.id) && <CheckCircle2 size={12} />}
                       </button>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
             <button onClick={deployPod} className="w-full py-4 bg-indigo-600 text-white border-4 border-indigo-900 rounded-lg text-sm font-bold shadow-[4px_4px_0px_#1e1b4b] flex items-center justify-center gap-2">
               INITIALIZE COMMAND <Zap size={16} />
             </button>
          </div>
        )}

        {phase === 'live' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
             <div className="bg-white border-4 border-[#5d4037] p-4 shadow-[4px_4px_0px_#d1fae5]">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Control Console: {podConfig.name}</p>
                  <span className="text-[8px] px-1 bg-emerald-500 text-white rounded font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold pixel-font text-[#5d4037]">SQUAD_ONLINE</span>
                  <div className="animate-pulse w-3 h-3 bg-emerald-400 rounded-full" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Labor Cost Accumulation</span>
                    <span className="text-indigo-600 font-bold">${podConfig.currentSpend.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all" style={{ width: `${Math.min(100, (podConfig.currentSpend / podConfig.budget) * 100)}%` }} />
                  </div>
                </div>
             </div>

             <div className="flex-1 flex flex-col gap-2">
               <label className="text-[10px] uppercase font-bold text-slate-400">Live Production Stream</label>
               <div className="flex-1 bg-[#1e293b] border-4 border-[#5d4037] rounded-sm p-3 font-mono text-[10px] overflow-y-auto custom-scrollbar text-emerald-400">
                  {deliverables.map(d => (
                    <div key={d.id} className="mb-3 border-l-2 border-emerald-500 pl-2 animate-in fade-in slide-in-from-left-2">
                      <div className="flex justify-between opacity-50 text-[7px] uppercase font-bold mb-1">
                        <span>{d.type}</span>
                        <span>{d.timestamp}</span>
                      </div>
                      <p className="text-emerald-100 leading-tight font-bold">{d.title}</p>
                      <p className="text-emerald-500 line-clamp-1 opacity-70 italic">{d.text}</p>
                    </div>
                  ))}
                  {deliverables.length === 0 && <p className="text-slate-500 italic">Awaiting AI workforce output...</p>}
               </div>
             </div>

             <button onClick={() => setPhase('charter')} className="w-full py-4 bg-rose-50 text-rose-600 border-4 border-rose-300 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mt-auto">
               TERMINATE POD <LogOut size={16} />
             </button>
          </div>
        )}
      </aside>

      {/* Main HQ Viewport */}
      <main className="flex-1 relative bg-[#fdf6e3] flex flex-col overflow-hidden">
        {phase === 'live' ? (
          <div className="flex-1 p-10 flex flex-col gap-6 h-full">
            {/* High-Contrast Command Header */}
            <div className="h-28 bg-white border-4 border-[#5d4037] p-5 flex gap-6 shadow-[8px_8px_0px_#d7ccc8] z-20">
               <div className="flex-1 flex flex-col gap-1">
                 <label className="text-[10px] uppercase font-bold text-indigo-500 flex items-center gap-2">
                   <HardDrive size={14} /> Production Queue Input (PR/Tickets)
                 </label>
                 <div className="flex gap-2">
                   <input 
                     id="work-input"
                     className="flex-1 bg-white border-2 border-[#5d4037] rounded px-4 py-2 text-sm font-bold text-black focus:ring-4 ring-indigo-50 transition-all outline-none" 
                     placeholder="Inject work request (e.g. PR #314 CI Checks failing)"
                     onKeyDown={(e) => { if (e.key === 'Enter') submitWork(e.currentTarget.value); }}
                   />
                   <button 
                     onClick={() => {
                       const val = (document.getElementById('work-input') as HTMLInputElement).value;
                       if (val) submitWork(val);
                     }}
                     className="px-8 bg-[#5d4037] text-white rounded font-bold text-xs hover:bg-black transition-all flex items-center gap-2 shadow-[4px_4px_0px_#e2e8f0]"
                   >
                     DEPLOY WORK <Send size={14} />
                   </button>
                 </div>
               </div>
               <div className="w-64 border-l-4 border-slate-100 pl-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert size={14} className="text-rose-500" />
                    <span className="text-[10px] font-bold uppercase text-[#5d4037]">Protocol Sentinel</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold leading-tight italic">{podConfig.approvalRule || 'Human-in-the-Loop Override Active'}</p>
               </div>
            </div>

            <div className="flex-1 relative">
              <OfficeMap agents={agents} onApprove={handleApprove} />
            </div>

            {/* AI Manager Command Log */}
            <div className="h-28 flex gap-4">
               <div className="flex-1 bg-white border-4 border-[#5d4037] p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar shadow-[4px_4px_0px_#e2e8f0]">
                  {logs.slice().reverse().map((l, i) => (
                    <div key={i} className={`mb-1 ${l.includes('[MGR]') ? 'text-indigo-700 font-bold border-l-2 border-indigo-200 pl-2' : 'text-slate-500'}`}>
                      <span className="text-slate-300 mr-2 text-[9px] tracking-tighter">[{new Date().toLocaleTimeString()}]</span>
                      {l}
                    </div>
                  ))}
               </div>
               <div className="w-52 bg-[#5d4037] text-white p-4 flex flex-col items-center justify-center text-center rounded shadow-lg">
                  <UserCheck size={32} className="mb-2 text-emerald-400" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white">Supervisor Live</p>
                  <p className="text-[9px] opacity-70 font-medium">Parallel Sync Active</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative w-full max-w-4xl aspect-[4/3] bg-white border-[8px] border-[#5d4037] rounded-sm p-12 shadow-[16px_16px_0px_rgba(93,64,55,0.1)] flex flex-col">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border-8 border-[#5d4037] px-12 py-4 rounded-t-2xl z-10">
                <span className="text-2xl pixel-font text-[#5d4037] uppercase tracking-[0.2em] font-bold">SQUAD_ARCHITECT_v4.5</span>
              </div>
              
              <div className="flex-1 border-4 border-slate-100 bg-[#f8fafc]/50 rounded p-8 flex flex-col items-center justify-center text-center gap-6 overflow-hidden">
                {phase === 'charter' && (
                  <div className="space-y-6">
                    <Layout size={80} className="mx-auto text-indigo-100 fill-white stroke-[#5d4037]" />
                    <h2 className="text-3xl pixel-font font-bold uppercase tracking-widest text-[#5d4037]">Initialize Pod Environment</h2>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed uppercase font-bold tracking-widest">Provide a unique pod name and directive to unlock the labor roster.</p>
                  </div>
                )}

                {phase === 'architect' && (
                  <div className="w-full flex flex-col items-center">
                    <div className="grid grid-cols-4 gap-8 mb-10">
                       {agents.map(a => (
                         <div key={a.id} onClick={() => setSelectedAgentId(a.id)} className={`w-28 h-28 rounded-2xl border-4 cursor-pointer transition-all flex items-center justify-center shadow-md ${selectedAgentId === a.id ? 'border-indigo-600 bg-white ring-8 ring-indigo-50 scale-110 z-10' : 'border-[#5d4037] bg-white hover:scale-105'}`}>
                            <div className="w-20 h-20 flex items-center justify-center">
                               <img src={a.avatar} className="pixelated w-full h-full" alt="avatar" />
                            </div>
                         </div>
                       ))}
                       {agents.length < 8 && (
                         <button onClick={addAgent} className="w-28 h-28 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-300 hover:text-[#5d4037] hover:border-[#5d4037] transition-all bg-white shadow-inner">
                           <Plus size={48} />
                         </button>
                       )}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl pixel-font font-bold uppercase text-[#5d4037]">Squad Recruitment: {agents.length} / 8</h3>
                      <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">Click a unit slot to define specialized logic & role backstory.</p>
                    </div>
                  </div>
                )}

                {phase === 'mapping' && (
                  <div className="space-y-8">
                     <FileCode size={80} className="mx-auto text-[#5d4037]" />
                     <h2 className="text-3xl pixel-font font-bold uppercase tracking-widest">Logic Handover Protocols</h2>
                     <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-bold uppercase tracking-tight">Connect the output nodes of your squad. The AI manager will handle real-time handoffs based on this logic map.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
