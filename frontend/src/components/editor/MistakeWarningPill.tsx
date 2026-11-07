import React from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { MistakePrediction } from '../../types';

interface MistakeWarningPillProps {
  prediction: MistakePrediction | null;
  onApplyFix?: () => void;
}

export const MistakeWarningPill: React.FC<MistakeWarningPillProps> = ({
  prediction,
  onApplyFix,
}) => {
  if (!prediction || !prediction.detected) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="font-medium">Mistake Predictor:</span>
        <span className="text-emerald-400/80">Code complies with recalled team precedents. No recurring anti-patterns detected.</span>
      </div>
    );
  }

  const isError = prediction.severity === 'error';

  return (
    <div 
      className={`rounded-xl p-3 border transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
        isError 
          ? 'bg-rose-950/30 border-rose-500/40 text-rose-200 shadow-lg shadow-rose-950/30' 
          : 'bg-amber-950/30 border-amber-500/40 text-amber-200 shadow-lg shadow-amber-950/30'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2.5">
          <div className={`p-1.5 rounded-lg mt-0.5 ${isError ? 'bg-rose-900/60 text-rose-300' : 'bg-amber-900/60 text-amber-300'}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 border border-current/20">
                PROACTIVE MISTAKE PREDICTION
              </span>
              <span className="text-xs font-semibold text-white">
                {prediction.title}
              </span>
              {prediction.historical_occurrences > 0 && (
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700 text-slate-300 font-mono">
                  Failed in {prediction.historical_occurrences} past PRs
                </span>
              )}
            </div>
            
            <p className="text-xs mt-1 text-slate-300 leading-relaxed">
              {prediction.explanation}
            </p>

            {prediction.prevention_tip && (
              <div className="mt-2 text-xs font-mono bg-black/50 p-2 rounded-lg border border-slate-800 text-slate-200 flex items-center justify-between">
                <span>💡 Tip: {prediction.prevention_tip}</span>
                {onApplyFix && (
                  <button
                    onClick={onApplyFix}
                    className="ml-3 px-2 py-1 text-[11px] rounded bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-medium flex items-center space-x-1"
                  >
                    <span>Auto-Fix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
