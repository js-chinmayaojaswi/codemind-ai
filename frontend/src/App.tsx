import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, NavView } from './components/layout/Sidebar';
import { LandingPageView } from './views/LandingPageView';
import { DashboardView } from './views/DashboardView';
import { ComparisonView } from './views/ComparisonView';
import { TeamDnaView } from './views/TeamDnaView';
import { HistoryView } from './views/HistoryView';
import { StatsSummary, TeamProfile } from './types';
import { api, INITIAL_STATS, INITIAL_TEAM_PROFILE } from './services/api';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavView>('landing');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [stats, setStats] = useState<StatsSummary>(INITIAL_STATS);
  const [teamProfile, setTeamProfile] = useState<TeamProfile>(INITIAL_TEAM_PROFILE);
  const [comparisonCode, setComparisonCode] = useState<string>('');

  useEffect(() => {
    // Fetch live stats & profile from backend
    const fetchInitial = async () => {
      try {
        const [liveStats, liveProfile] = await Promise.all([
          api.getStats(),
          api.getTeamProfile(),
        ]);
        setStats(liveStats);
        setTeamProfile(liveProfile);
      } catch {
        // Keeps graceful defaults
      }
    };
    fetchInitial();
  }, []);

  const handleNavigateToComparison = (codeToCompare: string) => {
    setComparisonCode(codeToCompare);
    setActiveView('comparison');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <Header 
        activeBankId={teamProfile.bank_id}
        activeView={activeView}
        onViewChange={setActiveView}
        isBackendConnected={true}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          activeRulesCount={stats.active_rules}
        />

        {/* Dynamic View Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#0a0d14] via-[#0d111a] to-[#0a0d14]">
          <div className="max-w-7xl mx-auto">
            {activeView === 'landing' && (
              <LandingPageView
                onLaunchStudio={() => setActiveView('dashboard')}
                onExploreComparison={() => setActiveView('comparison')}
                onViewDna={() => setActiveView('team-dna')}
                metrics={teamProfile.metrics}
              />
            )}

            {activeView === 'dashboard' && (
              <DashboardView
                stats={stats}
                onStatsUpdate={setStats}
                onNavigateToComparison={handleNavigateToComparison}
              />
            )}

            {activeView === 'comparison' && (
              <ComparisonView initialCode={comparisonCode} />
            )}

            {activeView === 'team-dna' && (
              <TeamDnaView />
            )}

            {activeView === 'history' && (
              <HistoryView />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
