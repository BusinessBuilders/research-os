# ResearchOS Code Review — 2026-06-10

Branch: `design/researchos-system` @ `4606bbc`. Review performed by Claude (Fable 5) with three parallel review agents (backend concurrency, frontend, security) plus direct reading of `orchestrator.py`, `qwen.py`, `product_evaluator.py`, `query_optimizer.py`.

## Verdict

The 3-phase pipeline architecture is sound. The phase boundaries (optimizer → parallel search → selective scrape → evaluate) are clean, independently testable, and the Vane-only fallback when Firecrawl returns nothing is sensible. The problems are in the *execution substrate* around the pipeline: fire-and-forget task launching, a single shared SQLite connection used concurrently, no top-level failure handler, and a serial scrape phase that defeats the batching.

Three of the six "known issues" in the handoff are fully explained by findings below:

| Known issue | Root cause found |
|---|---|
| #1 No cancel-on-navigate | `research-status.tsx:26-41` and `[id]/page.tsx:125-143` — intervals cleared on unmount but in-flight fetch continuations still fire setState; navigation never tells the backend anything (no abort path exists server-side either) |
| #4 Old sessions pile up | `orchestrator.py` has no top-level except → jobs stuck in `searching` forever; `recover_incomplete_jobs` re-spawns them every restart; `retry_research` orphans the old job row which also gets re-spawned |
| #6 20+ min for full lists | `_scrape_product_urls` (orchestrator.py:82-90) scrapes up to 15 URLs **serially** with a 60s timeout each — up to 15 min per need. BATCH_SIZE=3 is not the bottleneck |

---

## Critical — fix before anything else

### B1. Fire-and-forget `asyncio.create_task` with no reference
`api/routes/sessions.py:148, 221`; `orchestrator.py:338`. The task object is discarded; CPython may garbage-collect and silently cancel a running task. Symptom: jobs freeze mid-run with no error.
**Fix:** module-level `_tasks: set[asyncio.Task]`; `t = create_task(...); _tasks.add(t); t.add_done_callback(_tasks.discard)`.

### B2. Shared `aiosqlite` connection used by concurrent coroutines without a lock
`db/repository.py:16-18` + every `execute`/`commit` pair. With BATCH_SIZE=3, up to 6 coroutines interleave execute/commit on one connection — premature commits, empty-transaction commits, possible data loss.
**Fix:** `asyncio.Lock` around each execute+commit pair, or connection-per-operation; enable WAL mode.

### B3. `run_research_pipeline` has no top-level exception handler
`orchestrator.py:216-294`. Any exception outside the per-need try (e.g. a repo call failing) leaves `job.status = "searching"` forever. `recover_incomplete_jobs` then re-launches it on every restart — a potential infinite respawn loop. This is the engine behind known issue #4.
**Fix:** wrap the body in try/except that sets `job.status = "failed"` and saves.

### B4. Serial, unbounded scrape phase
`orchestrator.py:82-90`. 15 sequential `await firecrawl.scrape(url)` calls, 60s timeout each (`firecrawl_client.py:9`). One slow need blocks its whole batch slot.
**Fix:** `asyncio.gather` with a `Semaphore(5)` and a 10-15s per-scrape timeout. Do this *before* raising BATCH_SIZE.

### F1. Gap-analysis selections are never sent to the backend
`research/[id]/gaps/page.tsx:26-29`. `handleResearch()` POSTs `/research` with **no body** — the checkbox `selected` Set is discarded. The page's entire purpose (deselect nice-to-haves before researching) is silently broken.
**Fix:** send `{ need_ids: Array.from(selected) }` and have the route mark `need.selected` accordingly.

### F2. Results page crashes on any API error
`research/[id]/results/page.tsx:24-29`. `loadSession` calls `res.json()` with no `res.ok` check, then renders `session.needs.flatMap(...)` → TypeError on 404/500. Same pattern in `decide/page.tsx:36-48` and `gaps/page.tsx:20`.
**Fix:** guard `if (!res.ok)` + visible error state (the session detail page already does this correctly).

### S1. Path traversal via user-supplied `wiki_context`
`services/wiki_reader.py:19-25` (called from `sessions.py:113-115`). `wiki_path / f"{slug}.md"` with unsanitized user input — `../../../...` escapes the vault; file contents are fed into Qwen prompts and returned in the session. Exploitable today.
**Fix:** `path.resolve().is_relative_to(self.wiki_path.resolve())` check + restrict slug to `[a-z0-9-]`.

