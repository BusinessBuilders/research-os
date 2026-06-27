<div align="center">

# 🔭 ResearchOS

### Your AI procurement & product-research analyst — runs entirely on your own GPU.

[![License](https://img.shields.io/badge/license-MIT-58A6FF?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Local LLM](https://img.shields.io/badge/LLM-local%20Qwen-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](#architecture)

**Stop Googling for hours.** ResearchOS takes a question like _"best mid-range 3D printer for production parts under $2k"_, runs a full research pipeline against live web search, evaluates the real options against your actual constraints, and writes you a structured decision page — with a recommendation you can act on.

No SaaS. No API bills. The whole thing runs on local inference.

[Quick Start](#-quick-start) · [Highlights](#-highlights) · [How it works](#-architecture) · [Configuration](#-configuration) · [API](#-api)

</div>

---

## ⚡ Quick Start

```bash
# 1. Backend (FastAPI, managed with uv)
cd backend
cp .env.example .env          # point it at your Vane + LLM endpoints
uv sync
uv run uvicorn api.main:app --host 0.0.0.0 --port 8001

# 2. Frontend (Next.js)
cd ../frontend
npm install
npm run dev                   # http://localhost:4000

# 3. Verify
curl -s http://localhost:8001/api/health
```

Open `http://localhost:4000`, type a research question, and watch the pipeline work.

## ✨ Highlights

- **🧠 Decision-first, not link-first** — output is a structured recommendation with scored options and a rationale, not ten browser tabs. Results graduate straight into an Obsidian wiki decision page.
- **🔍 Real web research** — pulls live results through [Vane](#-architecture) (search/embeddings) and Firecrawl (page extraction), so answers reflect what's actually for sale *today*.
- **🎯 Constraint-aware evaluation** — a `product_evaluator` + `gap_analyzer` score each option against your budget, use-case, and must-haves, then flag what's missing from the market.
- **🏠 100% local inference** — the reasoning runs on your own Qwen on local GPU. Your research, your hardware, zero per-token cost.
- **♻️ Durable, resumable jobs** — sessions survive restarts; a crashed pipeline marks itself `failed` instead of hanging, and stuck jobs are recovered on startup.
- **🔌 Composable** — feeds equipment + decision data to downstream systems (cash dashboards, inventory) over a clean REST API.

## 🏗 Architecture

ResearchOS is a multi-stage agentic pipeline. A research question flows through specialized services, each doing one job well:

```
question
   │
   ▼
intent_classifier ──▶ query_optimizer ──▶ vane_client / firecrawl_client   (live web search + extract)
                                                  │
                                                  ▼
                                          product_evaluator ──▶ gap_analyzer
                                                  │
                                                  ▼
                                            synthesizer ──▶ wiki_writer   (structured decision page)
```

| Layer | Tech |
| :--- | :--- |
| **API** | FastAPI 0.115 · uvicorn · async SQLite (aiosqlite) · Pydantic v2 |
| **Search** | Vane (search + embeddings) · Firecrawl (page extraction) |
| **Reasoning** | local Qwen via any OpenAI-compatible endpoint |
| **Frontend** | Next.js 15 · React · shadcn/ui · Recharts · Tailwind |
| **Storage** | SQLite (WAL) — sessions, jobs, products, decisions |

## 🔧 Configuration

All backend config is environment-driven (`backend/.env`):

| Variable | Purpose | Example |
| :--- | :--- | :--- |
| `RESEARCHOS_VANE_URL` | Vane search service | `http://localhost:3001` |
| `RESEARCHOS_QWEN_URL` | Local LLM endpoint | `http://localhost:8080` |
| `RESEARCHOS_FIRECRAWL_URL` | Page-extraction service | `http://localhost:3002` |
| `RESEARCHOS_WIKI_PATH` | Where decision pages are written | `./wiki` |
| `RESEARCHOS_CORS_ORIGINS` | Allowed browser origins | `http://localhost:4000` |
| `RESEARCHOS_DB_PATH` | SQLite file | `researchos.db` |

> **Security note:** the backend binds `0.0.0.0`. If you only want it reachable over your tailnet, pin `RESEARCHOS_CORS_ORIGINS` to the frontend origin and firewall the LAN interface. See [`deploy/DEPLOY-NOTES.md`](deploy/DEPLOY-NOTES.md).

## 📡 API

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Liveness check |
| `POST` | `/api/sessions` | Start a research session |
| `GET` | `/api/sessions/{id}/status` | Poll pipeline progress |
| `POST` | `/api/sessions/{id}/research` | Run the full research pipeline |
| `POST` | `/api/sessions/{id}/decide` | Record a final decision |
| `GET` | `/api/decisions` | List decision pages produced |
| `GET` | `/api/equipment` | Equipment inventory feed |

## 🧪 Tests

```bash
cd backend && uv run pytest
```

## 📄 License

MIT
