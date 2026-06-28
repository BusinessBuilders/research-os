# ResearchOS Design System

**ResearchOS** is an AI-powered **product research & procurement advisor** — the research arm
of an autonomous "business builder" agent stack. You describe a goal ("upgrade my robotics fab
to build tendon-driven actuators"); the advisor breaks it into **needs**, searches real
sources, scores each product's **fit**, compares prices, and writes a durable **decision record**
to a team wiki so the next person (or agent) doesn't re-research it.

- **Tagline:** AI Procurement Advisor
- **Stack:** Vane + Qwen on local GPU (backend) · Next.js 16 + React 19 + shadcn/ui + Recharts (frontend)
- **Modes:** `goal-driven` (gap analysis → research) · `product-research` · `direct-lookup`
- **Surface:** dark-mode only, "mission control meets consumer product research."

## Sources (for whoever maintains this)

- **GitHub — product:** `BusinessBuilders/research-os` → https://github.com/BusinessBuilders/research-os
  - Frontend studied: `frontend/src/app/**` (the 6 pages), `frontend/src/components/**`
    (product-card, price-chart, research-status, shadcn `ui/*`), `frontend/src/lib/types.ts`
    (the data model this system mirrors), `frontend/src/app/globals.css` (shadcn dark theme).
  - Explore the repo further to deepen any production work against this product.
- **Brand logo:** `uploads/research-os-logo.svg` → copied to `assets/research-os-logo.svg`,
  with a transparent mark extracted to `assets/research-os-mark.svg`.
- **Brand foundation doc:** `uploads/DESIGN.md` — a Together-AI-lineage brand spec. The
  ResearchOS logo is built from exactly this palette (navy `#010120` + the
  orange→magenta→periwinkle gradient + system-ui/mono type), so this system follows the **real
  logo + DESIGN.md** rather than the loosely-worded "blue/purple + amber" brief. See *Caveats*.

---

## CONTENT FUNDAMENTALS

How ResearchOS writes.

- **Voice:** plain, technical, operator-to-operator. It talks like a competent shop lead, not
  a marketer. Example titles: *"Research Sessions"*, *"What you'll need"*, *"Products found"*,
  *"Finalize & commit"*.
- **Person:** addresses **you** ("What are you researching?", "Pick the ones to research").
  The system/AI is named when it acts — *"Qwen broke the goal into needs"*, *"Searching with
  Qwen…"* — which builds trust by being specific about the machinery.
- **Casing:** **sentence case** for every heading and body line. **UPPERCASE** is reserved for
  the monospace voice — eyebrows (`SESSIONS`, `GAP ANALYSIS`), status pills (`RESEARCHING`,
  `SEARCHING`), and step labels. That sans/mono, sentence/UPPERCASE split *is* the tone.
- **Buttons:** imperative and counted. *"Start Research"*, *"Research 3 Selected"*,
  *"Decide on Winners"*, *"Write Decision to Wiki"*. Numbers go in the label so the action's
  scope is unmistakable.
- **Numbers & specs:** always monospace, tabular — `$269.90`, `3.7 N·m`, `P/N XM430-W350-T`,
  `1/4 needs · 0m 12s`. Prices, part numbers, slugs and timers never sit in the sans face.
- **Honesty over hype:** empty/failure states say what happened plainly — *"No products found.
  The searches may have timed out."*, *"Research cancelled"*. No exclamation marks, no emoji.
- **Vibe:** a CI pipeline you can read. Progress is legible, every product carries a one-line
  rationale and explicit risks ("no datasheet", "lead time 2–3 wk"), and the payoff is a
  written record, not a dashboard high-five.

---

## VISUAL FOUNDATIONS

- **Color & vibe:** a single deep-navy canvas (`#010120`) carries everything — no light mode,
  no in-between greys. Elevation is built from a tight navy stack (`canvas → surface-1 →
  surface-2 → surface-3`) plus 1px hairline rings, **not** drop shadows. The mood is a dark
  mission-control console.
- **The gradient is the brand.** One fixed three-stop object — `#fc4c02` orange → `#ef2cc1`
  magenta → `#bdbbff` periwinkle. It appears as the logo mark, the one hero CTA per view, and
  the floating advisor orb. Never recolored, reordered, fourth-stopped, or shrunk to icon size.
  `#c8f6f9` mint is the only off-gradient accent and is reserved for budget/cash context.
- **Type:** two voices. A geometric **system-ui sans** for headings + body — sentence case,
  tight negative tracking (-0.02em at display). An **uppercase monospace** for eyebrows,
  status, prices, and part numbers — positive tracking (0.08–0.14em). The faces are
  **Geist / Geist Mono** (Vercel, OFL-1.1), self-hosted from `assets/fonts/` — the production
  typefaces, no substitution.
- **Spacing:** 4px base grid (shadcn/Tailwind rhythm). Cards pad 16–24px; need groups separate
  at 32px; page top padding 32px.
- **Backgrounds:** flat navy. No imagery, no photographic texture, no repeating patterns. The
  only "atmosphere" is the gradient (logo, orb) and a faint periwinkle focus glow. The sticky
  header uses a translucent navy + 12px backdrop-blur.
- **Corner radii:** cards 14px (`--radius-xl`), buttons/inputs 10px (`--radius-lg`), badges and
  the advisor orb full pill. One consistent system, no oversized rounding.
- **Cards:** `--surface-2` fill, `inset 0 0 0 1px --hairline` ring, optional 1px navy shadow.
  Interactive cards lift to `--surface-3` + `--elev-2` on hover (150ms). Never a colored
  left-border accent strip.
- **Borders & dividers:** `--hairline #26263a` for chrome and row dividers; `--hairline-strong
  #313641` for input borders.
- **Shadows:** minimal. `--elev-1` on cards, `--elev-2` on hover/popovers, `--glow-brand`
  (magenta bloom) only on the logo mark and orb. No soft shadows on flat light cards (there are
  none — it's dark).
- **Motion:** restrained and functional. 120–150ms ease on hover/focus/color; a 1s linear
  spin on in-progress icons; a 1px press-down (`translateY(1px)`) on buttons. The pipeline
  advances step-by-step. All looping motion respects `prefers-reduced-motion`.
- **Hover / press states:** buttons lighten or shift surface on hover (brand brightens +
  glows); press nudges down 1px. Cards lift. Links underline. Checkboxes fill periwinkle.
- **Focus:** 3px periwinkle ring (`--glow-focus`) + periwinkle border on fields — the one place
  the brand accent touches form chrome.
- **Transparency & blur:** used sparingly — the sticky header (navy 72% + blur) and the soft
  semantic tints (`success/warning/danger/info` at ~14% alpha for badges).

---

## ICONOGRAPHY

- **Set:** **Lucide** (`lucide-react` in the app). 1.5px stroke, rounded caps/joins, drawn at
  16–20px, inheriting `currentColor`. This is the only icon system — no emoji, no icon font, no
  bespoke SVG illustration.
- **Where used:** `search` / `sparkles` (advisor + searching), `loader` (in-progress, spinning),
  `circle-check` / `circle-x` / `circle` (need + pipeline status), `target` (scoring),
  `package` (product thumb fallback), `bar-chart-3` (price chart), `scroll-text` (wiki record),
  `wallet` (budget), `triangle-alert` (risks), `chevron-right` / `arrow-left` (nav),
  `rotate-cw` (retry), `plus` (new).
- **Status note:** the production `research-status.tsx` uses Unicode glyphs (✓ ✗ ⟳ ○) for the
  live feed; this system standardizes those onto the matching Lucide icons for visual
  consistency while keeping the same color semantics.
- **In this kit:** loaded from the Lucide CDN (`unpkg.com/lucide`) in cards and the UI kit. In
  production, import from `lucide-react`. The brand mark is the magnifier-orb logo
  (`assets/research-os-mark.svg`) — used for the favicon and empty states, never as a generic
  UI icon.

---

## Index / Manifest

**Root**
- `styles.css` — global entry point (imports only). Consumers link this one file.
- `design.md` — per-screen spec for all 6 product screens (layout, states, tokens, responsive,
  interactions + ASCII sketches).
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills-compatible front matter for use in Claude Code.

**Tokens** (`tokens/`, all `@import`ed by `styles.css`)
- `colors.css` · `typography.css` · `spacing.css` · `radius.css` (radius + elevation) ·
  `base.css` (reset + canvas defaults).

**Components** (`components/`, namespace `window.ResearchOSDesignSystem_aa62c9`)
- `components.css` — class-based styling for all primitives (`.ros-*`).
- `actions/` — **Button** (primary · brand · accent · secondary · outline · ghost · destructive · link).
- `forms/` — **Input · Textarea · Checkbox** (+ `.ros-label` / `.ros-hint`).
- `display/` — **Badge** (8 variants + mono) · **Card** (+ Header/Title/Description/Content/Footer) · **Separator**.
- `research/` — **FitScore · PriorityBadge · StatusBadge · BudgetPill** (domain primitives).
- `brand/` — **Logo** (mark · wordmark · lockup, inline-SVG).

**Guidelines** (`guidelines/`) — foundation specimen cards: brand gradient, surfaces, semantic,
text, display/body/mono type, spacing, radius+elevation, logo lockup, Lucide iconography.

**UI kit** (`ui_kits/research-os/`)
- `index.html` — interactive 6-screen click-through (Dashboard → New → Pipeline → Gaps →
  Results → Decision → Saved). Self-contained: `kit.jsx` (primitives + icons), `data.js`
  (fixtures), `screens.jsx` (screens + shell), `app.jsx` (router).

**Assets** (`assets/`) — `research-os-logo.svg` (full lockup), `research-os-mark.svg` (orb
mark), `fonts/` (Geist & Geist Mono woff2, the production typefaces).

---

## Production notes

- **Fonts are the real thing.** Geist & Geist Mono (Vercel, OFL-1.1) ship with this system —
  woff2 in `assets/fonts/`, `@font-face` in `tokens/fonts.css`, weights 400/500/600/700.
  Self-hosted, no CDN dependency. This matches the production app exactly.
- **Brand is aligned with production.** The system uses the real product palette — navy
  `#010120` + the orange→magenta→periwinkle gradient straight from `research-os-logo.svg` and
  `DESIGN.md` — not the brief's loosely-worded "blue/purple + amber" (amber is kept only as the
  semantic *partial-fit / evaluating* color, where it belongs).
- **Charts.** The kit renders the price comparison as dependency-free CSS bars that mirror the
  production **Recharts** `<BarChart layout="vertical" fill="#3b82f6">`. Swap in Recharts
  verbatim for live data — the visual spec (vertical bars, info-blue fill, mono price labels)
  is identical.
- **Stack parity.** Components are framework-agnostic React over CSS custom properties — they
  drop into the real Next.js + shadcn/ui app without a styling runtime, and the `.ros-*`
  classes map 1:1 to the token system.
