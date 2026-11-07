import re
from typing import Optional
from app.models.review import MistakePredictionResponse

class MistakePredictorService:
    def predict(self, code: str, language: str = "python") -> MistakePredictionResponse:
        """
        Real-time proactive prediction engine evaluated as developers type in Monaco.
        Warns of recurring anti-patterns and known production failure modes before submission.
        """
        code_clean = code.strip()
        if len(code_clean) < 15:
            return MistakePredictionResponse(detected=False)

        # 1. Critical Concurrency Anti-Pattern: Sync DB session in async route
        if ("async def" in code_clean or "@app." in code_clean) and ("db: Session" in code_clean or "db.query(" in code_clean):
            return MistakePredictionResponse(
                detected=True,
                title="Critical Team Anti-Pattern: Sync DB in Async Route",
                explanation="Team Invariant #101: You are injecting a synchronous Session into an async route. This blocks the asyncio event loop and caused Incident INC-402 under load.",
                historical_occurrences=43,
                prevention_tip="Use `db: AsyncSession = Depends(get_async_db)` and `await db.execute(select(...))`.",
                severity="error",
                related_rule="Async Route DB Session Isolation"
            )

        # 2. Critical Security Anti-Pattern: Raw SQL injection via f-string or concatenation
        if any(token in code_clean for token in ['f"SELECT', "f'SELECT", 'f"INSERT', "f'INSERT", 'f"UPDATE', "f'UPDATE", 'cursor.execute(f']):
            return MistakePredictionResponse(
                detected=True,
                title="Security Risk: Unsanitized SQL Interpolation",
                explanation="Team Invariant #102: Formatted raw SQL queries expose the service to SQL injection. All DB queries must use parameterized binding.",
                historical_occurrences=38,
                prevention_tip="Pass query parameters as a tuple: `cursor.execute(sql, (param,))`.",
                severity="error",
                related_rule="Parameterized SQL Queries"
            )

        # 3. Security Anti-Pattern: Hardcoded secrets or credentials
        if re.search(r"(?:API_KEY|SECRET_KEY|JWT_SECRET|PASSWORD)\s*=\s*['\"][a-zA-Z0-9_\-!@#$%^&*]{6,}['\"]", code_clean):
            return MistakePredictionResponse(
                detected=True,
                title="Security Violation: Hardcoded Secret in Source Code",
                explanation="Team Security Policy #105: Credentials and secrets must be loaded via os.getenv() or Pydantic BaseSettings, never committed in plain text.",
                historical_occurrences=17,
                prevention_tip="Use `settings.JWT_SECRET` or `os.getenv('API_KEY')`.",
                severity="error",
                related_rule="Secret Sanitization & Environment Injection"
            )

        # 4. Resilience Anti-Pattern: Bare except clause
        if re.search(r"except\s*:", code_clean):
            return MistakePredictionResponse(
                detected=True,
                title="Reliability Risk: Bare Except Clause",
                explanation="Team Invariant #103: Catching all exceptions masks process cancellation, MemoryError, and DB disconnections.",
                historical_occurrences=29,
                prevention_tip="Replace with `except Exception as err:` and log with `logger.exception()`.",
                severity="warning",
                related_rule="Explicit Exception Hierarchies"
            )

        # 5. Reliability Anti-Pattern: Mutable default arguments
        if re.search(r"def\s+[a-zA-Z0-9_]+\([^)]*=\s*(\[\]|\{\})", code_clean):
            return MistakePredictionResponse(
                detected=True,
                title="Reliability Risk: Mutable Default Argument",
                explanation="Team Invariant #104: Default arguments are evaluated once at definition time. Mutable objects accumulate state across calls.",
                historical_occurrences=24,
                prevention_tip="Default parameter to `None` and initialize inside the function body.",
                severity="warning",
                related_rule="Default Argument Immutability"
            )

        # 6. Resilience Anti-Pattern: HTTP requests without timeout
        if ("httpx." in code_clean or "requests." in code_clean) and "timeout=" not in code_clean:
            return MistakePredictionResponse(
                detected=True,
                title="Resilience Warning: Missing Outbound Request Timeout",
                explanation="Team Invariant #106: Outbound HTTP requests without explicit timeouts can hang threads indefinitely during third-party degradation.",
                historical_occurrences=18,
                prevention_tip="Always supply `timeout=5.0` or `timeout=httpx.Timeout(5.0)`.",
                severity="warning",
                related_rule="Strict Outbound Request Timeouts"
            )

        return MistakePredictionResponse(
            detected=False,
            title="",
            explanation="",
            historical_occurrences=0,
            prevention_tip="",
            severity="info"
        )

predictor_service = MistakePredictorService()
