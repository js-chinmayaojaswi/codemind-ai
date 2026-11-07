import React, { useState, useEffect } from 'react';
import { TeamDnaRadar } from '../components/dna/TeamDnaRadar';
import { RuleList } from '../components/dna/RuleList';
import { TeamProfile } from '../types';
import { api, INITIAL_TEAM_PROFILE } from '../services/api';
import { Dna, ShieldCheck, Download, Sparkles, Database } from 'lucide-react';

export const TeamDnaView: React.FC = () => {
  const [profile, setProfile] = useState<TeamProfile>(INITIAL_TEAM_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTeamProfile();
      setProfile(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDNA = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `team-coding-dna-${profile.bank_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="p-5 rounded-xl bg-dark-card border border-dark-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">
                Team Coding DNA Profile
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                Standout Feature #1
              </span>
            </div>
            <p className="text-xs text-dark-muted">
              Live organizational knowledge graph synthesized continuously via Hindsight explicit memory operations
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs bg-dark-bg border border-dark-border px-3 py-1.5 rounded-lg">
            <Database className="w-3.5 h-3.5 text-brand-secondary" />
            <span className="text-dark-muted">Hindsight Bank:</span>
            <span className="font-mono text-cyan-400 font-bold">{profile.bank_id}</span>
          </div>

          <button
            onClick={handleExportDNA}
            className="px-3.5 py-1.5 rounded-lg bg-dark-hover hover:bg-slate-800 text-slate-200 border border-dark-border text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DNA</span>
          </button>
        </div>
      </div>

      {/* Grid: Radar Chart + Rule Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Recharts Radar (5 cols) */}
        <div className="lg:col-span-5">
          <TeamDnaRadar
            metrics={profile.metrics}
            teamName={profile.team_name}
          />
        </div>

        {/* Right Column: Learned Rule Catalog (7 cols) */}
        <div className="lg:col-span-7">
          <RuleList rules={profile.rules} />
        </div>
      </div>
    </div>
  );
};
