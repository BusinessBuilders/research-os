Glowing dot + mono label showing how well a product matches a need. Sits on the first line of every ProductCard.

```jsx
<FitScore score="strong" />
<FitScore score="partial" showLabel={false} />
```

Colors are fixed: `strong`=green, `partial`=amber, `poor`=red. Drop the label (`showLabel={false}`) when space is tight and the color alone carries meaning.
