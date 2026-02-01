
import React, { useEffect, useState } from 'react';
import { ALU } from '../types';
import { 
  Monitor, Coffee, Cpu, Lock, MessageSquare, AlertCircle, 
  CheckCircle2, Calendar, CloudSun, Layout, UserCheck, ShieldAlert,
  Wind, Zap, Laptop, Briefcase, Trees as Plant, Clipboard, 
  Table, Users, Grid, MapPin
} from 'lucide-react';
import { generateMeetingDialogue } from '../services/gemini';

interface OfficeMapProps {
  agents: ALU[];
  onApprove: (id: string) => void;
}

const OfficeMap: React.FC<OfficeMapProps> = ({ agents, onApprove }) => {
  const [activeDialogue, setActiveDialogue] = useState<{agentId: string, text: string} | null>(null);

  useEffect(() => {
    const meetingTrigger = setInterval(async () => {
      const working = agents.filter(a => a.status === 'working' && a.connections.length > 0);
      if (working.length > 0 && Math.random() > 0.75) {
        const agentA = working[Math.floor(Math.random() * working.length)];
        const agentBId = agentA.connections[Math.floor(Math.random() * agentA.connections.length)];
        const agentB = agents.find(a => a.id === agentBId);
        
        if (agentB) {
          const dialogue = await generateMeetingDialogue(agentA, agentB);
          setActiveDialogue({ agentId: agentA.id, text: dialogue });
          setTimeout(() => setActiveDialogue(null), 5000);
        }
      }
    }, 12000);
    return () => clearInterval(meetingTrigger);
  }, [agents]);

  return (
    <div className="relative w-full h-full office-floor-tiled rounded-xl border-[8px] border-[#5d4037] overflow-hidden shadow-2xl">
      {/* Structural HQ Elements */}
      
      {/* Floor ID Overlay */}
      <div className="absolute top-4 right-6 pointer-events-none z-20 opacity-40">
        <div className="flex items-center gap-2 text-[#5d4037] pixel-font text-2xl font-bold uppercase">
          <MapPin size={20} /> FLOOR_08_PROD
        </div>
      </div>

      {/* Top Windows with Soft Glow */}
      <div className="absolute top-0 left-0 w-full h-24 flex justify-between px-32 pointer-events-none">
        <div className="w-56 h-28 bg-sky-50 border-x-8 border-b-8 border-white flex items-center justify-center opacity-50 shadow-inner">
          <CloudSun size={36} className="text-sky-200" />
        </div>
        <div className="w-56 h-28 bg-sky-50 border-x-8 border-b-8 border-white flex items-center justify-center opacity-50 shadow-inner">
          <Wind size={36} className="text-sky-200" />
        </div>
      </div>

      {/* Office Decorations */}
      <div className="absolute top-32 left-12 flex flex-col items-center opacity-30">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200 shadow-sm">
          <Plant size={28} className="text-emerald-600" />
        </div>
        <div className="w-16 h-8 bg-[#8d6e63] rounded-sm mt-[-6px] shadow-sm" />
      </div>

      {/* Conference Room Area */}
      <div className="absolute top-24 right-12 w-48 h-36 border-4 border-[#5d4037]/20 border-dashed rounded-lg flex flex-col items-center justify-center p-4 opacity-40">
         <div className="bg-white/80 border-2 border-slate-200 rounded p-1 mb-2">
            <Users size={20} className="text-slate-300" />
         </div>
         <span className="text-[9px] pixel-font font-bold uppercase text-slate-400">Strategic Sync Zone</span>
         <div className="mt-2 w-full h-1 bg-slate-100 rounded-full" />
         <div className="mt-1 w-2/3 h-1 bg-slate-100 rounded-full" />
      </div>

      <div className="absolute bottom-24 left-16 flex flex-col items-center opacity-30">
         <div className="w-28 h-40 bg-white border-4 border-slate-300 shadow-md p-3 flex flex-col gap-2 relative">
            <div className="w-full h-3 bg-indigo-50 rounded" />
            <div className="w-5/6 h-3 bg-indigo-50 rounded" />
            <div className="w-full h-20 bg-slate-50 border-2 border-slate-100 mt-auto flex items-center justify-center">
               <Grid size={32} className="text-slate-100" />
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-100 rounded-full border-2 border-amber-200 flex items-center justify-center">
               <Zap size={16} className="text-amber-500" />
            </div>
         </div>
         <span className="text-[8px] pixel-font mt-2 font-bold uppercase text-slate-400">Logic_Pipeline_Viz</span>
      </div>

      <div className="absolute bottom-16 right-20 flex flex-col items-center opacity-50 group">
        <div className="w-16 h-16 bg-[#5d4037] flex items-center justify-center rounded-t-2xl shadow-lg relative">
          <Coffee size={32} className="text-white animate-pulse" />
          <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full border-4 border-[#5d4037] flex items-center justify-center shadow-sm">
             <span className="text-[10px] font-bold">HOT</span>
          </div>
        </div>
        <div className="w-24 h-6 bg-slate-300 rounded-sm shadow-md" />
        <span className="text-[9px] pixel-font mt-2 uppercase font-bold text-[#5d4037]">AI Labor Sync Lounge</span>
      </div>

      {/* The Command HQ Desk (Manager) */}
      <div className="absolute top-[8%] left-[30%] w-[40%] h-[20%] flex flex-col items-center z-20">
         <div className="mb-3 px-6 py-1.5 bg-[#5d4037] text-white rounded-full text-[11px] pixel-font uppercase font-bold tracking-[0.2em] shadow-xl border-2 border-white/20 flex items-center gap-2">
           <Briefcase size={14} /> COMMAND_LEAD_STATION
         </div>
         <div className="w-80 h-20 bg-white border-4 border-[#5d4037] rounded-xl shadow-2xl flex items-center justify-around px-8 relative">
            <Monitor size={32} className="text-indigo-100" />
            <div className="w-40 h-3 bg-slate-50 border-2 border-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500/20 w-3/4 animate-pulse" />
            </div>
            <Laptop size={24} className="text-indigo-100" />
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
         </div>
      </div>

      {/* Cubicle Rows Rendering */}
      <div className="absolute top-[40%] left-0 w-full h-[55%] px-24 grid grid-cols-2 grid-rows-2 gap-x-56 gap-y-20">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="cubicle-space flex flex-col items-center justify-center border-dashed border-slate-200 opacity-40 rounded-xl">
            <div className="desk-pastel w-40 h-14 rounded-lg shadow-inner flex items-center justify-center gap-4">
              <Monitor size={16} className="text-white/40" />
              <div className="w-16 h-2 bg-white/20 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Agents Rendering */}
      {agents.map((agent) => (
        <div 
          key={agent.id}
          className="absolute agent-sprite z-50 group"
          style={{ 
            left: `${agent.position.x}%`, 
            top: `${agent.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Dialogue Bubble */}
          {activeDialogue?.agentId === agent.id && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-20 w-64 z-[100] animate-bounce">
              <div className="speech-bubble p-4 text-[13px] leading-tight font-bold pixel-font shadow-2xl bg-white border-4 border-[#5d4037]">
                <div className="text-indigo-600 text-[10px] uppercase mb-1 tracking-tighter font-black border-b border-indigo-50 pb-1">{agent.name || agent.role}</div>
                {activeDialogue.text}
              </div>
            </div>
          )}

          {/* Intervention Button (High Performance Alert) */}
          {agent.status === 'waiting_approval' && (
            <div className="absolute -top-44 left-1/2 -translate-x-1/2 w-72 z-[110] animate-pulse">
               <button 
                 onClick={() => onApprove(agent.id)}
                 className="w-full bg-rose-600 border-4 border-black text-white px-6 py-4 rounded-xl pixel-font font-black text-3xl shadow-[8px_8px_0px_#5d4037] hover:bg-rose-500 transition-all flex items-center justify-center gap-3 active:translate-x-1 active:translate-y-1 active:shadow-none"
               >
                 <ShieldAlert size={32} /> APPROVE PR #314
               </button>
               <div className="mt-4 bg-white border-4 border-rose-600 p-3 rounded-lg text-[11px] pixel-font text-center font-black uppercase shadow-2xl text-rose-600 leading-tight">
                 CRITICAL PRODUCTION RISK DETECTED<br/>AWAITING HUMAN AUTHORIZATION
               </div>
            </div>
          )}

          {/* Character Viewport */}
          <div className="flex flex-col items-center">
            {/* Status Tooltip (Above Head) */}
            {agent.status === 'waiting_approval' && (
              <div className="mb-3 bg-rose-50 border-2 border-rose-500 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                <ShieldAlert size={16} className="text-rose-600" />
                <span className="text-[11px] pixel-font font-black uppercase text-rose-600">HALTED: SAFETY_FAIL</span>
              </div>
            )}
            
            {agent.status === 'working' && (
               <div className="mb-3 bg-emerald-50 border-2 border-emerald-400 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                <Zap size={14} className="text-emerald-500" />
                <span className="text-[11px] pixel-font font-black uppercase text-emerald-600">EXECUTING_LOGIC</span>
              </div>
            )}

            {/* Avatar with Glow */}
            <div className="relative group-hover:scale-110 transition-transform cursor-pointer">
              <div className={`w-28 h-28 flex items-center justify-center transition-all duration-500 ${agent.status === 'waiting_approval' ? 'grayscale opacity-70 scale-95' : 'drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]'}`}>
                <img 
                  src={agent.avatar} 
                  className="w-full h-full object-contain pixelated" 
                  style={{ imageRendering: 'pixelated' }}
                  alt="AI Worker"
                />
              </div>
              
              {/* Animated Progress Bar */}
              {agent.status === 'working' && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-white border-[3px] border-[#5d4037] rounded-full overflow-hidden shadow-xl z-10">
                   <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 transition-all duration-300 animate-pulse" 
                    style={{ width: `${agent.progress}%` }} 
                   />
                </div>
              )}
            </div>

            {/* Heavy-weight Nameplate */}
            <div className={`mt-5 px-5 py-2.5 bg-white border-[4px] rounded-lg shadow-2xl transition-all ${agent.isManager ? 'border-indigo-600 ring-[6px] ring-indigo-50 -translate-y-2' : 'border-[#5d4037]'}`}>
              <div className={`text-[14px] pixel-font font-black uppercase whitespace-nowrap leading-none tracking-wide ${agent.isManager ? 'text-indigo-600' : 'text-[#5d4037]'}`}>
                {agent.role || 'UNASSIGNED_UNIT'}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-slate-100">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'working' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-[9px] pixel-font text-slate-400 uppercase font-black tracking-widest">
                  {agent.name || 'UNIT_STATION_' + agent.id.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Connection Protocol Matrix (The Hive) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-[0.12]">
        {agents.map(a => a.connections.map(targetId => {
          const target = agents.find(t => t.id === targetId);
          if (!target) return null;
          return (
            <path 
              key={`${a.id}-${targetId}`}
              d={`M ${a.position.x}% ${a.position.y}% Q ${(a.position.x + target.position.x)/2}% ${(a.position.y + target.position.y)/2 - 12}%, ${target.position.x}% ${target.position.y}%`}
              fill="none" stroke="#5d4037" strokeWidth="4" strokeDasharray="12 6"
              className="animate-[dash_8s_linear_infinite]"
            />
          );
        }))}
      </svg>
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -120; }
        }
      `}</style>
    </div>
  );
};

export default OfficeMap;
