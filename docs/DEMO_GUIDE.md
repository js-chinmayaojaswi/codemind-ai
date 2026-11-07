# CodeMind AI — Live Hackathon Demo Walkthrough & Pitch Script

## 🎤 30-Second Elevator Pitch
> *"Every engineering team has tried AI code reviews, and almost every team turns them off within a month. Why? Because generic LLMs are completely amnesiac. They complain about missing docstrings while completely ignoring the fact that your team spent 3 days recovering from an outage caused by blocking sync database calls inside async route handlers.*
>
> *Today, we built **CodeMind AI** — the first self-learning code review agent powered by explicit memory via the **Hindsight SDK** and accelerated by **Groq Llama 3.3 70B**. It doesn't just lint your code; it develops an evolving **Team Coding DNA** that remembers your incidents, enforces your architectural decisions, and even warns you of recurring mistakes as you type — before you ever submit a pull request."*

---

## ⏱️ Step-by-Step Live Demo Flow (3 Minutes)

### Act 1: The Proactive Mistake Predictor (Standout Feature #3)
1. **Action**: Open the UI at `http://localhost:5173`.
2. **Action**: In the Monaco Editor, select the preset **"Async FastAPI Anti-Pattern"** or paste snippet `demo_scenarios/01_concurrency_incident_402.py`.
3. **What to Highlight**:
   - Point to the red **Mistake Predictor Pill** floating right above the editor.
   - Note that we haven't even clicked "Submit" or "Analyze"!
   - Emphasize the historical context: *"Failed in 43 past PRs — Incident INC-402."*
   - Click **"Auto-Fix"** to show instant compliance remediation.

---

### Act 2: The Empirical Proof — Side-by-Side Review Comparison (Standout Feature #2)
1. **Action**: Click the **"Compare Generic vs Memory"** button in Monaco or navigate to the **"A/B Comparison"** tab in the sidebar.
2. **What to Highlight**:
   - **Left Column (Generic Stateless LLM)**: Score 74/100. It suggests adding a PEP-257 docstring and nitpicks variable formatting. It completely misses the catastrophic event loop starvation!
   - **Right Column (CodeMind AI with Hindsight Memory)**: Score 38/100. It flags the critical violation with rule citation `Rule #101 — Async Route DB Session Isolation` and references commit `9b3f2`.
   - Point to the **Memory Lift Banner**: This proves that without memory, AI code review is just an expensive spellchecker. With Hindsight, it is an institutional architect.

---

### Act 3: Continuous Learning via Feedback Loop
1. **Action**: In the Review Feed, click **"Reject Suggestion"** on a finding and enter an architectural clarification (e.g., *"This is an internal background task exempt from route timeouts"*).
2. **Action**: Click **"Retain Exception in Hindsight"**.
3. **Action**: Alternatively, open the bottom bar **"Teach Convention"** and enter:
   > *"All Redis distributed lock keys must follow the convention lock:service:{tenant_id}:{operation}."*
4. **What to Highlight**:
   - Show how this directly calls `client.retain()` in the Hindsight SDK.
   - The memory bank `team-codemind` absorbs the fact without requiring fine-tuning, vector DB maintenance, or prompt restarts.

---

### Act 4: Team Coding DNA Profile (Standout Feature #1)
1. **Action**: Click the **"Team Coding DNA"** tab in the sidebar.
2. **What to Highlight**:
   - The interactive **Recharts Radar Chart** mapping adherence across 6 dimensions: Concurrency, Security, Database Isolation, Pydantic Contracts, Resilience, and Testing.
   - Show the learned rule catalog with live confidence percentages and historical frequency counters.
   - Click **"Export DNA"** to download the team profile as portable JSON.

---

### Act 5: Retention History & Audit Trail
1. **Action**: Click **"Retention History"** in the sidebar.
2. **What to Highlight**:
   - The audit log showing each developer's feedback, the specific memory operation (`RETAIN_RULE`, `RETAIN_EXCEPTION`, `PREVENTED_MISTAKE`), and the exact Hindsight memory bank impact.

---

## 🛠️ Backup Demo Scenarios
- **Scenario 2 (`demo_scenarios/02_security_sqli_leak.py`)**: Tests raw SQL string interpolation and plaintext password detection.
- **Scenario 3 (`demo_scenarios/03_resilience_bare_except.py`)**: Tests mutable default parameters (`context={}`) and bare `except:` clauses.
- **Scenario 4 (`demo_scenarios/04_compliant_reference.py`)**: Demonstrates clean, compliant code that scores 94/100 with all team invariants satisfied.
