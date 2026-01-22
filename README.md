# Bitcraft Brand

Official brand assets for Bitcraft — software development & custom applications.

<p align="center">
  <img src="logo/bitcraft-logo.svg" width="200" alt="Bitcraft Logo">
</p>

## Logo

The Bitcraft logo represents code indentation forming the letter "B" — combining the digital precision of "bit" with the artisanal quality of "craft".

### Variants

| Variant | File | Usage |
|---------|------|-------|
| **Primary** | [`bitcraft-logo.svg`](logo/bitcraft-logo.svg) | Default — works on both dark and light backgrounds |
| **Single Color** | [`bitcraft-logo-single-color.svg`](logo/bitcraft-logo-single-color.svg) | When color variation isn't possible |
| **Mono White** | [`bitcraft-logo-mono-white.svg`](logo/bitcraft-logo-mono-white.svg) | Dark backgrounds, grayscale contexts |
| **Mono Black** | [`bitcraft-logo-mono-black.svg`](logo/bitcraft-logo-mono-black.svg) | Light backgrounds, grayscale contexts |

### Exports

Pre-rendered PNG exports: [`logo/exports/png/`](logo/exports/png/) (512, 256, 128, 64px)

Favicon files: [`logo/exports/favicon/`](logo/exports/favicon/) (ico, 32px, 16px)

Open Graph image: [`logo/exports/og-images/bitcraft-og.png`](logo/exports/og-images/bitcraft-og.png) (1200×630px for social sharing)

## Colors

### Primary Palette

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Dark Olive** | `#556B2F` | `rgb(85, 107, 47)` | Primary, bars 1/3/5 |
| **Olive Drab** | `#6B8E23` | `rgb(107, 142, 35)` | Secondary, bar 2 |
| **Forest Green** | `#228B22` | `rgb(34, 139, 34)` | Accent, bar 4 |

### Neutrals

| Color | Hex | Usage |
|-------|-----|-------|
| **Near Black** | `#1A1A1A` | Dark backgrounds, text |
| **Off White** | `#F5F5F5` | Light backgrounds |
| **White** | `#FFFFFF` | Pure backgrounds |

## Typography

| Purpose | Font | Weight |
|---------|------|--------|
| Headings | Inter | 600 |
| Body | Inter | 400 |
| Code | JetBrains Mono | 400 |

## Website Bundle

This repo can generate a website-ready bundle (favicons, Open Graph images, and tokens) meant to be copied into a website's `public/` directory.

### Build

```sh
npm run build
```

This generates a `bundle/` directory (not committed).

### Consume

Copy `bundle/*` into your website `public/` directory.

Outputs:

- Root (favicon expectations):
  - `favicon.ico`
  - `favicon-16x16.png`
  - `favicon-32x32.png`
  - `apple-touch-icon.png`
  - `android-chrome-192x192.png`
  - `android-chrome-512x512.png`
  - `site.webmanifest`
- Namespaced (to avoid root clutter):
  - `brand/tokens.css`
  - `brand/og/bitcraft-og.png`

### CI

GitHub Actions uploads the generated `bundle/` directory as an artifact named `brand-bundle`.

### Release

To create a new release bundle:

1.  Create a new Release in GitHub.
2.  Tag it with a semantic version (e.g., `v1.2.0`).
3.  GitHub Actions will automatically build the bundle and upload a `bitcraft-brand-bundle-v1.2.0.zip` to the release assets.

## Usage Guidelines

### ✓ Do

- Maintain clear space around the logo
- Use provided color combinations
- Scale proportionally

### ✗ Don't

- Stretch or distort
- Apply gradients or effects
- Use below 24px height

## Files

```
brand/
├── logo/
│   ├── bitcraft-logo.svg
│   ├── bitcraft-logo-single-color.svg
│   ├── bitcraft-logo-mono-white.svg
│   ├── bitcraft-logo-mono-black.svg
│   ├── og-images/
│   │   └── og-default.svg
│   └── exports/
│       ├── png/
│       ├── favicon/
│       └── og-images/
├── colors/
│   └── palette.md
├── typography/
│   └── fonts.md
├── templates/
│   └── email-signature.html
└── brandbook/
    └── bitcraft-brandbook.html
```

---

© 2026 Bitcraft Apps
