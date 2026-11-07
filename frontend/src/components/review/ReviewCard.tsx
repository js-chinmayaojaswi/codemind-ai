import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  Check, 
  X, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { ReviewItem } from '../../types';

interface ReviewCardProps {
  item: ReviewItem;
  onAccept?: (item: ReviewItem) => void;
  onReject?: (item: ReviewItem, reason: string) => void;
  isAugmented?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  item,
  onAccept,
  onReject,
  isAugmented = true,
}) => {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [feedbackState, setFeedbackState] = useState<'none' | 'accepted' | 'rejected'>('none');

  const severityConfig = {
    error: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      badge: 'bg-rose-500/20 text-rose-300',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300',
      icon: AlertTriangle,
    },
    suggestion: {
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-300',
      icon: Lightbulb,
    },
    info: {
      bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
      badge: 'bg-slate-500/20 text-slate-300',
      icon: AlertCircle,
    },
  }[item.severity] || {
    bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
    badge: 'bg-slate-500/20 text-slate-300',
    icon: AlertCircle,
  };

  const Icon = severityConfig.icon;

  const handleAccept = () => {
    setFeedbackState('accepted');
    onAccept?.(item);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return;
    setFeedbackState('rejected');
    setShowRejectInput(false);
    onReject?.(item, rejectReason);
  };

  return (
    <div className={`rounded-xl border p-4 transition-all bg-dark-card ${
      isAugmented ? 'border-dark-border hover:border-indigo-500/40' : 'border-dark-border/60'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start space-x-2.5">
          <div className={`p-1.5 rounded-lg mt-0.5 border ${severityConfig.bg}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${severityConfig.badge}`}>
                {item.severity}
              </span>
              <span className="text-[10px] bg-dark-bg text-slate-300 px-2 py-0.5 rounded border border-dark-border font-mono">
                Line {item.line_start}{item.line_end !== item.line_start ? `-${item.line_end}` : ''}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 capitalize">
                {item.category}
              </span>
              {item.confidence && (
                <span className="text-[10px] text-dark-muted font-mono ml-1">
                  {item.confidence}% match
                </span>
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-100 leading-snug">
              {item.title}
            </h4>
          </div>
        </div>

        {/* Feedback State Badge */}
        {feedbackState !== 'none' && (
          <span className={`text-xs px-2.5 py-1 rounded-md font-medium font-mono ${
            feedbackState === 'accepted' 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {feedbackState === 'accepted' ? '✓ Retained: Rule Reinforced' : '✗ Retained: Exception Logged'}
          </span>
        )}
      </div>

      {/* Message */}
      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
        {item.message}
      </p>

      {/* Provenance: Hindsight Memory Citation */}
      {item.memory_origin && (
        <div className="mt-3 p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 flex items-start space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="text-[11px] text-indigo-200">
            <span className="font-semibold text-indigo-300">Hindsight Memory Citation: </span>
            <span>{item.memory_origin}</span>
            {item.rule_citation && (
              <div className="text-indigo-400 font-mono mt-0.5 font-medium">
                Enforcing: {item.rule_citation}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Code Suggestion */}
      {item.suggestion && (
        <div className="mt-3">
          <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Recommended Compliant Code:</span>
          </div>
          <pre className="p-2.5 rounded-lg bg-dark-bg border border-dark-border text-xs font-mono text-emerald-300 overflow-x-auto">
            <code>{item.suggestion}</code>
          </pre>
        </div>
      )}

      {/* Feedback Action Buttons (Continuous Learning Trigger) */}
      {isAugmented && feedbackState === 'none' && (
        <div className="mt-3 pt-3 border-t border-dark-border/60 flex items-center justify-between">
          <span className="text-[11px] text-dark-muted">
            Train agent on this review:
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRejectInput(!showRejectInput)}
              className="px-2.5 py-1 text-xs rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-dark-border transition-colors flex items-center space-x-1"
            >
              <X className="w-3 h-3" />
              <span>Reject Suggestion</span>
            </button>
            <button
              onClick={handleAccept}
              className="px-3 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all flex items-center space-x-1"
            >
              <Check className="w-3 h-3" />
              <span>Accept & Retain</span>
            </button>
          </div>
        </div>
      )}

      {/* Reject Reason Input */}
      {showRejectInput && feedbackState === 'none' && (
        <div className="mt-3 p-3 rounded-lg bg-dark-bg border border-dark-border space-y-2">
          <label className="text-[11px] font-semibold text-slate-300 block">
            Why is this suggestion invalid? (Will be retained into Hindsight to prevent repeat flags)
          </label>
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. This is a one-off legacy endpoint exempt from async pool..."
            className="w-full bg-dark-card border border-dark-border rounded-lg text-xs text-white p-2 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowRejectInput(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim()}
              className="px-3 py-1 text-xs rounded bg-rose-600 hover:bg-rose-500 text-white font-medium disabled:opacity-50"
            >
              Retain Exception in Hindsight
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
