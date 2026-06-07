---
name: researchos-design
description: Use this skill to generate well-branded interfaces and assets for ResearchOS (the AI Procurement Advisor), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

ResearchOS is a dark-mode AI product-research & procurement advisor. The brand is a deep-navy
canvas (`#010120`) with one fixed gradient (`#fc4c02 → #ef2cc1 → #bdbbff`), a Geist sans +
Geist Mono type pairing, and Lucide icons. `design.md` specs all six product screens;
`tokens/` holds the CSS variables (entry point: `styles.css`); `components/` holds the React
primitives; `ui_kits/research-os/` is a working click-through of the whole flow.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and
create static HTML files for the user to view — link `styles.css` for tokens and reuse the
`.ros-*` classes or the components in `ui_kits/research-os/kit.jsx`. If working on production
code, copy assets and read the rules here to become an expert in designing with this brand
(real stack: Next.js + shadcn/ui + Recharts + lucide-react).

If the user invokes this skill without any other guidance, ask them what they want to build or
design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.
