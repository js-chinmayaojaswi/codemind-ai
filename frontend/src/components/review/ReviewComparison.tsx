import React from 'react';
import { 
  GitCompare, 
  Sparkles, 
  Bot, 
  BrainCircuit, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers
} from 'lucide-react';
import { ReviewComparisonData } from '../../types';
import { ReviewCard } from './ReviewCard';

interface ReviewComparisonProps {
  data: ReviewComparisonData | null;
  isLoading?: boolean;
}

export const ReviewComparison: React.FC<ReviewComparisonProps> = ({
  data,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="p-12 text-center rounded-xl bg-dark-card border border-dark-border">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-semibold text-white">Running Parallel A/B Inference on Groq...</h3>
        <p className="text-xs text-dark-muted mt-1 max-w-md mx-auto">
          Executing Stream 1 (Generic Stateless LLM) and Stream 2 (Hindsight Recall + Augmented LLM) simultaneously.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center rounded-xl bg-dark-card border border-dark-border text-dark-muted text-xs">
        Click "Compare Generic vs Memory" above to trigger side-by-side evaluation.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Memory Lift Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-emerald-950/40 border border-indigo-500/30 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Hindsight Memory Value Proof
              </span>
              <p className="text-xs text-slate-200 mt-0.5">
                {data.memory_lift_summary}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {data.rules_enforced.length} Custom Invariants Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pane A: Generic LLM (Stateless) */}
        <div className="rounded-xl bg-dark-card border border-slate-800 flex flex-col">
          <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-300">Generic LLM (Stateless)</h4>
                <p className="text-[10px] text-slate-500 font-mono">Zero Memory • Standard PEP-8 / Linter Prompt</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-amber-400 font-mono">Score: {data.generic_review.score}/100</span>
              <span className="block text-[10px] text-slate-500 font-mono">{data.generic_review.execution_time_ms}ms</span>
            </div>
          </div>

          <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
            <div className="text-[11px] text-slate-400 italic bg-dark-bg/60 p-2.5 rounded-lg border border-slate-800">
              "{data.generic_review.summary}"
            </div>

            <div className="space-y-2.5">
              {data.generic_review.items.map((item) => (
                <ReviewCard key={item.id} item={item} isAugmented={false} />
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Analysis: </span>
              The generic model caught basic syntax suggestions, but completely missed catastrophic event-loop blocking and transaction violation because it lacks organizational context.
            </div>
          </div>
        </div>

        {/* Pane B: CodeMind AI (Memory-Augmented via Hindsight) */}
        <div className="rounded-xl bg-dark-card border border-indigo-500/40 flex flex-col shadow-xl shadow-indigo-950/20">
          <div className="p-3.5 border-b border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 to-slate-950 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>CodeMind AI (Hindsight Memory)</span>
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1 rounded font-mono">AUGMENTED</span>
                </h4>
                <p className="text-[10px] text-indigo-300 font-mono">Bank 'team-codemind' • Explicit Precedent Recall</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-rose-400 font-mono">Score: {data.augmented_review.score}/100</span>
              <span className="block text-[10px] text-indigo-300/80 font-mono">{data.augmented_review.execution_time_ms}ms</span>
            </div>
          </div>

          <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
            <div className="text-[11px] text-indigo-200 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20">
              "{data.augmented_review.summary}"
            </div>

            <div className="space-y-2.5">
              {data.augmented_review.items.map((item) => (
                <ReviewCard key={item.id} item={item} isAugmented={true} />
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-200">
              <span className="font-semibold text-white">Why this matters: </span>
              CodeMind AI prevented a production outage by recalling Incident INC-402 and past architecture decisions from the team's Hindsight memory bank.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
