# Reddit Post

### Target Subreddits:
- r/MachineLearning
- r/LocalLLaMA
- r/programming
- r/artificial

### Title:
**We built a self-learning code review agent using explicit memory (Hindsight) and Groq Llama 3.3 to solve LLM amnesia**

### Body:
```text
Hey r/programming / r/LocalLLaMA,

One of the biggest frustrations with using LLMs for automated code reviews is that they have zero memory. Every pull request starts from scratch. A 70B model will complain about missing PEP-257 docstrings on internal test fixtures while approving synchronous database calls in async route handlers that freeze the event loop under load.

We built an open-source project called CodeMind AI to explore explicit agentic memory instead of prompt-stuffing or fragile RAG:

1. Explicit Memory via Hindsight SDK: Uses official retain and recall primitives targeting a persistent team memory bank (`team-codemind`).
2. Pre-Submit Mistake Prediction: Debounced background worker in the Monaco Editor checks the code buffer against recalled historical anti-patterns, warning developers before code is ever committed to Git.
3. Memory-Powered Review Comparison: Side-by-side UI showing generic stateless Llama 3.3 reviews vs. Hindsight memory-augmented reviews citing past postmortem precedents.
4. Team Coding DNA: Recharts radar chart mapping multi-axis repository adherence (concurrency, security, architecture, resilience) that updates dynamically with 1-click developer feedback.
5. Sub-second Dual Inference on Groq: Runs both baseline and augmented models in parallel in <450ms.

GitHub Repo: https://github.com/js-chinmayaojaswi/codemind-ai
Live Web App: https://js-chinmayaojaswi.github.io/codemind-ai/

Would love feedback on how your teams handle persistent organizational memory for AI agents!
```
