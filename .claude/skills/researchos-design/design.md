# ResearchOS — Screen Design Spec

> **AI Procurement Advisor.** Describe a goal → the advisor identifies needs, searches
> sources, scores fit, and writes a decision record to your wiki. Dark-mode only.
>
> This document specs the six product screens. Tokens, components and a live click-through
> kit live alongside it — see `readme.md` for the manifest. Source of truth: the real
> Next.js frontend in `BusinessBuilders/research-os` (`frontend/src/app/**`).

---

## Foundations (applies to every screen)

- **Surface:** `--canvas` `#010120` deep navy. Cards `--surface-2` `#0e0e24` with a 1px
  `--hairline` ring (`box-shadow: inset 0 0 0 1px`), never a heavy drop shadow.
- **Type:** **Geist** sans for headings/body (sentence case, tight tracking); **Geist Mono**,
  uppercase, positive-tracking for eyebrows, status labels, prices, and part numbers.
- **Brand gradient:** `#fc4c02 → #ef2cc1 → #bdbbff`, one fixed object. Used for the logo
  mark, the single hero CTA (`Button variant="brand"`), and the floating advisor orb. Never
  recolored, reordered, or shrunk to icon size.
- **Radius:** cards 14px, buttons/inputs 10px, badges full pill.
- **Icons:** Lucide (`lucide-react`), 1.5px stroke, 16–20px.
- **App shell:** sticky 52px header — logo left, `Dashboard / New Research / [+ New]` right;
  content column `max-width: 1024px`, 24px gutters; floating gradient advisor orb bottom-right.

### Status → color map (used throughout)

| Token | Hex | Session status | Fit score | Pipeline / need |
|---|---|---|---|---|
| `--success` | `#22c55e` | complete | strong | done |
| `--warning` | `#f59e0b` | — | partial | evaluating |
| `--danger`  | `#ef4444` | failed | poor | failed |
| `--info`    | `#3b82f6` | analyzing · researching | — | searching |
| `--brand-periwinkle` | `#bdbbff` | decided | — | active step |
| neutral | `--surface-soft` | created | — | pending |

### Responsive (all screens)

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | < 768px | Header collapses to logo + `[+]`; all grids → 1 col; page padding 16px; buttons ≥ 44px tall. |
| Tablet | 768–1023px | Session grid 2-up; content full width minus 16px gutters. |
| Desktop | ≥ 1024px | Content column caps at 1024px and centers; session grid auto-fills 340px tracks. |

---

## 1 · Dashboard — `/`

Session **cards** (not a table), each: mode eyebrow, status badge, goal title, date, need
count, budget.

```
┌──────────────────────────────────────────────────────────────────┐
│ ◎ ResearchOS              Dashboard   New Research   [✦ New]       │  ← sticky header
├──────────────────────────────────────────────────────────────────┤
│ SESSIONS                                                            │
│ Research Sessions                       [👁 Empty state] [✦ New …]  │
│                                                                     │
│ ┌─────────────────────────┐  ┌─────────────────────────┐          │
│ │ GOAL-DRIVEN  [RESEARCHING]│  │ PRODUCT RESEARCH [DECIDED]│        │
│ │ Upgrade robotics fab to  │  │ Source a benchtop reflow │        │
│ │ build tendon actuators   │  │ oven for small-run PCBA  │        │
│ │ ───────────────────────  │  │ ───────────────────────  │        │
│ │ 📅 2026-06-06  ✓ 4 needs │  │ 📅 2026-06-04  ✓ 3 needs │        │
│ │                  $4,200  │  │                  $1,500  │        │
│ └─────────────────────────┘  └─────────────────────────┘          │
│                                       ( ✦ floating advisor orb )    │
└──────────────────────────────────────────────────────────────────┘
```

- **Layout:** CSS grid, `repeat(auto-fill, minmax(340px, 1fr))`, 14px gap. Header flex
  space-between.
- **States:**
  - *Empty* (first-run): centered card — orb mark, "No research sessions yet", brand CTA
    "Start your first research".
  - *Populated:* card grid.
  - *Loading:* skeleton cards (3 placeholder rows at `--surface-soft`).
  - *Error:* inline `--danger-text` line "Couldn't reach the research service."
- **Color tokens:** card `--surface-2` + hairline ring; title `--text` 15px/600; meta
  `--text-muted` 12px; budget mono; status via `StatusBadge`.
- **Interactions:** whole card is a link — hover lifts to `--surface-3` + `--elev-2`
  (150ms). Click → session detail (or results if already complete/decided). `[+ New]` →
  New Research.

---

## 2 · New Research — `/research/new`

One textarea, one budget, one button. The single focal action.