### S2. "Tailscale-only" is not actually enforced
`core/config.py:10` and `deploy/researchos-backend.service:8` bind `0.0.0.0` — the API listens on every interface (LAN, Wi-Fi, Docker bridges), not just the tailnet. Combined with no auth + `allow_origins=["*"]` (`api/main.py:29-34`), any webpage open in your browser can POST to the API and read responses (CORS `*` makes the preflight succeed), and DNS rebinding bypasses origin checks entirely. A drive-by page can read all sessions and write attacker content into the Obsidian vault via `/decide`.
**Fix:** bind to the Tailscale IP (or firewall 8001 on LAN interfaces), and lock CORS to the known frontend origin. No-auth is then a defensible single-user posture.

---

## High

- **B5. Qwen retry grows the context every attempt** — `qwen.py:70-76` appends the failed output + correction to `messages` and resends; for big evaluator calls this compounds the thinking-model truncation problem it's trying to fix.
- **B6. Schema computed but never sent to the model** — `qwen.py:37` builds `response_model.model_json_schema()` and never uses it. The model only knows the shape from prose in the system prompts. vLLM supports guided/structured JSON (`response_format` with `json_schema` / `guided_json`); using it would eliminate the validation-retry loop almost entirely.
- **B7. `retry_research` orphans the old job** — `sessions.py:202-225`; old row keeps its `searching`/`failed` status, `find_incomplete_jobs` picks it up on restart → duplicate pipelines for one session. Also `find_incomplete_jobs` (`repository.py:80-86`) is `SELECT data FROM jobs` with no WHERE and no status index — full scan + full deserialization at startup.
- **B8. `get_repo()` init race** — `api/deps.py:20-29`, unlocked double-check; two concurrent first requests open two connections. Initialize in lifespan and store on `app.state`.
- **B9. Session model can't express failure** — `core/models.py:67` status literal lacks `"failed"`; all-needs-failed sessions report `complete`.
- **F3. Polling lifecycle races** — `research-status.tsx:26-41` and `[id]/page.tsx:125-143`: `clearInterval` on unmount doesn't stop in-flight fetch continuations; `setJob`/`onComplete` fire after unmount. Fix with mounted flag + `AbortController`. The `[id]` page's `init()` (lines 90-123) can also `router.push` while polling is active.
- **F4. BudgetPill hardcoded** — `research/new/page.tsx:101` renders `amount={4200}` regardless of what the user typed.
- **S3. `javascript:` URL vector** — `product-card.tsx:34,48` and `results/page.tsx:61` render LLM/web-derived URLs as `href` with no scheme validation. React escapes HTML but not URL schemes. Validate `http(s)` in the Pydantic model and client-side.
- **S4. SSRF allowlist is substring-based** — `orchestrator.py:169` uses `domain in s.url`, so `http://evil.com/amazon.com` passes and Firecrawl fetches it from inside the rig's network (vLLM, Vane, SearXNG all reachable). Parse the URL and exact-match the host.

## Medium

- **B10.** `timeout_seconds=300` on `ResearchJob` (`models.py:95`) is never enforced — no `wait_for`, no watchdog.
- **B11.** Fallback `OptimizedQueries` (`orchestrator.py:36-40`) and one-query LLM outputs can send the same query to community/general/retailer searches — wasted Vane calls.
- **B12.** Firecrawl total failure is invisible — per-URL failures logged at DEBUG; if all 15 fail the need silently degrades to Vane-only with no diagnostic.
- **B13.** `QwenClient` sent `"model": ""` — `deps.py:56` never passes a model name; add a `qwen_model` setting.
- **F5.** Prompt-injection-adjacent: scraped page content flows into Qwen prompts with no "treat as data" framing; output is bounded to JSON fields, but `community_note`/`fit_rationale`/`source_url` are poisonable and end up in the UI and Obsidian vault.
- **F6.** Accessibility: FitScore dot is color-only with no `aria-label` (`fit-score.tsx:19-21`); strong/poor are red/green (colorblind-hostile). Advisor orb button has `title` but no `aria-label` (`layout.tsx:67-76`). Need-status icons color-only (`[id]/page.tsx:43-44`).
- **F7.** Pipeline UI never highlights "Scoring Fit" — `pipelineStageIndex` (`[id]/page.tsx:19-25`) maps researching→1 and complete→3; index 2 unreachable.
- **F8.** Decide-page selection passed via comma-joined query string — lost on refresh, URL-length-limited; persist server-side or in sessionStorage.
- **F9.** Duplicate timer risk in elapsed counter (`research-status.tsx:43-47`) — re-render mid-research can start a second interval (elapsed counts 2×/sec).

