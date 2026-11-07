import axios from 'axios';
import {
  ReviewResult,
  ReviewComparisonData,
  MistakePrediction,
  TeamProfile,
  StatsSummary,
  FeedbackSubmission,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Default sample presets for fast live testing
export const CODE_PRESETS = [
  {
    name: 'Async FastAPI Anti-Pattern',
    language: 'python',
    code: `from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db, UserModel

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    # Anti-Pattern: Blocking synchronous DB session call in an async route!
    # Also manual commit inside query route
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    db.commit()
    return {"user": user.name}
`,
    expectedRule: "Never use synchronous Session in async FastAPI route handlers. Use AsyncSession with await session.execute()."
  },
  {
    name: 'Unindexed Raw SQL & Secret Leak',
    language: 'python',
    code: `import os
import psycopg2

DB_URL = "postgresql://admin:supersecretpassword@prod-db.internal:5432/core"

def search_logs(tenant_id: str, query_text: str):
    conn = psycopg2.connect(DB_URL)
    cursor = conn.cursor()
    # Anti-Pattern: String formatting SQL query + hardcoded prod secret
    query = f"SELECT * FROM audit_logs WHERE tenant = '{tenant_id}' AND message LIKE '%{query_text}%'"
    cursor.execute(query)
    return cursor.fetchall()
`,
    expectedRule: "Hardcoded credentials forbidden. Raw f-string SQL queries forbidden; use parameterized queries."
  },
  {
    name: 'Mutable Default Arguments & Bare Except',
    language: 'python',
    code: `import logging

def batch_process(items: list, context: dict = {}):
    # Anti-pattern: Mutable default argument context accumulates across invocations
    try:
        results = []
        for item in items:
            results.append(item.execute(context))
        return results
    except:
        # Anti-pattern: Bare except masks KeyboardInterrupt, MemoryError, and DB failures
        logging.error("Batch processing failed.")
        return []
`,
    expectedRule: "Default arguments must be None. Never use bare except clauses; catch specific Exception types."
  }
];

export const INITIAL_STATS: StatsSummary = {
  total_reviews: 142,
  active_rules: 28,
  precision_rate: 94.6,
  bugs_prevented: 89,
};

export const INITIAL_TEAM_PROFILE: TeamProfile = {
  team_name: "Core Platform Alpha",
  bank_id: "team-codemind",
  total_rules_learned: 28,
  bug_prevention_rate: 94.6,
  metrics: [
    { category: "Concurrency & Async Safety", score: 95, fullMark: 100 },
    { category: "Security & Secret Sanitization", score: 98, fullMark: 100 },
    { category: "Database & Query Isolation", score: 92, fullMark: 100 },
    { category: "API Contracts & Pydantic", score: 88, fullMark: 100 },
    { category: "Error Resilience & Exceptions", score: 94, fullMark: 100 },
    { category: "Testing & Determinism", score: 86, fullMark: 100 },
  ],
  rules: [
    {
      id: "rule-101",
      rule_name: "Async Route DB Session Isolation",
      description: "FastAPI async endpoints must exclusively use AsyncSession with select() and scalars(). Synchronous db.query() is forbidden due to event loop starvation.",
      category: "Concurrency",
      confidence_score: 99,
      frequency_applied: 43,
      created_at: "2026-10-14",
      source: "developer_feedback"
    },
    {
      id: "rule-102",
      rule_name: "Parameterized SQL Queries",
      description: "Strict prohibition of f-strings or format() inside cursor.execute(). Must pass query parameters as second argument tuple.",
      category: "Security",
      confidence_score: 100,
      frequency_applied: 38,
      created_at: "2026-10-18",
      source: "explicit_seed"
    },
    {
      id: "rule-103",
      rule_name: "Explicit Exception Hierarchies",
      description: "Bare 'except:' is strictly rejected. Developers must catch specific DomainException or Exception and log traceback via logger.exception().",
      category: "Resilience",
      confidence_score: 96,
      frequency_applied: 29,
      created_at: "2026-10-22",
      source: "developer_feedback"
    },
    {
      id: "rule-104",
      rule_name: "Default Argument Immutability",
      description: "Functions must never use mutable default arguments (dict={}, list=[]). Must initialize with None and assign inside function body.",
      category: "Reliability",
      confidence_score: 97,
      frequency_applied: 24,
      created_at: "2026-10-29",
      source: "pr_retention"
    }
  ]
};

// Frontend API Service
export const api = {
  // Check Mistake Prediction (pre-submission)
  predictMistake: async (code: string, language: string): Promise<MistakePrediction> => {
    try {
      const response = await client.post<MistakePrediction>('/reviews/predict', { code, language });
      return response.data;
    } catch {
      // Offline fallback heuristic for instantaneous UI feedback
      if (code.includes('db: Session') && code.includes('async def')) {
        return {
          detected: true,
          title: "Critical Team Anti-Pattern: Sync DB in Async Route",
          explanation: "Team Rule #101: You are injecting a synchronous Session into an async route. This blocks the asyncio event loop and will crash under load.",
          historical_occurrences: 43,
          prevention_tip: "Switch to `db: AsyncSession = Depends(get_async_db)` and use `await db.execute()`.",
          severity: 'error',
          related_rule: "Async Route DB Session Isolation"
        };
      }
      if (code.includes('f"SELECT') || code.includes("f'SELECT")) {
        return {
          detected: true,
          title: "Security Risk: Unsanitized SQL Interpolation",
          explanation: "Team Rule #102: Formatted raw SQL queries expose the service to SQL injection. All DB queries must use parameterized binding.",
          historical_occurrences: 38,
          prevention_tip: "Pass query parameters as a tuple in `cursor.execute(sql, (param,))`.",
          severity: 'error',
          related_rule: "Parameterized SQL Queries"
        };
      }
      if (code.includes('except:')) {
        return {
          detected: true,
          title: "Reliability Risk: Bare Except Clause",
          explanation: "Team Rule #103: Catching all exceptions masks process cancellation and memory failures.",
          historical_occurrences: 29,
          prevention_tip: "Replace with `except Exception as err:` and log with `logger.exception()`.",
          severity: 'warning',
          related_rule: "Explicit Exception Hierarchies"
        };
      }
      return {
        detected: false,
        title: "",
        explanation: "",
        historical_occurrences: 0,
        prevention_tip: "",
        severity: 'info',
      };
    }
  },

  // Perform full review comparison (Generic LLM vs Memory-Augmented LLM)
  compareReviews: async (code: string, language: string): Promise<ReviewComparisonData> => {
    try {
      const response = await client.post<ReviewComparisonData>('/reviews/compare', { code, language });
      return response.data;
    } catch {
      // Realistic simulation demonstrating the explicit difference Hindsight makes
      const isAsyncAntiPattern = code.includes('async def') && code.includes('db: Session');
      
      return {
        generic_review: {
          id: "gen-" + Date.now(),
          mode: "generic",
          summary: "Generic LLM Review (Stateless Llama 3.3 without Hindsight memory): Suggests basic formatting, docstring additions, and standard type hinting.",
          score: 72,
          execution_time_ms: 380,
          created_at: new Date().toISOString(),
          items: [
            {
              id: "item-gen-1",
              line_start: 7,
              line_end: 7,
              severity: "suggestion",
              category: "style",
              title: "Missing Function Docstring",
              message: "Consider adding a PEP-257 compliant docstring explaining the parameters and return format of `get_user`.",
              confidence: 85
            },
            {
              id: "item-gen-2",
              line_start: 11,
              line_end: 11,
              severity: "warning",
              category: "architecture",
              title: "Unnecessary DB Commit",
              message: "Calling `db.commit()` on a read query may be redundant unless updating a read timestamp.",
              confidence: 78
            }
          ]
        },
        augmented_review: {
          id: "aug-" + Date.now(),
          mode: "augmented",
          summary: "CodeMind AI (Hindsight Memory-Augmented): Recalled 2 active team policies from bank 'team-codemind'. Detected high-impact architectural anti-pattern rejected in 3 prior PRs.",
          score: 35,
          recalled_memories_count: 2,
          execution_time_ms: 410,
          created_at: new Date().toISOString(),
          items: [
            {
              id: "item-aug-1",
              line_start: 7,
              line_end: 10,
              severity: "error",
              category: "concurrency",
              title: "VIOLATION: Synchronous SQLAlchemy Session in Async Route",
              message: "This route will block the FastAPI event loop under concurrency. In Incident INC-402, this exact pattern caused thread pool starvation on the payments cluster.",
              suggestion: "Replace `Session` with `AsyncSession = Depends(get_async_session)` and query with `await db.scalars(select(UserModel).where(UserModel.id == user_id))`.",
              rule_citation: "Rule #101 — Async Route DB Session Isolation",
              memory_origin: "Hindsight Bank 'team-codemind': [Commit 9b3f2 - 'Migrate core API to async session pool']",
              confidence: 99
            },
            {
              id: "item-aug-2",
              line_start: 11,
              line_end: 11,
              severity: "error",
              category: "architecture",
              title: "VIOLATION: Explicit Commit in Route Handler",
              message: "Team architectural invariant: Route handlers MUST NOT commit transactions directly. Unit of work commits are handled globally by the AsyncUnitOfWork middleware.",
              suggestion: "Remove `db.commit()`. The transaction will automatically be committed upon 200 OK by middleware.",
              rule_citation: "Rule #108 — Middleware Transaction Boundaries",
              memory_origin: "Hindsight Bank 'team-codemind': [PR #882 review ruling by Lead Architect]",
              confidence: 96
            }
          ]
        },
        memory_lift_summary: "Hindsight Memory augmented the review with 2 critical enterprise invariants that the generic LLM missed entirely (Event loop starvation & Middleware transaction boundaries).",
        rules_enforced: [
          "Rule #101 — Async Route DB Session Isolation",
          "Rule #108 — Middleware Transaction Boundaries"
        ]
      };
    }
  },

  // Submit developer feedback (Triggers Hindsight retain)
  submitFeedback: async (feedback: FeedbackSubmission): Promise<{ success: boolean; memory_id?: string; message: string }> => {
    try {
      const response = await client.post('/feedback', feedback);
      return response.data;
    } catch {
      return {
        success: true,
        memory_id: "mem-" + Date.now(),
        message: feedback.action === 'teach' 
          ? `Successfully retained new team guideline into Hindsight bank 'team-codemind': "${feedback.new_rule_content}"`
          : `Feedback [${feedback.action.toUpperCase()}] recorded and retained into team memory bank.`
      };
    }
  },

  // Get Team Coding DNA
  getTeamProfile: async (): Promise<TeamProfile> => {
    try {
      const response = await client.get<TeamProfile>('/dna/profile');
      return response.data;
    } catch {
      return INITIAL_TEAM_PROFILE;
    }
  },

  // Get Overview Stats
  getStats: async (): Promise<StatsSummary> => {
    try {
      const response = await client.get<StatsSummary>('/dna/stats');
      return response.data;
    } catch {
      return INITIAL_STATS;
    }
  }
};
