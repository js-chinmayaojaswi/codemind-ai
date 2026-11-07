import React, { useState, useEffect } from 'react';
import { ReviewComparison } from '../components/review/ReviewComparison';
import { ReviewComparisonData } from '../types';
import { api, CODE_PRESETS } from '../services/api';
import { GitCompare, Sparkles, Play, Code2 } from 'lucide-react';

interface ComparisonViewProps {
  initialCode?: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || CODE_PRESETS[0].code);
  const [language, setLanguage] = useState<string>('python');
  const [comparisonData, setComparisonData] = useState<ReviewComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Run comparison on mount
    runComparison();
  }, []);

  const runComparison = async () => {
    setIsLoading(true);
    try {
      const result = await api.compareReviews(code, language);
      setComparisonData(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (presetName: string) => {
    const selected = CODE_PRESETS.find((p) => p.name === presetName);
    if (selected) {
      setCode(selected.code);
      setLanguage(selected.language);
    }
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="p-5 rounded-xl bg-dark-card border border-dark-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Memory-Powered Review Comparison</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Standout Feature #2
                </span>
              </h2>
              <p className="text-xs text-dark-muted">
                Side-by-side empirical proof of Hindsight explicit memory vs. standard stateless LLM reviews
              </p>
            </div>
          </div>
        </div>

        {/* Quick Presets & Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {CODE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p.name)}
              className="px-2.5 py-1 text-xs rounded-lg bg-dark-bg border border-dark-border hover:border-indigo-500/50 text-slate-300 transition-colors"
            >
              Preset {idx + 1}
            </button>
          ))}

          <button
            onClick={runComparison}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-90 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-evaluate A/B</span>
          </button>
        </div>
      </div>

      {/* Code Snippet Under Test Preview */}
      <div className="rounded-xl bg-dark-card border border-dark-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <Code2 className="w-4 h-4 text-brand-primary" />
            <span>Code Under Test (FastAPI Sample with Critical Concurrency Anti-Pattern)</span>
          </span>
          <span className="text-[11px] font-mono text-dark-muted">Language: {language}</span>
        </div>
        <pre className="p-3 rounded-lg bg-dark-bg border border-dark-border text-xs font-mono text-slate-200 overflow-x-auto max-h-36">
          <code>{code}</code>
        </pre>
      </div>

      {/* Side-by-Side Dual Pane Comparison Component */}
      <ReviewComparison data={comparisonData} isLoading={isLoading} />
    </div>
  );
};