## Low / hygiene

- `API_URL` re-declared in six files; `lib/api.ts` helpers exist but are bypassed.
- `health.py:10` `Depends(lambda: Settings())` re-reads env per call.
- Dashboard date uses `toISOString().slice(0,10)` — shows UTC date, off-by-one for non-UTC users (no hydration risk; it's a server component).
- `price-chart.tsx:9-10`: `.filter((p) => p.price)` drops price=0 items and doesn't type-narrow.
- StatusBadge falls back to "CREATED" styling for unknown statuses.
- Test gaps: no concurrent-write repo test, no null-content/retry Qwen test, no route tests for `/research`, `/retry`, `/cancel`, `/status`.

## Secrets

Clean. `.env` gitignored and not committed; only `.env.example` with placeholders tracked; `NEXT_PUBLIC_API_URL` is the only public var and is non-secret. Ensure `.env` on the rig is `chmod 600`.

---

## Answers to the six review questions

**1. Is the 3-phase pipeline sound?** Yes. The phase design is right and the batched-resume model (skip needs already `complete`) is a good touch. Fix the substrate: B1-B4.

**2. Concurrency issues with batched gather?** Yes, real ones: shared SQLite connection (B2), GC-able tasks (B1), serial scraping inside the batch (B4), and the very first `save_need_result` sits outside the per-need try so a failure there leaves a permanent `searching` row that `return_exceptions=True` swallows.

**3. Is the prompt engineering effective?** Mostly yes — the prompts are well-built: numbered flat rules, null discipline on price ("do NOT guess"), concrete few-shot examples for `community_note`, dedup-across-retailers rule, temp 0.2. Two structural weaknesses: (a) "extract EVERY product, NO limit" is in direct tension with a thinking model and `max_tokens=16384` — unbounded arrays + invisible reasoning tokens is the exact truncation failure already hit once; cap output (top ~20 by fit) or use vLLM structured output; (b) the JSON schema is computed but never sent (B6) — wiring vLLM guided JSON would remove the retry loop and its context-growth problem (B5) at the root. Cheap win: one line in the system prompts telling the model to treat scraped page content as data, not instructions.

**4. Frontend?** No true hydration bugs found. Real issues: error states (F2 — results page crashes on API errors), the broken gaps selection (F1), polling lifecycle (F3), hardcoded BudgetPill (F4), and the color-only accessibility gaps (F6).

**5. Is no-auth + CORS \* acceptable for Tailscale-only?** Only if Tailscale is actually the only route — and today it isn't, because the service binds 0.0.0.0 (S2). Bind to the tailnet IP (or firewall 8001) and pin CORS to the frontend origin; after that, no-auth is acceptable for single-user. CORS `*` buys nothing and enables the browser-pivot/DNS-rebinding class, so fix it regardless.

**6. Production-grade for multiple users — priority order:**
1. Enforce the network boundary + auth (Tailscale Serve identity headers give per-user identity for free) + pinned CORS
2. Fix S1 path traversal, S3 URL scheme validation, S4 SSRF host matching (small, exploitable today)
3. `owner` column on sessions; scope every query and the wiki write target per user
4. Durable job queue (arq/Dramatiq) instead of in-process `create_task` — jobs survive deploys, API gets backpressure
5. SQLite → Postgres (or at minimum WAL + connection-per-task) once concurrent users run research
6. Per-user rate limits + needs-per-session cap (one pasted list can saturate the GPU stack)
7. Structured logging with user/job ids + success/latency metrics on Qwen/Vane/Firecrawl

## Suggested fix order (highest leverage first)

1. B3 + B1 + B7 — kills the stuck-job/respawn loop and the session pile-up (known issue #4)
2. B2 — SQLite locking, prerequisite for any concurrency increase
3. B4 — parallel scrapes; this, not BATCH_SIZE, is why 20-item lists take 20+ minutes (known issue #6)
4. F1 + F2 — one broken feature, one crash-on-error; both small
5. S1 + S2 — the two genuinely exploitable security items
6. B6 — vLLM guided JSON; removes a whole class of Qwen retry/truncation failures
