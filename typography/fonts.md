# Bitcraft Typography

## Primary: Inter

Clean, modern, highly legible.

**Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold)

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

## Monospace: JetBrains Mono

For code and technical content.

**Weights:** 400 (Regular)

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet">
```

## CSS Setup

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

body {
  font-family: var(--font-sans);
}

code, pre {
  font-family: var(--font-mono);
}
```

## Scale

| Element | Size | Weight |
|---------|------|--------|
| H1 | 2.5rem | 600 |
| H2 | 2rem | 600 |
| H3 | 1.5rem | 600 |
| Body | 1rem | 400 |
| Small | 0.875rem | 400 |
