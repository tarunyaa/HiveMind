
import React from 'react';
import { ALU, ModelType } from '../types';
import { Activity, Play, Pause, AlertCircle, Settings2, Code, ShieldAlert } from 'lucide-react';

interface AgentCardProps {
  agent: ALU;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onPause, onResume }) => {
  // Updated statusColors to cover all possible status values from ALU['status']
  const statusColors: Record<ALU['status'], string> = {
    idle: 'bg-slate-500',
    working: 'bg-emerald-500',
    paused: 'bg-amber-500',
    blocked: 'bg-rose-500',
    waiting: 'bg-amber-400',
    meeting: 'bg-indigo-400',
    waiting_approval: 'bg-amber-400'
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-md group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${statusColors[agent.status]} ${agent.status === 'working' ? 'status-pulse' : ''}`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 leading-tight">{agent.name}</h3>
            <p className="text-xs text-slate-400 font-medium">{agent.role}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {agent.status === 'working' ? (
            <button onClick={() => onPause(agent.id)} className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-amber-400 transition-colors">
              <Pause size={16} />
            </button>
          ) : (
            <button onClick={() => onResume(agent.id)} className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-emerald-400 transition-colors">
              <Play size={16} />
            </button>
          )}
          <button className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-indigo-400 transition-colors">
            <Settings2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500">
          <span>{agent.model}</span>
          <span className="text-indigo-400">${agent.costPerHour}/hr</span>
        </div>

        {agent.status === 'working' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-300 truncate max-w-[150px]">{agent.currentTask}</span>
              <span className="text-slate-400">{agent.progress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-1000" 
                style={{ width: `${agent.progress}%` }} 
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {agent.tools.slice(0, 2).map(tool => (
            <span key={tool} className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] mono">
              {tool}
            </span>
          ))}
          {agent.tools.length > 2 && (
            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] mono">
              +{agent.tools.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
