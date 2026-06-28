Primary interactive control — use for every click action; `primary` is the default near-white pill, `brand` is the gradient hero CTA.

```jsx
<Button onClick={start}>Start Research</Button>
<Button variant="brand">New Research</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive">Retry</Button>
```

Variants: `primary` (default, near-white), `brand` (orange→magenta→periwinkle gradient — reserve for one hero CTA per view), `accent` (periwinkle), `secondary`, `outline`, `ghost`, `destructive`, `link`. Sizes: `sm`, `md` (default), `lg`, `icon`. Icons render at 16px via `<svg>` children. Never stack two `brand` buttons in one viewport.
