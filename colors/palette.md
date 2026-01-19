# Bitcraft Color Palette

## Primary Colors

### Dark Olive
| Format | Value |
|--------|-------|
| HEX | `#556B2F` |
| RGB | `85, 107, 47` |
| HSL | `80°, 39%, 30%` |

### Olive Drab
| Format | Value |
|--------|-------|
| HEX | `#6B8E23` |
| RGB | `107, 142, 35` |
| HSL | `80°, 60%, 35%` |

### Forest Green
| Format | Value |
|--------|-------|
| HEX | `#228B22` |
| RGB | `34, 139, 34` |
| HSL | `120°, 61%, 34%` |

## Neutrals

### Near Black
`#1A1A1A` · `rgb(26, 26, 26)`

### Off White
`#F5F5F5` · `rgb(245, 245, 245)`

### White
`#FFFFFF` · `rgb(255, 255, 255)`

## CSS Variables

```css
:root {
  --bitcraft-dark-olive: #556B2F;
  --bitcraft-olive: #6B8E23;
  --bitcraft-forest: #228B22;
  --bitcraft-black: #1A1A1A;
  --bitcraft-white: #F5F5F5;
}
```

## Tailwind Config

```js
colors: {
  bitcraft: {
    'dark-olive': '#556B2F',
    'olive': '#6B8E23',
    'forest': '#228B22',
    'black': '#1A1A1A',
  }
}
```

## Accessibility

### Contrast Ratios (against white #FFFFFF)

| Color | Ratio | WCAG AA (normal) | WCAG AA (large) |
|-------|-------|------------------|-----------------|
| Dark Olive #556B2F | 5.4:1 | ✓ Pass | ✓ Pass |
| Olive Drab #6B8E23 | 3.8:1 | ✗ Fail | ✓ Pass |
| Forest Green #228B22 | 4.0:1 | ✗ Fail | ✓ Pass |
| Near Black #1A1A1A | 16.1:1 | ✓ Pass | ✓ Pass |

### Recommendations

- Use **Dark Olive** or **Near Black** for body text
- Olive Drab and Forest Green are safe for large text (18px+) or UI elements
- For small text on white backgrounds, prefer Dark Olive over lighter greens
