import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { TeamDnaMetric } from '../../types';
import { Dna, Sparkles } from 'lucide-react';

interface TeamDnaRadarProps {
  metrics: TeamDnaMetric[];
  teamName: string;
}

export const TeamDnaRadar: React.FC<TeamDnaRadarProps> = ({ metrics, teamName }) => {
  return (
    <div className="rounded-xl bg-dark-card border border-dark-border p-5 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Team Coding DNA Profile</h3>
            <p className="text-[11px] text-dark-muted font-mono">{teamName} • Memory Bank Synthesized</p>
          </div>
        </div>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
          Radar V1
        </span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={metrics}>
            <PolarGrid stroke="#1e2638" />
            <PolarAngleAxis 
              dataKey="category" 
              stroke="#94a3b8" 
              tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 500 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              stroke="#334155" 
              tick={{ fill: '#64748b', fontSize: 9 }} 
            />
            <Radar
              name="Team Adherence"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.45}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-dark-bg border border-dark-border p-2.5 rounded-lg shadow-xl text-xs">
                      <p className="font-semibold text-white">{data.category}</p>
                      <p className="text-indigo-400 font-mono mt-0.5">Enforcement Score: {data.score}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-lg bg-dark-bg border border-dark-border">
          <span className="text-[10px] text-dark-muted block">Security</span>
          <span className="font-bold text-emerald-400 font-mono">98% Strict</span>
        </div>
        <div className="p-2 rounded-lg bg-dark-bg border border-dark-border">
          <span className="text-[10px] text-dark-muted block">Concurrency</span>
          <span className="font-bold text-indigo-400 font-mono">95% Strict</span>
        </div>
        <div className="p-2 rounded-lg bg-dark-bg border border-dark-border">
          <span className="text-[10px] text-dark-muted block">Resilience</span>
          <span className="font-bold text-cyan-400 font-mono">94% Strict</span>
        </div>
      </div>
    </div>
  );
};
