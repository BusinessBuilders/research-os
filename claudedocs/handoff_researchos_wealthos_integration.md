# ResearchOS × Wealth OS — Integration Handoff

## What this is

ResearchOS is the "spend money well" arm. Wealth OS is the "see every dollar" arm.
Today they don't talk: ResearchOS produces purchase decisions (products, prices,
total cost, rationale) that die in an Obsidian wiki page, and Wealth OS shows cash
positions with no idea that $450 of bookbinding equipment was just committed.
The integration makes every researched purchase a first-class planned expense in
the cash dashboard, and gives ResearchOS real budget envelopes instead of a
hand-typed number.

## ResearchOS — what the other side needs to know

**Repo:** github.com/BusinessBuilders/research-os, branch `fix/review-fixes-quality-sort`
**Running:** Nova Rig (Tailscale 100.76.233.80) — backend FastAPI :8001, frontend Next.js :4000
**Storage:** SQLite (`backend/researchos.db`), decisions also written as markdown to the Obsidian wiki
**Auth:** none (Tailscale-only deployment, CORS pinned)

### Key API surface (FastAPI, all JSON)

- `POST /api/sessions` — create research session `{goal, budget?, needs_list?, mode?}`
- `POST /api/sessions/{id}/analyze` — gap analysis → needs + approach brief (community methods)
- `POST /api/sessions/{id}/research` — run 3-phase pipeline `{need_ids?: string[]}`
- `GET /api/sessions/{id}` — full session: needs[].products[] with `price`, `quality_score` (1-5 community stars), `community_note`, `source_url`
- `POST /api/sessions/{id}/decide` — `{selected_product_ids, rationale, project_slug?, budget_category?}` → writes wiki decision page, returns `Decision`

### The Decision model (the integration payload)

```python
class Decision(BaseModel):
    session_id: str
    decision_date: str           # ISO date
    project_slug: str | None    # e.g. "robot-built", maps to a business/project
    needs_addressed: list[str]
    selected_products: list[ProductCard]  # name, price, source_url, source_name, quality_score
    total_cost: float
    budget_category: str | None  # free text today — should become a Wealth OS category id
    rationale: str
    alternatives_considered: int
```

## Integration design (build in this order)

### 1. Decision → planned purchase (highest value, do first)
When `POST /decide` fires, ResearchOS pushes a **planned purchase** into Wealth OS:
`{source: "researchos", session_id, decision_date, business, category, total_cost,
line_items: [{name, price, source_url, quality_score}], wiki_path, status: "planned"}`.
Wealth OS shows it in the cash dashboard as committed-but-unspent money ("every
dollar has a job" — these dollars' job is the pending purchase). Implement as either:
- a small `wealth_client.py` in ResearchOS POSTing to a Wealth OS REST endpoint, or
- a Wealth OS MCP tool ResearchOS calls — pick whichever matches Wealth OS's
  existing 19-tool MCP data layer conventions.
Decide and implement the receiving endpoint + a `planned_purchases` table/view.

### 2. Real budget envelopes → ResearchOS
ResearchOS's `budget` field is a hand-typed float. Replace with a fetch from Wealth OS:
`GET /api/budgets?business=...` → category envelopes with remaining amounts.
The New Research page shows a business/category picker; the BudgetPill shows the
real remaining envelope; gap analysis already consumes budget in its prompt.

### 3. Purchase confirmation loop
Planned purchase → user marks "purchased" (in either UI) → Wealth OS converts to an
actual expense (actual price paid vs researched price = variance worth showing),
and ResearchOS marks the session's products `selected_for_purchase=true` →
equipment lands in the Obsidian `entity-equipment-inventory.md`, which ResearchOS's
gap analyzer already reads — closing the loop so future research knows what's owned.

### 4. Dashboard card
Wealth OS dashboard gets a "Pending purchases" card: researched decisions not yet
bought, with total committed, per business. Link each row to
`http://100.76.233.80:4000/research/{session_id}/decide` and the wiki page.

## Constraints & gotchas

- Both systems are Tailscale-only, no auth — keep integration server-to-server on
  the tailnet; do NOT expose either publicly to make webhooks easier.
- ResearchOS prices can be null (not all retailers expose them) — planned purchase
  totals must tolerate partial pricing; pass `priced_items/total_items` so the
  dashboard can flag uncertainty.
- `budget_category` is free text today. Define the canonical category list in
  Wealth OS and have ResearchOS fetch it (don't duplicate the enum in two repos).
- Businesses: Super Nova Robotics, Donovan Farms, Business Builders — `project_slug`
  in ResearchOS should map to these; today it's a wiki slug, define the mapping.
- Wealth OS DB migrations were written but not yet applied (as of 2026-06-10) —
  apply them before building the planned_purchases table on top.
- Qwen 3.5 122B on :8080 is shared by both systems — the integration itself should
  not need LLM calls; keep it plain data plumbing.

## What to deliver

1. Receiving endpoint or MCP tool in Wealth OS for planned purchases + table + migration
2. `wealth_client.py` in ResearchOS + call from the `/decide` route (feature-flagged
   via `RESEARCHOS_WEALTH_OS_URL` env — absent = integration off, nothing breaks)
3. Budget envelope fetch + UI picker in ResearchOS New Research page
4. Pending-purchases dashboard card in Wealth OS
5. Tests on both sides; deploy notes (ResearchOS deploys via git push to nova-rig +
   systemd restart — see deploy/DEPLOY-NOTES.md in the research-os repo)

## Review questions before building

1. REST endpoint or MCP tool for the planned-purchase push — which fits Wealth OS's architecture?
2. Where does "mark as purchased" live — Wealth OS dashboard, ResearchOS decide page, or both?
3. Should budget envelopes be hard limits (block research over budget) or advisory (warn)?
4. Does the variance report (researched price vs paid price) matter enough for v1?
