Lifecycle pill for a research session — top-right of every session card and detail header.

```jsx
<StatusBadge status="researching" />
<StatusBadge status="decided" />
```

States: `created` (neutral), `analyzing`/`researching` (blue), `complete` (green), `decided` (brand periwinkle), `failed` (red). Uppercase mono by default — pass `mono={false}` for sentence case.
