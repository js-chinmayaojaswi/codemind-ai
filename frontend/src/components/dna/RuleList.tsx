import React, { useState } from 'react';
import { BookOpen, Search, ShieldCheck, Tag, Sparkles, Filter } from 'lucide-react';
import { TeamRule } from '../../types';

interface RuleListProps {
  rules: TeamRule[];
}

export const RuleList: React.FC<RuleListProps> = ({ rules }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(rules.map((r) => r.category)))];

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.rule_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || rule.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-xl bg-dark-card border border-dark-border p-5 shadow-xl flex flex-col h-full">
      {/* Header & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-brand-secondary" />
            <span>Learned Team Guidelines ({rules.length})</span>
          </h3>
          <p className="text-[11px] text-dark-muted">
            Explicitly retained in Hindsight memory bank via developer feedback
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-dark-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conventions..."
              className="pl-8 pr-3 py-1 bg-dark-bg border border-dark-border rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-dark-bg border border-dark-border rounded-lg text-xs text-slate-300 px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rules Scrollable Container */}
      <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
        {filteredRules.length === 0 ? (
          <div className="text-center py-8 text-xs text-dark-muted">
            No matching rules found in active memory bank.
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-xl bg-dark-bg/80 border border-dark-border hover:border-dark-border/80 transition-all hover:bg-dark-bg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {rule.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {rule.rule_name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {rule.description}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {rule.confidence_score}% Conf.
                  </span>
                  <span className="block text-[10px] text-dark-muted font-mono mt-1">
                    Enforced {rule.frequency_applied}x
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-dark-border/60 flex items-center justify-between text-[11px] text-dark-muted font-mono">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-brand-secondary" />
                  <span>Source: {rule.source.replace('_', ' ')}</span>
                </span>
                <span>Learned: {rule.created_at}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
