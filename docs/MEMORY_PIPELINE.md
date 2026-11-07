# CodeMind AI — Hindsight Memory Architecture & Pipeline Specification

## 1. Core Paradigm: Explicit Agentic Memory
Stateless code review agents (e.g., standard LLM prompts or generic Copilot chat) suffer from three fatal flaws in production engineering:
1. **Context Blindness**: They do not know that your team migrated from synchronous SQLAlchemy to async sessions after Incident INC-402.
2. **Review Fatigue**: Developers constantly reject the same hallucinated suggestions (e.g. demanding docstrings on internal test fixtures).
3. **No Organizational Learning**: Feedback given on PR #400 is forgotten by the agent on PR #401.

**CodeMind AI** resolves this by integrating the **Hindsight SDK** as an explicit, persistent memory engine.

---

## 2. Hindsight SDK Primitives

### A. `retain` (Store Experience & Synthesize Invariants)
```python
response = client.retain(
    bank_id="team-codemind",
    content="FastAPI async endpoints must use AsyncSession with select(). Synchronous Session blocks asyncio loop.",
    context="Architectural Decision from Incident INC-402",
    tags=["concurrency", "fastapi", "sqlalchemy", "incident-prevention"],
    metadata={"enforced_by": "Staff Architecture Council", "priority": "P0"}
)
```
- **Hindsight Internal Processing**:
  - Ingestion pipeline extracts facts, temporal references, and domain entities.
  - Generates cross-linked embeddings and BM25 keywords in the `team-codemind` memory bank.
  - Returns `operation_id`, `items_count`, and confirmation.

### B. `recall` (Contextual Memory Retrieval)
```python
results = client.recall(
    bank_id="team-codemind",
    query=code_under_review,
    max_tokens=4096,
    budget="mid",
    tags=["concurrency", "security", "architecture"]
)
```
- **Hindsight Internal Processing**:
  - Dual-strategy search: Hybrid semantic dense vector search + sparse BM25 lexical match.
  - Returns ranked `RecallResult` objects with `id`, `text`, `scores`, `tags`, and `context`.
  - Injected directly into the Groq Llama 3.3 prompt to augment the review.

---

## 3. Data Pipeline Flow

```
[Developer Code / Keystroke]
         │
         ▼
[Query Formulation] ──> Extracts AST patterns, route signatures, DB calls
         │
         ▼
[Hindsight recall()] ──> Searches bank "team-codemind"
         │
         ▼
[Augmented Context] ──> Injected into Groq Llama 3.3 prompt
         │
         ▼
[Review Output with Rule Provenance Citation]
         │
         ▼
[Developer Feedback: Accept / Reject / Teach]
         │
         ▼
[Hindsight retain()] ──> Persists new rule, exception, or reinforcement
```

---

## 4. Tag Taxonomy & Memory Scopes
- `concurrency`: Event loop blocking, thread pool exhaustion, locks, async safety.
- `security`: SQL injection, secrets, credential sanitization, SSRF.
- `architecture`: Unit of work boundaries, transaction commitments, service layer separation.
- `resilience`: Exception hierarchies, retries, circuit breakers, timeout defaults.
- `exception`: Specific whitelist/exemptions retained when a developer rejects a suggestion.