```
┌──────────────────────────────────────────────────────────────────┐
│  NEW SESSION                                                       │
│  What are you researching?                                         │
│  One goal, one budget. The advisor handles the rest.              │
│  ┌──────────────────────────────────────────────────┐            │
│  │                                  ● $4,200 available │  ← BudgetPill (mint)
│  │  What are you looking for?                         │            │
│  │  ┌────────────────────────────────────────────┐   │            │
│  │  │ upgrade my robotics fab setup to build…     │   │  ← Textarea
│  │  └────────────────────────────────────────────┘   │            │
│  │  Describe a goal, a product, or a part to look up. │            │
│  │  Budget (optional)                                 │            │
│  │  ┌────────────────────────────────────────────┐   │            │
│  │  │ $ 4200                                      │   │  ← mono Input
│  │  └────────────────────────────────────────────┘   │            │
│  │                                [ ✦ Start Research ] │  ← brand CTA
│  └──────────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

- **Layout:** single card, `max-width: 640px`, centered. BudgetPill right-aligned at top.
- **States:** *default* (CTA disabled until goal non-empty); *submitting* → CTA label
  "Starting…", spinner; *error* → `--danger-text` line under the button.
- **Color tokens:** field `--surface-input` + `--hairline-strong` border; focus border
  `--brand-periwinkle` + 3px periwinkle ring; BudgetPill mint on `rgba(200,246,249,.10)`.
- **Responsive:** card goes full-width < 640px; CTA full-width and ≥ 44px on mobile.
- **Interactions:** focus ring on fields; `Start Research` → session detail pipeline.

---

## 3 · Session Detail — `/research/[id]` (CI pipeline aesthetic)

Goal header → 4-step pipeline rail → live need list with status + elapsed + cancel/retry.

```
┌──────────────────────────────────────────────────────────────────┐
│ GOAL-DRIVEN · RUNNING                                             │
│ Upgrade robotics fab    Build tendon actuators · $4,200 budget   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Researching…                                      [ ✕ Cancel ] │ │
│ │ 1/4 needs · 0m 12s elapsed                                     │ │
│ │ ▰▰▰▰  ▰▰▱▱  ▱▱▱▱  ▱▱▱▱                                         │ │
│ │ ✦ ANALYZING  ⌕ SEARCHING  ◎ SCORING  ✓ COMPLETE               │ │  ← pipeline rail
│ └──────────────────────────────────────────────────────────────┘ │
│ IDENTIFIED NEEDS                                                  │
│ ✓ High-torque servo motor (≥3 N·m)                  3 products    │
│ ⟳ Spectra / Dyneema tendon line               [SEARCHING]        │
│ ○ Low-friction PTFE sheath + pulleys                             │
│ ○ Bench power supply (24V, ≥10A)                                 │
│                              [ Continue to gap analysis › ]       │
└──────────────────────────────────────────────────────────────────┘
```

- **Layout:** goal head; pipeline card; need rows (`--surface-2`, 16px padding). Pipeline =
  4 equal flex columns, each a 3px progress bar + mono step label.
- **States:**
  - *Connecting:* "Connecting to research pipeline…" pulsing.
  - *Running:* steps advance; active step bar = periwinkle, icon spins; done = green.
  - *Per-need:* `pending ○` / `searching ⟳ (info, spin)` / `evaluating ⟳ (warning, spin)` /
    `complete ✓ (green) + N products` / `failed ✗ (danger)`.
  - *Cancelled:* "Research cancelled" + `[↻ Re-run]`.
  - *Complete:* `[Continue to gap analysis]` becomes the brand CTA.
- **Color tokens:** pipeline active `--brand-periwinkle`, done `--success-text`, idle
  `--text-faint`; elapsed timer mono `--text-muted`.
- **Interactions:** `Cancel` halts polling; `Re-run` resets; complete auto-enables the CTA.
  Spinners respect `prefers-reduced-motion`.

---

## 4 · Gap Analysis — `/research/[id]/gaps`

Checkbox per need, priority badge + estimated cost inline, rationale below.

```
┌──────────────────────────────────────────────────────────────────┐
│ GAP ANALYSIS                                                      │
│ What you'll need                                                  │
│ Qwen broke the goal into needs and scored each against budget.   │
│ ☑ High-torque servo motor (≥3 N·m)  [critical]   $180 – $320/unit │
│   Tendon actuation needs stall-torque headroom + encoders.       │
│ ☑ Spectra / Dyneema tendon line     [important]  $25 – $60/spool  │
│ ☑ Low-friction PTFE sheath + pulleys[important]  $40 – $90        │
│ ☐ Bench power supply (24V, ≥10A)    [nice-to-have] $70 – $160     │
│ 3 of 4 selected                  [ ⌕ Research 3 Selected ]        │
└──────────────────────────────────────────────────────────────────┘
```

- **Layout:** stacked need cards (`--surface-2`, 16px). Checkbox + body row; priority badge
  and cost on the title line (cost right-aligned, mono).
- **States:** *default* (3 critical/important pre-checked); CTA disabled at 0 selected;
  count text updates live.
- **Color tokens:** checkbox checked = `--brand-periwinkle`; priority via `PriorityBadge`
  (`critical`=danger, `important`=info, `nice-to-have`=neutral); cost mono `--text-muted`.
- **Interactions:** toggle checkbox; `Research N Selected` (brand CTA) → results.

---

## 5 · Results — `/research/[id]/results`

Per selected need: product cards + a price-comparison chart. Select products to compare /
decide.

```
┌──────────────────────────────────────────────────────────────────┐
│ RESULTS · Products found                                          │
│ High-torque servo motor (≥3 N·m)               [ 3 found ]        │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ ☑ [▦] ● Dynamixel XM430-W350-T  $269.90 · ROBOTIS            │ │  ● = green fit dot
│ │       3.7 N·m, 12-bit absolute encoder, TTL bus…             │ │
│ │       [⚠ lead time 2–3 wk]                                   │ │
│ │ ☐ [▦] ● Feetech STS3250  $39.50 · Alibaba   (amber dot)      │ │
│ │ ☐ [▦] ● Generic MG996R   $4.20 · AliExpress (red dot)        │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌─ 📊 Price comparison ────────────────────────────────────────┐ │
│ │ Dynamixel ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇  $269.90                         │ │  ← bars, fill --info
│ │ Feetech   ▇▇▇                  $39.50                         │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ 1 products selected      [↻ Re-research]  [ Decide on Winners › ] │
└──────────────────────────────────────────────────────────────────┘
```

- **Layout:** for each need — section head (title + "N found"), product rows, then a price
  chart card; `Separator` between needs. Product image is a 44px `--surface-soft` thumb with
  a `package` icon fallback.
- **States:**
  - *Researching:* the `ResearchStatus` pipeline card shows at top until complete.
  - *Populated:* product rows + chart.
  - *No products:* centered "No products found. The searches may have timed out." + `Retry`.
  - *direct-lookup mode:* renders a single answer + part numbers (mono) + citation links
    instead of the grid.
- **Color tokens:** fit dot `strong`=green / `partial`=amber / `poor`=red with a soft glow;
  price mono `--text-secondary`; risks = `Badge variant="outline"`; chart bars `--info`.
  Production uses **Recharts** (`<BarChart layout="vertical">`, `fill="#3b82f6"`); the kit
  renders equivalent CSS bars.
- **Responsive:** product rows stack name/price < 480px; chart keeps 150px label gutter.
- **Interactions:** checkbox selects a product (persists into Decision); `Re-research` → gaps;
  `Decide on Winners` (brand CTA) → decision.

---

## 6 · Decision — `/research/[id]/decide`

Summary before committing: selected products, total vs budget, fit scores, record preview,
then write to wiki.

```
┌──────────────────────────────────────────────────────────────────┐
│ DECISION · Finalize & commit                                      │
│ ┌─ SELECTED PRODUCTS ──────────────────────────────────────────┐ │
│ │ ● Dynamixel XM430-W350-T          ROBOTIS         $269.90     │ │
│ │ ● Dyneema SK99 1.2mm (50m)        Marlow           $34.00     │ │
│ │ ● igus PTFE liner + 8mm pulley    igus             $58.00     │ │
│ │ Total                            $361.90  [under $4,200]      │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌─ 📜 DECISION RECORD PREVIEW ─────────────────────────────────┐ │
│ │ • Goal, budget, 3 chosen parts with prices & sources         │ │
│ │ • Fit score + rationale per product                          │ │
│ │ • Your rationale + project slug, committed to the wiki        │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ Rationale  [____________________________________]                │
│ Project (slug) [project-eve-…]   Budget category [robotics-rd]   │
│                       [‹ Back]   [ ✓ Write Decision to Wiki ]     │
└──────────────────────────────────────────────────────────────────┘
```

- **Layout:** `max-width: 640px`. Summary card (line items + total row), preview card,
  then form fields, then footer actions.
- **States:**
  - *Default:* totals computed from selection; budget badge `success` if under, `danger` if
    over.
  - *Empty selection:* "No products selected" + disabled CTA.
  - *Submitting:* CTA "Writing to wiki…".
  - *Saved:* full-screen success — green check orb, "Decision written to wiki", the
    `wiki/decisions/…/actuators.md` path in a mono code block, `Back to dashboard`.
- **Color tokens:** total mono 16/600; budget badge success/danger; fit dots per product;
  wiki path `--brand-periwinkle` on `--surface-input`.
- **Interactions:** `Back` → results; `Write Decision to Wiki` (brand CTA) → saved state.

---

## Navigation model

`Dashboard → New Research → Session Detail (pipeline) → Gap Analysis → Results → Decision → Saved`

Header is consistent on every screen (logo home, Dashboard, New Research, + New). The advisor
orb is fixed bottom-right across all screens. Back-navigation is explicit via in-page buttons,
never a browser-only affordance.
