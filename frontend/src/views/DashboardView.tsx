import React, { useState, useEffect, useRef } from 'react';
import { MonacoCodeEditor } from '../components/editor/MonacoCodeEditor';
import { MistakeWarningPill } from '../components/editor/MistakeWarningPill';
import { ReviewCard } from '../components/review/ReviewCard';
import { FeedbackBar } from '../components/review/FeedbackBar';
import { MetricCards } from '../components/stats/MetricCards';
import { 
  ReviewResult, 
  ReviewItem, 
  MistakePrediction, 
  StatsSummary 
} from '../types';
import { api, CODE_PRESETS } from '../services/api';
import { Sparkles, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardViewProps {
  stats: StatsSummary;
  onStatsUpdate: (stats: StatsSummary) => void;
  onNavigateToComparison: (code: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onStatsUpdate,
  onNavigateToComparison,
}) => {
  const [code, setCode] = useState<string>(CODE_PRESETS[0].code);
  const [language, setLanguage] = useState<string>('python');
  const [prediction, setPrediction] = useState<MistakePrediction | null>(null);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const typingTimeoutRef = useRef<number | null>(null);

  // Debounced real-time Mistake Prediction as developer types in Monaco
  useEffect(() => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(async () => {
      if (code.trim().length > 10) {
        const pred = await api.predictMistake(code, language);
        setPrediction(pred);
      } else {
        setPrediction(null);
      }
    }, 350);

    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [code, language]);

  const handleRunReview = async () => {
    setIsLoading(true);
    setStatusMessage('Querying Hindsight memory bank & running Groq Llama 3.3...');
    try {
      const comparison = await api.compareReviews(code, language);
      setReviewResult(comparison.augmented_review);
      setStatusMessage('');
    } catch {
      setStatusMessage('Failed to complete review.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptItem = async (item: ReviewItem) => {
    await api.submitFeedback({
      review_id: reviewResult?.id || 'rev-1',
      item_id: item.id,
      action: 'accept',
    });
    onStatsUpdate({
      ...stats,
      precision_rate: Math.min(100, Number((stats.precision_rate + 0.2).toFixed(1))),
    });
  };

  const handleRejectItem = async (item: ReviewItem, reason: string) => {
    await api.submitFeedback({
      review_id: reviewResult?.id || 'rev-1',
      item_id: item.id,
      action: 'reject',
      rejection_reason: reason,
    });
    onStatsUpdate({
      ...stats,
      active_rules: stats.active_rules + 1,
    });
  };

  const handleTeachRule = async (ruleText: string, category: string) => {
    await api.submitFeedback({
      review_id: 'manual-teach',
      item_id: 'new-rule',
      action: 'teach',
      new_rule_content: ruleText,
    });
    onStatsUpdate({
      ...stats,
      active_rules: stats.active_rules + 1,
      bugs_prevented: stats.bugs_prevented + 1,
    });
  };

  const handleApplyFix = () => {
    // Quick fix for the async session anti-pattern
    if (code.includes('db: Session = Depends(get_db)')) {
      const fixed = code
        .replace('from sqlalchemy.orm import Session', 'from sqlalchemy.ext.asyncio import AsyncSession\nfrom sqlalchemy import select')
        .replace('db: Session = Depends(get_db)', 'db: AsyncSession = Depends(get_async_db)')
        .replace('user = db.query(UserModel).filter(UserModel.id == user_id).first()\n    db.commit()', 'result = await db.execute(select(UserModel).where(UserModel.id == user_id))\n    user = result.scalars().first()');
      setCode(fixed);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Metric Cards */}
      <MetricCards stats={stats} />

      {/* Real-time Mistake Prediction Warning */}
      <MistakeWarningPill 
        prediction={prediction} 
        onApplyFix={prediction?.detected ? handleApplyFix : undefined}
      />

      {/* Main Dual Grid: Editor & Review Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Monaco Editor Container (7 cols) */}
        <div className="lg:col-span-7 h-[580px] flex flex-col">
          <MonacoCodeEditor
            code={code}
            language={language}
            onChange={(val) => setCode(val || '')}
            onLanguageChange={setLanguage}
            onRunReview={handleRunReview}
            onRunComparison={() => onNavigateToComparison(code)}
            onReset={() => setCode(CODE_PRESETS[0].code)}
            isLoading={isLoading}
          />
        </div>

        {/* Review Results Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[580px] bg-dark-card rounded-xl border border-dark-border p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">CodeMind Review Feed</h3>
                <p className="text-[11px] text-dark-muted font-mono">Hindsight Memory-Augmented Review</p>
              </div>
            </div>

            {reviewResult && (
              <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                reviewResult.score < 50 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                Quality Score: {reviewResult.score}/100
              </span>
            )}
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-xs text-indigo-300 font-medium">Recalling team precedents from Hindsight bank...</p>
                <p className="text-[11px] text-dark-muted">Synthesizing review with Groq Llama 3.3</p>
              </div>
            ) : reviewResult ? (
              <>
                <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                  <span className="font-semibold text-indigo-300">Memory Synthesis: </span>
                  {reviewResult.summary}
                </div>
                {reviewResult.items.map((item) => (
                  <ReviewCard
                    key={item.id}
                    item={item}
                    onAccept={handleAcceptItem}
                    onReject={handleRejectItem}
                    isAugmented={true}
                  />
                ))}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-dark-muted">
                <Terminal className="w-10 h-10 mb-2 opacity-40 text-slate-500" />
                <p className="text-xs font-semibold text-slate-300">Ready to Analyze</p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Type code in the Monaco Editor or select a preset anti-pattern above, then click <strong>"Analyze Code"</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teach Agent New Rule Bar */}
      <FeedbackBar onTeachRule={handleTeachRule} />
    </div>
  );
};
