import React from 'react';
import { 
  Database, 
  ShieldCheck, 
  Terminal, 
  Zap, 
  Activity,
  Globe,
  Code2
} from 'lucide-react';
import { NavView } from './Sidebar';

interface HeaderProps {
  activeBankId: string;
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  isBackendConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeBankId,
  activeView,
  onViewChange,
  isBackendConnected = true,
}) => {
  return (
    <header className="h-16 border-b border-dark-border bg-dark-card/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Title (clickable to return to landing page) */}
      <div 
        onClick={() => onViewChange('landing')}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-brand-secondary flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center">
              CodeMind <span className="text-brand-primary ml-1">AI</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v2.4 • Hindsight-Powered
            </span>
          </div>
          <p className="text-xs text-dark-muted hidden md:block">
            Self-Learning Agentic Code Review Engine
          </p>
        </div>
      </div>

      {/* Center Status Badges */}
      <div className="hidden lg:flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-dark-bg/80 border border-dark-border rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Database className="w-3.5 h-3.5 text-brand-secondary" />
          <span className="font-mono text-dark-muted">Bank:</span>
          <span className="font-semibold text-slate-200">{activeBankId}</span>
        </div>

        <div className="flex items-center space-x-2 bg-dark-bg/80 border border-dark-border rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-dark-muted">LLM:</span>
          <span className="font-semibold text-slate-200">Groq (Llama 3.3 70B)</span>
        </div>

        <div className="flex items-center space-x-2 bg-dark-bg/80 border border-dark-border rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-200">Hindsight SDK</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">RECALL ACTIVE</span>
        </div>
      </div>

      {/* Right Mode Switcher & Live Status */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onViewChange(activeView === 'landing' ? 'dashboard' : 'landing')}
          className="px-3 py-1.5 rounded-lg bg-dark-bg hover:bg-dark-hover border border-dark-border text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-colors"
        >
          {activeView === 'landing' ? (
            <>
              <Code2 className="w-3.5 h-3.5 text-brand-primary" />
              <span>Open Studio</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Product Page</span>
            </>
          )}
        </button>

        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-bg border border-dark-border text-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">Agent:</span>
          <span className="text-emerald-400 font-medium font-mono">ONLINE</span>
        </div>
      </div>
    </header>
  );
};
