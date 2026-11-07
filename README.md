# 🧠 CodeMind AI — Self-Learning Code Review Agent

[![Live Website](https://img.shields.io/badge/Live_Website-Deployed-success?style=for-the-badge&logo=githubpages&logoColor=white)](https://js-chinmayaojaswi.github.io/codemind-ai/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/js-chinmayaojaswi/codemind-ai)

> 🌐 **Live Website & Studio URL**: [**https://js-chinmayaojaswi.github.io/codemind-ai/**](https://js-chinmayaojaswi.github.io/codemind-ai/)

---

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?logo=groq&logoColor=white)](https://groq.com)
[![Hindsight SDK](https://img.shields.io/badge/Hindsight-Persistent_Memory-6366F1)](https://github.com/hindsight-ai/hindsight)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

> **CodeMind AI** is a self-learning code review agent that eliminates LLM amnesia. Powered by explicit agent memory via the **Hindsight SDK** and sub-second inference on **Groq Llama 3.3 70B**, it retains past postmortems, prevents recurring anti-patterns as you type, and cultivates an evolving **Team Coding DNA**.

---

## ⚡ Why CodeMind AI?

Stateless AI code reviewers suffer from chronic amnesia: they generate dozens of nitpicks about missing docstrings while approving code that starves asyncio event loops or violates transaction boundaries. 

CodeMind AI solves this with **explicit agent memory primitives**:
1. **Pre-Submit Mistake Prediction**: Intercepts recurring anti-patterns in the Monaco Editor before code is ever committed to Git.
2. **Memory-Powered Review Comparison**: Dual-pane A/B evaluation proving the concrete difference between generic stateless LLM suggestions and Hindsight memory-augmented reviews.
3. **Team Coding DNA**: Dynamic multi-axis radar chart (Concurrency, Security, Architecture, Resilience, Contracts, Testing) scoring team adherence and exportable as JSON.
4. **Continuous Learning Loop**: 1-click developer feedback (`Accept`, `Reject with Reason`, `Teach Convention`) triggers Hindsight `retain()`, updating the organizational memory bank forever without fine-tuning.

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client ["Frontend (React + Vite + Monaco + Recharts)"]
        UI_Editor["Monaco Code Editor"]
        UI_Predictor["Mistake Predictor Bar (Pre-Submit Warning)"]
        UI_Compare["Side-by-Side Review UI (Generic vs Memory)"]
        UI_DNA["Team Coding DNA Dashboard (Recharts Radar)"]
        UI_Feedback["Feedback Action (Accept / Reject / Teach)"]
    end

    subgraph Backend ["Backend (FastAPI)"]
        Router["FastAPI Gateway"]
        Service_Predictor["Mistake Predictor Service"]
        Service_Review["Review Orchestrator Service"]
        Service_Hindsight["Hindsight Memory Client"]
        Service_Groq["Groq LLM Client (Llama 3.3 70B)"]
        Service_DNA["Team DNA Service"]
        DB[(Local SQLite / Cache)]
    end

    subgraph MemoryEngine ["Hindsight SDK Engine"]
        MemoryBank[("Team Memory Bank: 'team-codemind'")]
        RecallOp["client.recall(bank_id, query)"]
        RetainOp["client.retain(bank_id, content)"]
    end

    UI_Editor -->|Debounced keystrokes| Router
    Router --> Service_Predictor
    Service_Predictor --> Service_Hindsight
    Service_Hindsight --> RecallOp
    RecallOp --> MemoryBank
    RecallOp -.-> Service_Predictor
    Service_Predictor --> UI_Predictor

    UI_Editor -->|Submit for Review| Router
    Router --> Service_Review
    Service_Review -->|1. Baseline review without memory| Service_Groq
    Service_Review -->|2. Recall explicit conventions| Service_Hindsight
    Service_Hindsight --> RecallOp
    RecallOp -.-> Service_Review
    Service_Review -->|3. Memory-augmented review prompt| Service_Groq
    Service_Groq -.-> Service_Review
    Service_Review --> UI_Compare

    UI_Feedback -->|Developer feedback: Accept / Reject / Teach| Router
    Router --> Service_Hindsight
    Service_Hindsight --> RetainOp
    RetainOp --> MemoryBank
    Router --> DB
    Service_DNA --> MemoryBank
    Service_DNA --> UI_DNA
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- [Groq API Key](https://console.groq.com) (optional for simulation fallback mode)
- [Hindsight Client](https://pypi.org/project/hindsight-client/)

### 2. Run with One-Click Launcher (Windows PowerShell)
```powershell
.\run_demo.ps1
```

### 3. Manual Installation

#### Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: `http://localhost:8000/docs`

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Dashboard & Website will be available at: `http://localhost:5173`

---

## 🧪 Automated Testing

Run the full test suite across Groq Llama 3.3 integration, Hindsight pipelines, endpoints, and standout features:

```bash
backend\.venv\Scripts\python -m pytest backend/tests -v
```

All 19 tests pass cleanly:
- `test_groq_service.py`: JSON extraction, temperature tuning, dual-prompting.
- `test_hindsight_pipeline.py`: Query formulation, `retain` operations, `recall` operations.
- `test_services.py`: FastAPI endpoints, health checks, SQLite database persistence.
- `test_standout_features.py`: Team Coding DNA radar synthesis, mistake prediction patterns, and continuous feedback loop.

---

## 📁 Repository Structure

```
codemind-ai/
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints (reviews, feedback, dna, health)
│   │   ├── models/         # Pydantic & SQLAlchemy domain models
│   │   ├── services/       # Groq, Hindsight, Predictor, and DNA services
│   │   ├── config.py       # Pydantic Settings
│   │   ├── database.py     # SQLAlchemy session & DB initialization
│   │   └── main.py         # FastAPI application entrypoint
│   ├── tests/              # Pytest test suite (19 tests)
│   ├── requirements.txt    # Python dependencies
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Monaco editor, radar chart, review cards, feedback bar
│   │   ├── views/          # Landing page, Review Studio, A/B Comparison, Team DNA, History
│   │   ├── services/       # API client & anti-pattern presets
│   │   ├── types/          # TypeScript domain interfaces
│   │   ├── App.tsx         # Main application controller
│   │   └── main.tsx        # React root mount
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── demo_scenarios/         # Production anti-pattern test cases
├── docs/
│   ├── ARCHITECTURE.md     # Complete system specification
│   ├── MEMORY_PIPELINE.md  # Hindsight Retain & Recall deep dive
│   └── DEMO_GUIDE.md       # Step-by-step walkthrough & pitch script
└── run_demo.ps1            # Single-click launcher
```

---

## 📜 License
Apache-2.0 License.
