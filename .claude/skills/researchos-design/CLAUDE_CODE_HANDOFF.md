# Claude Code Handoff — apply the ResearchOS design system

This bundle **is** the ResearchOS design system (tokens, components, specs, real Geist fonts,
and a working 6-screen reference kit). Your `BusinessBuilders/research-os` frontend already has
the six pages built — so the job is **not** "write an app from scrat," it's **re-skin and
tighten the existing Next.js frontend to match this system**, screen by screen.

> **What the files are.** The `.html`/`.jsx` here are **design references** — they show the
> intended look, tokens, and behavior. Recreate them using the repo's real stack (Next.js +
> React + shadcn/ui + Recharts + lucide-react). Don't ship the HTML directly. Fidelity is
> **high** — colors, type, spacing, and interactions are final.

## Visual targets

`handoff_screens/` holds a hi-res capture of every screen, rendered in the real Geist type at
the intended dark navy. Implement each route to match its frame pixel-for-pixel:

| # | File | Screen |
|---|---|---|
| 1 | `handoff_screens/1-dashboard.png` | Dashboard — session cards + status pills |
| 2 | `handoff_screens/2-new-research.png` | New Research — focal form + budget pill |
| 3 | `handoff_screens/3-session-detail.png` | Session Detail — live CI pipeline (in-progress) |
| 4 | `handoff_screens/4-gap-analysis.png` | Gap Analysis — needs + priority + cost |
| 5 | `handoff_screens/5-results.png` | Results — product cards + fit dots |
| 6 | `handoff_screens/6-decision.png` | Decision — summary + budget check |

These are targets, not the source — the live, clickable version is
`ui_kits/research-os/index.html`, and `design.md` is the authority for states the static frames
can't show (loading, error, empty, hover).

---

## 0 · Get it onto a branch

Nothing here is in GitHub yet (this was authored in a design tool with read-only repo access).
From your local `research-os` checkout:

```bash
git checkout -b design/researchos-system

# Drop this whole bundle in as a Claude Code skill:
mkdir -p .claude/skills/researchos-design
cp -R <unzipped-bundle>/* .claude/skills/researchos-design/

git add .claude/skills/researchos-design
git commit -m "Add ResearchOS design system skill"
```

Then open Claude Code in the repo and say: *"Use the researchos-design skill. Apply it to the
frontend — start with `globals.css` tokens and fonts, then re-skin each page to match
`design.md`."* Claude Code reads `SKILL.md` → `readme.md` → `design.md` and has everything it
needs.

---

## 1 · Fonts (do this first — biggest visual delta)

Real **Geist / Geist Mono** woff2 ship in `assets/fonts/`. Wire them the Next.js way:

```ts
// app/fonts.ts  — or use next/font/google ({ subsets:['latin'] }) for Geist
import localFont from "next/font/local";
export const geistSans = localFont({
  variable: "--font-sans",
  src: [
    { path: "../public/fonts/Geist-Regular.woff2",  weight: "400" },
    { path: "../public/fonts/Geist-Medium.woff2",   weight: "500" },
    { path: "../public/fonts/Geist-SemiBold.woff2", weight: "600" },
    { path: "../public/fonts/Geist-Bold.woff2",     weight: "700" },
  ],
});
export const geistMono = localFont({
  variable: "--font-mono",
  src: [
    { path: "../public/fonts/GeistMono-Regular.woff2",  weight: "400" },
    { path: "../public/fonts/GeistMono-Medium.woff2",   weight: "500" },
    { path: "../public/fonts/GeistMono-SemiBold.woff2", weight: "600" },
  ],
});
```

Copy the woff2 into `public/fonts/`, add `${geistSans.variable} ${geistMono.variable}` to
`<body>`. (Geist is also on `next/font/google` if you prefer the CDN-cached route.)

---

## 2 · Tokens → your `globals.css`

Your `globals.css` is shadcn-style (`@theme inline`, `--background`/`--foreground`/`--primary`
in the dark block). Port the values from `tokens/*.css` into those existing CSS variables —
don't fork the theme system, **map into it**:

