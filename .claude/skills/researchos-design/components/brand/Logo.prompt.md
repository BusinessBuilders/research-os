The ResearchOS lockup — magnifier-orb mark with the gradient-tinted "OS" wordmark. Use in the app header and any branded surface.

```jsx
<Logo size={28} />                       // mark + wordmark
<Logo variant="mark" size={32} />        // just the orb
<Logo showTagline />                     // adds "AI PROCUREMENT ADVISOR"
```

The mark is inline SVG (no asset path needed). Always render on the navy canvas or a dark surface — the gradient and glow are tuned for dark backgrounds.
