import React from 'react';
import { 
  Code2, 
  GitCompare, 
  Dna, 
  History, 
  BrainCircuit, 
  ChevronLeft, 
  ChevronRight,
  Globe,
  Sparkles,
  Layers
} from 'lucide-react';

export type NavView = 'landing' | 'dashboard' | 'comparison' | 'team-dna' | 'history';

interface SidebarProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeRulesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  collapsed,
  onToggleCollapse,
  activeRulesCount = 28,
}) => {
  const navItems = [
    {
      id: 'landing' as NavView,
      label: 'Product Website',
      description: 'Platform overview & architecture',
      icon: Globe,
      badge: 'Home',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'dashboard' as NavView,
      label: 'Review Studio',
      description: 'Monaco Editor & Mistake Predictor',
      icon: Code2,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'comparison' as NavView,
      label: 'A/B Comparison',
      description: 'Generic LLM vs. Hindsight Memory',
      icon: GitCompare,
      badge: 'Proof UI',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'team-dna' as NavView,
      label: 'Team Coding DNA',
      description: 'Synthesized radar & learned rules',
      icon: Dna,
      badge: `${activeRulesCount} Rules`,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'history' as NavView,
      label: 'Retention History',
      description: 'Continuous learning audit log',
      icon: History,
      badge: null,
      badgeColor: '',
    },
  ];

  return (
    <aside 
      className={`relative border-r border-dark-border bg-dark-card flex flex-col justify-between transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4">
        {/* Navigation Section */}
        <div className="space-y-1.5">
          {!collapsed && (
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-dark-muted">
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center rounded-xl p-3 text-left transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 text-white border border-indigo-500/30 shadow-md shadow-indigo-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-dark-hover border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className={`p-1.5 rounded-lg mr-3 ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-dark-bg text-slate-400 group-hover:text-slate-200'
                }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-dark-muted truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                )}

                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-l-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feature Spotlight Card (when expanded) */}
        {!collapsed && (
          <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-indigo-500/20">
            <div className="flex items-center space-x-2 text-indigo-400 mb-1.5">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold tracking-wide uppercase">Hindsight Retain</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every accepted review or rejection reason updates your team memory bank without manual fine-tuning.
            </p>
          </div>
        )}
      </div>

      {/* Footer & Collapse Toggle */}
      <div className="p-4 border-t border-dark-border/60">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-dark-hover transition-colors text-xs font-medium"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