| This system (`tokens/`) | shadcn var in your `globals.css` (dark) | Value |
|---|---|---|
| `--canvas` | `--background` | `#010120` |
| `--text` | `--foreground` | `#ffffff` |
| `--surface-2` | `--card` | `#0e0e24` |
| `--surface-soft` | `--muted` / `--secondary` | `#1b1b34` |
| `--hairline` | `--border` | `#26263a` |
| `--hairline-strong` | `--input` | `#313641` |
| `--primary` | `--primary` (near-white pill) | `#ededf2` |
| `--brand-periwinkle` | `--ring` / accent | `#bdbbff` |
| `--danger` | `--destructive` | `#ef4444` |
| radius `--radius` | `--radius` | `0.625rem` |

Keep the **semantic** + **brand-gradient** tokens (`--success/--warning/--info`,
`--brand-gradient`, `--brand-mint`) as additional custom properties — shadcn doesn't have slots
for fit-scores, the gradient CTA, or the budget mint, and they're load-bearing here.
`tokens/colors.css` is the full source of truth (111 tokens).

---

## 3 · Components

The repo's shadcn `ui/*` (Button, Badge, Card, Input, Textarea, Checkbox, Separator) stay —
once the tokens above are mapped, they inherit the look. Add the **four domain primitives**
that don't exist in shadcn; lift them straight from `components/research/`:

- `FitScore` — glowing dot + mono label (`strong`/`partial`/`poor`)
- `PriorityBadge` — wraps Badge (`critical`/`important`/`nice-to-have`)
- `StatusBadge` — session lifecycle pill (mono)
- `BudgetPill` — mint cash-position pill

Plus `Logo` (`components/brand/Logo.jsx`, inline-SVG mark). Each has a `.d.ts` (props) and
`.prompt.md` (usage) next to it.

---

## 4 · Screens — implement against `design.md`

`design.md` specs all six with layout, states (empty/loading/error/populated), exact tokens,
responsive breakpoints, and interactions, plus ASCII sketches. Map to the existing routes:

| Route (exists) | Spec § | Re-skin focus |
|---|---|---|
| `app/page.tsx` | §1 Dashboard | session **cards** (not a table), status pills, empty state |
| `app/research/new/page.tsx` | §2 New Research | single-card focal form, `BudgetPill`, brand CTA |
| `app/research/[id]/page.tsx` | §3 Session Detail | CI-pipeline rail + live need list (spinners) |
| `app/research/[id]/gaps/page.tsx` | §4 Gap Analysis | checkboxes + priority + cost inline |
| `app/research/[id]/results/page.tsx` | §5 Results | product cards, fit dots, **Recharts** price chart |
| `app/research/[id]/decide/page.tsx` | §6 Decision | summary, budget badge, wiki-write confirm |

The interactive reference for all of this is `ui_kits/research-os/index.html` — click through
it to see the intended flow and motion. `ui_kits/research-os/screens.jsx` is the readable
source for each screen's structure.

**Charts:** §5's price comparison is real **Recharts** in production — `<BarChart
layout="vertical" data={products}>`, `<Bar dataKey="price" fill="#3b82f6" radius={[0,4,4,0]}>`,
mono tick labels. The kit's CSS bars mirror it 1:1; swap Recharts back in for live data.

---

## 5 · Definition of done

- [ ] Geist/Geist Mono loading via `next/font`, no system fallback in production
- [ ] `globals.css` dark tokens match the table in §2; gradient + semantic tokens added
- [ ] Four domain primitives + `Logo` ported into `components/`
- [ ] All six routes match `design.md` (incl. empty/loading/error states)
- [ ] Lucide icons standardized per `guidelines/iconography.html`
- [ ] Recharts price chart styled to the §5 spec
- [ ] Mobile (<768) / tablet / desktop behavior per each screen's Responsive section

---

## Files in this bundle

`styles.css` (entry) · `tokens/` (colors, typography, spacing, radius, fonts, base) ·
`components/` (actions, forms, display, research, brand — each `.jsx` + `.d.ts` + `.prompt.md`) ·
`guidelines/` (foundation specimen cards) · `ui_kits/research-os/` (live reference kit) ·
`assets/` (logo, mark, Geist fonts) · `design.md` (screen specs) · `readme.md` (full guide) ·
`SKILL.md` (Agent-Skills front matter).
