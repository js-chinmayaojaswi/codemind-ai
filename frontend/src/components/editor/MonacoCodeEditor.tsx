import React from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  GitCompare, 
  RotateCcw, 
  Code, 
  CheckCircle, 
  Sparkles,
  FileCode
} from 'lucide-react';
import { CODE_PRESETS } from '../../services/api';

interface MonacoCodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
  onLanguageChange: (lang: string) => void;
  onRunReview: () => void;
  onRunComparison: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  code,
  language,
  onChange,
  onLanguageChange,
  onRunReview,
  onRunComparison,
  onReset,
  isLoading = false,
}) => {
  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CODE_PRESETS.find(p => p.name === e.target.value);
    if (selected) {
      onChange(selected.code);
      onLanguageChange(selected.language);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-dark-card border border-dark-border overflow-hidden shadow-xl">
      {/* Editor Top Bar */}
      <div className="bg-dark-bg/90 border-b border-dark-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-mono">
            <FileCode className="w-4 h-4 text-brand-primary" />
            <span>snippet.{language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'txt'}</span>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-dark-muted hidden sm:inline">Load Preset:</span>
            <select
              onChange={handleSelectPreset}
              className="bg-dark-card border border-dark-border rounded-lg text-xs text-slate-200 px-2.5 py-1 focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              <option value="">Select Anti-Pattern Test Case...</option>
              {CODE_PRESETS.map((preset, idx) => (
                <option key={idx} value={preset.name}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-dark-hover transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onRunComparison}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-dark-hover hover:bg-slate-800 text-slate-200 border border-dark-border hover:border-indigo-500/50 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Compare Generic vs Memory</span>
          </button>

          <button
            onClick={onRunReview}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primaryHover hover:to-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Analyze Code</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="flex-1 min-h-[380px] w-full">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={onChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
            automaticLayout: true,
          }}
        />
      </div>

      {/* Editor Status Bar */}
      <div className="px-4 py-1.5 bg-dark-bg/95 border-t border-dark-border text-[11px] text-dark-muted flex items-center justify-between font-mono">
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>{language.toUpperCase()}</span>
          <span>{code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center space-x-2 text-indigo-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Hindsight Recall Listener Ready</span>
        </div>
      </div>
    </div>
  );
};
