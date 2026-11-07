import React from 'react';
import { History, CheckCircle2, XCircle, Sparkles, Database, ArrowRight } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const historyItems = [
    {
      id: "hist-001",
      action: "RETAIN_EXCEPTION",
      developer: "Alex Rivera (Staff Eng)",
      context: "PR #1042 — Auth Token Introspection",
      details: "Rejected generic suggestion to cache introspection tokens. Retained exception in Hindsight: 'Never cache revoked token responses; must query IdP directly.'",
      timestamp: "Today, 14:22",
      bankImpact: "Updated rule exception index for Auth subsystem",
    },
    {
      id: "hist-002",
      action: "RETAIN_RULE",
      developer: "Samantha Chen (Tech Lead)",
      context: "Manual Ingestion via CodeMind Bar",
      details: "Taught new convention: 'All Kafka consumer handlers must be idempotent with Redis lock key format event:{event_id}.'",
      timestamp: "Yesterday, 17:05",
      bankImpact: "New architectural rule #109 synthesized",
    },
    {
      id: "hist-003",
      action: "REINFORCE_CONVENTION",
      developer: "Jordan Blake (Sr Backend Eng)",
      context: "PR #1038 — Billing Sync",
      details: "Accepted violation flag: Swapped synchronous SQLAlchemy query for AsyncSession in FastAPI route.",
      timestamp: "Yesterday, 11:30",
      bankImpact: "Rule #101 confidence boosted to 99%",
    },
    {
      id: "hist-004",
      action: "PREVENTED_MISTAKE",
      developer: "Maria Gomez (Software Eng)",
      context: "Monaco Studio Keystroke Intercept",
      details: "Proactive Mistake Predictor warned against unindexed raw SQL f-string before code was submitted to GitHub.",
      timestamp: "2 days ago",
      bankImpact: "Zero PR revision delay; saved ~45m review cycle",
    }
  ];

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Continuous Learning & Retention Audit Log</h2>
            <p className="text-xs text-dark-muted font-mono">
              Live ledger of Hindsight <code className="text-indigo-400 font-mono">retain()</code> and <code className="text-cyan-400 font-mono">recall()</code> operations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-dark-bg border border-dark-border px-3 py-1.5 rounded-lg text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hindsight Ingestion: ACTIVE</span>
        </div>
      </div>

      <div className="rounded-xl bg-dark-card border border-dark-border p-5 space-y-4">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-dark-bg border border-dark-border/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-dark-border transition-colors"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  item.action === 'RETAIN_RULE'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : item.action === 'RETAIN_EXCEPTION'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : item.action === 'PREVENTED_MISTAKE'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {item.action}
                </span>
                <span className="text-xs font-semibold text-slate-300">{item.context}</span>
                <span className="text-xs text-dark-muted">• {item.developer}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.details}
              </p>
              <div className="text-[11px] text-indigo-300/80 font-mono flex items-center space-x-1 pt-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Memory Impact: {item.bankImpact}</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0 text-xs font-mono text-dark-muted">
              {item.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
