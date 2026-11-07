import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  BrainCircuit, 
  ShieldCheck, 
  Dna, 
  Zap, 
  ArrowRight, 
  GitCompare, 
  CheckCircle2, 
  Database,
  Layers,
  Code2,
  Cpu,
  ChevronRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { TeamDnaMetric } from '../types';
import { TeamDnaRadar } from '../components/dna/TeamDnaRadar';

interface LandingPageViewProps {
  onLaunchStudio: () => void;
  onExploreComparison: () => void;
  onViewDna: () => void;
  metrics: TeamDnaMetric[];
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onLaunchStudio,
  onExploreComparison,
  onViewDna,
  metrics,
}) => {
  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-indigo-950/40 via-dark-card to-dark-card border border-indigo-500/20 p-8 sm:p-14 overflow-hidden shadow-2xl">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Announcement pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Introducing CodeMind AI • Powered by Hindsight SDK & Groq</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
            Code Reviews That <br />
            <span className="bg-gradient-to-r from-indigo-400 via-brand-secondary to-emerald-400 bg-clip-text text-transparent">
              Actually Learn Your Team's Invariants
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stateless AI code reviewers suffer from chronic amnesia. CodeMind AI uses explicit memory to retain past postmortems, predict recurring anti-patterns as you type, and cultivate an evolving <strong>Team Coding DNA</strong>.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchStudio}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 hover:from-brand-primaryHover hover:to-indigo-500 text-white font-semibold text-sm flex items-center space-x-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Review Studio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onExploreComparison}
              className="px-6 py-3 rounded-xl bg-dark-bg border border-dark-border hover:border-indigo-500/50 text-slate-200 font-semibold text-sm flex items-center space-x-2 transition-all hover:bg-dark-hover"
            >
              <GitCompare className="w-4 h-4 text-indigo-400" />
              <span>View A/B Memory Proof</span>
            </button>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-dark-border/80">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">140+</div>
              <div className="text-xs text-dark-muted mt-1">PRs Reviewed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">94.6%</div>
              <div className="text-xs text-dark-muted mt-1">Memory Precision</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-secondary font-mono">89</div>
              <div className="text-xs text-dark-muted mt-1">Bugs Prevented Pre-Commit</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">&lt; 450ms</div>
              <div className="text-xs text-dark-muted mt-1">Groq Dual Inference</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Standout Features Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Core Innovations</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why Explicit Memory Changes Everything
          </h2>
          <p className="text-xs sm:text-sm text-dark-muted">
            Replacing generic stateless prompt-stuffing with institutional memory banks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Mistake Prediction */}
          <div className="rounded-2xl bg-dark-card border border-dark-border p-6 space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Standout Feature #3
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Pre-Submit Mistake Prediction
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Why wait for a pull request? CodeMind monitors Monaco Editor keystrokes in real time, matching active code buffers against recalled anti-patterns and warning you before you push to Git.
              </p>
            </div>
            <button
              onClick={onLaunchStudio}
              className="text-xs font-semibold text-amber-400 flex items-center space-x-1 pt-2 hover:underline"
            >
              <span>Test in Editor</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Memory-Powered Comparison */}
          <div className="rounded-2xl bg-dark-card border border-dark-border p-6 space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <GitCompare className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Standout Feature #2
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Empirical Review Comparison
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Side-by-side split screen proving the value of memory. See generic 70B models obsess over docstrings while CodeMind AI catches catastrophic event loop starvation from Incident INC-402.
              </p>
            </div>
            <button
              onClick={onExploreComparison}
              className="text-xs font-semibold text-indigo-400 flex items-center space-x-1 pt-2 hover:underline"
            >
              <span>View Side-by-Side Proof</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Team Coding DNA */}
          <div className="rounded-2xl bg-dark-card border border-dark-border p-6 space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Dna className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Standout Feature #1
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Team Coding DNA
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A dynamic, living profile of your team's engineering standards. Scored across 6 dimensions on an interactive Recharts radar chart and exportable as portable JSON guidelines.
              </p>
            </div>
            <button
              onClick={onViewDna}
              className="text-xs font-semibold text-cyan-400 flex items-center space-x-1 pt-2 hover:underline"
            >
              <span>Inspect DNA Radar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Interactive Technical Architecture Grid */}
      <section className="rounded-2xl bg-dark-card border border-dark-border p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dark-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Full-Stack Architecture</span>
            <h3 className="text-xl font-bold text-white">How CodeMind AI Operates</h3>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-dark-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FastAPI + Hindsight v1.2.0 + Groq Llama 3.3</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <div className="text-xs font-bold text-indigo-400 font-mono">STEP 1: CAPTURE</div>
            <div className="text-sm font-semibold text-white">Monaco Editor & AST</div>
            <p className="text-xs text-dark-muted">
              Captures code buffer, extracts framework signatures, routes, and DB handles on debounced typing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <div className="text-xs font-bold text-cyan-400 font-mono">STEP 2: RECALL</div>
            <div className="text-sm font-semibold text-white">Hindsight Recall Pipeline</div>
            <p className="text-xs text-dark-muted">
              Executes hybrid semantic & lexical search over bank <code className="text-cyan-300">team-codemind</code> to pull historical rulings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <div className="text-xs font-bold text-amber-400 font-mono">STEP 3: REASON</div>
            <div className="text-sm font-semibold text-white">Groq Llama 3.3 70B</div>
            <p className="text-xs text-dark-muted">
              Ultra-low latency inference (~250 tok/s) evaluates code against recalled memories with exact rule citations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2">
            <div className="text-xs font-bold text-emerald-400 font-mono">STEP 4: RETAIN</div>
            <div className="text-sm font-semibold text-white">Continuous Learning Loop</div>
            <p className="text-xs text-dark-muted">
              Developer feedback (accept / reject / teach) triggers <code className="text-emerald-300">client.retain()</code>, updating memory forever.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Live Interactive Team DNA Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Continuous Synthesis</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            An Institutional Brain That Never Forgets
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every time a senior engineer accepts a review finding or explains why a suggestion was rejected, the Hindsight memory bank automatically absorbs that institutional knowledge.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero model fine-tuning or training compute needed</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>No manual markdown wiki maintenance</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Protects against event loop starvation & security vulnerabilities</span>
            </li>
          </ul>
          <div className="pt-2">
            <button
              onClick={onViewDna}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 transition-all shadow-md"
            >
              <span>Explore Active Coding Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <TeamDnaRadar metrics={metrics} teamName="Core Platform Alpha" />
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="text-center rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 p-10 sm:p-14 space-y-5 shadow-2xl">
        <h2 className="text-2xl sm:text-4xl font-bold text-white">
          Ready to Stop Amnesic AI Code Reviews?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Experience self-learning code reviews with explicit memory. Test sample anti-patterns, trigger side-by-side A/B comparisons, and teach the agent new team conventions.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onLaunchStudio}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 hover:opacity-90 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center space-x-2"
          >
            <Code2 className="w-4 h-4" />
            <span>Open Code Review Studio</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-dark-bg border border-dark-border hover:border-slate-600 text-slate-300 text-sm font-semibold flex items-center space-x-2 transition-all"
          >
            <span>FastAPI OpenAPI Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};
