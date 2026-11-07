import React, { useState } from 'react';
import { BrainCircuit, Plus, CheckCircle, Sparkles, Send } from 'lucide-react';

interface FeedbackBarProps {
  onTeachRule: (ruleText: string, category: string) => Promise<void>;
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({ onTeachRule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ruleText, setRuleText] = useState('');
  const [category, setCategory] = useState('Architecture');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleText.trim()) return;

    setIsSubmitting(true);
    try {
      await onTeachRule(ruleText, category);
      setSuccessMessage(`Successfully retained into Hindsight bank 'team-codemind'!`);
      setRuleText('');
      setTimeout(() => {
        setSuccessMessage('');
        setIsOpen(false);
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl bg-dark-card border border-dark-border p-4">
      {!isOpen ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Teach Agent a New Team Convention</h4>
              <p className="text-[11px] text-dark-muted">Directly invoke Hindsight <code className="text-indigo-300 font-mono">retain()</code> to persist team rules</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Teach Convention</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Explicit Memory Ingestion (Hindsight Retain)</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="sm:col-span-3">
              <input
                type="text"
                value={ruleText}
                onChange={(e) => setRuleText(e.target.value)}
                placeholder="e.g. Always use orjson instead of json in performance-critical serialization paths."
                className="w-full bg-dark-bg border border-dark-border rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg text-xs text-white p-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="Architecture">Architecture</option>
                <option value="Security">Security</option>
                <option value="Performance">Performance</option>
                <option value="Concurrency">Concurrency</option>
                <option value="Error Handling">Error Handling</option>
              </select>
            </div>
          </div>

          {successMessage ? (
            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !ruleText.trim()}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-brand-primary text-white text-xs font-semibold flex items-center space-x-1.5 hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Retain into Memory Bank</span>
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
