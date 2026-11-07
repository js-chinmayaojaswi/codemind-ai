import React from 'react';
import { 
  CheckCircle2, 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Database 
} from 'lucide-react';
import { StatsSummary } from '../../types';

interface MetricCardsProps {
  stats: StatsSummary;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Explicit Rules Learned',
      value: stats.active_rules.toString(),
      subtext: 'Retained in Hindsight bank',
      icon: Database,
      trend: '+4 this week',
      accentColor: 'text-brand-secondary',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      glow: 'shadow-cyan-900/10',
    },
    {
      title: 'Memory Precision Rate',
      value: `${stats.precision_rate}%`,
      subtext: 'Developer review acceptance',
      icon: CheckCircle2,
      trend: '+18% vs Generic LLM',
      accentColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      glow: 'shadow-emerald-900/10',
    },
    {
      title: 'Anti-Patterns Prevented',
      value: stats.bugs_prevented.toString(),
      subtext: 'Intercepted pre-submission',
      icon: ShieldCheck,
      trend: 'Zero false negatives',
      accentColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      glow: 'shadow-indigo-900/10',
    },
    {
      title: 'Total PRs Reviewed',
      value: stats.total_reviews.toString(),
      subtext: 'Groq Llama 3.3 accelerated',
      icon: TrendingUp,
      trend: '240 tok/s avg latency',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      glow: 'shadow-amber-900/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-dark-card border border-dark-border hover:border-dark-border/80 transition-all hover:translate-y-[-1px] shadow-lg ${card.glow}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-dark-muted">{card.title}</span>
              <div className="p-2 rounded-lg bg-dark-bg border border-dark-border/60">
                <Icon className={`w-4 h-4 ${card.accentColor}`} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                {card.value}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${card.badgeBg}`}>
                {card.trend}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-400">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
};
