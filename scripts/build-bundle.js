const sharp = require('sharp');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const pngToIco = require('png-to-ico').default;

const rootDir = path.join(__dirname, '..');

const bundleDir = path.join(rootDir, 'bundle');
const brandDir = path.join(bundleDir, 'brand');

const logoDir = path.join(rootDir, 'logo');

const faviconSourceSvg = path.join(logoDir, 'bitcraft-logo-padded.svg');
const ogSourceSvg = path.join(logoDir, 'og-images', 'og-default.svg');

const faviconPngOutputs = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-48x48.png', size: 48 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-512x512.png', size: 512 },
];

function assertFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
}

async function rmAndRecreateDir(dir) {
  await fsp.rm(dir, { recursive: true, force: true });
  await fsp.mkdir(dir, { recursive: true });
}

async function writeJson(filePath, data) {
  await fsp.writeFile(filePath, JSON.stringify(data, null, 2) + '\n');
}

async function exportFavicons(themeColor) {
  console.log('Generating favicons...');
  assertFileExists(faviconSourceSvg);

  const manifest = {
    name: 'Bitcraft',
    short_name: 'Bitcraft',
    icons: [
      {
        src: 'android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: themeColor,
    background_color: '#FFFFFF',
    display: 'standalone',
  };

  const icoInputs = [];

  for (const output of faviconPngOutputs) {
    const outputPath = path.join(bundleDir, output.file);

    await sharp(faviconSourceSvg)
      .resize(output.size, output.size)
      .png()
      .toFile(outputPath);

    if (output.size === 16 || output.size === 32 || output.size === 48) {
      icoInputs.push(outputPath);
    }
  }

  // 1. Generate ICO from small PNGs
  const icoBuffer = await pngToIco(icoInputs);
  const icoPath = path.join(bundleDir, 'favicon.ico');
  await fsp.writeFile(icoPath, icoBuffer);
  console.log(`  Created: ${path.relative(rootDir, icoPath)}`);

  // 2. Generate site.webmanifest
  const manifestPath = path.join(bundleDir, 'site.webmanifest');
  await writeJson(manifestPath, manifest);
  console.log(`  Created: ${path.relative(rootDir, manifestPath)}`);

  // 3. Move other PNGs to brand/ subdirectory?
  // The user requested:
  // "standard files like favicons, android and apple images, site manifest etc. are placed in final zip in main directory"
  // "all other files, like og images, css files, logos land in /brand/ directory"

  // Currently:
  // bundle/
  //   favicon-16x16.png
  //   favicon-32x32.png
  //   favicon-48x48.png
  //   apple-touch-icon.png
  //   android-chrome-192x192.png
  //   android-chrome-512x512.png
  //   favicon.ico
  //   site.webmanifest
  //   brand/
  //     bitcraft-og.png
  //     tokens.css

  // This matches the request. The standard web files are in the root of the bundle,
  // and specific brand assets are in the brand/ subdirectory.
}

async function exportOgImages() {
  console.log('Generating OG images...');
  assertFileExists(ogSourceSvg);

  await fsp.mkdir(brandDir, { recursive: true });

  const outPath = path.join(brandDir, 'bitcraft-og.png');
  await sharp(ogSourceSvg).png().toFile(outPath);
  console.log(`  Created: ${path.relative(rootDir, outPath)}`);
}

function extractHexColor(markdown, name) {
  const headingRegex = new RegExp(`^###\\s+${name}\\s*$`, 'mi');
  const match = markdown.match(headingRegex);

  if (!match) {
    throw new Error(
      `Color section "### ${name}" not found in colors/palette.md`
    );
  }

  // Search in the content after the header until the next header or end of string
  const contentAfterHeader = markdown.slice(match.index + match[0].length);
  const nextHeaderIndex = contentAfterHeader.search(/^#/m);
  const sectionContent = nextHeaderIndex === -1 
    ? contentAfterHeader 
    : contentAfterHeader.slice(0, nextHeaderIndex);

  // Look for a hex code in the section content
  const hexMatch = sectionContent.match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/);

  if (!hexMatch) {
    throw new Error(
      `No HEX color found in section "### ${name}" in colors/palette.md`
    );
  }

  return hexMatch[0].toUpperCase();
}

function getRequiredScale(scale, requiredKeys, sourceLabel) {
  const missing = requiredKeys.filter((key) => !scale[key]);
  if (missing.length > 0) {
    throw new Error(
      `Typography scale missing keys: ${missing.join(', ')} (expected from ${sourceLabel})`
    );
  }

  return scale;
}

function parseTypographyScale(markdown) {
  const lines = markdown.split(/\r?\n/);
  const scaleStartIndex = lines.findIndex((line) => line.trim() === '## Scale');
  if (scaleStartIndex === -1) {
    throw new Error('Could not find "## Scale" in typography/fonts.md');
  }

  const tableLines = lines
    .slice(scaleStartIndex + 1)
    .filter((line) => line.trim().startsWith('|'))
    .map((line) => line.trim());

  if (tableLines.length < 3) {
    throw new Error('Typography scale table not found or incomplete');
  }

  const rows = tableLines
    .slice(2)
    .map((line) => line.split('|').map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 3);

  const byKey = {};
  for (const cells of rows) {
    const element = cells[0];
    const size = cells[1];
    const weight = cells[2];

    const key = element.toLowerCase();
    byKey[key] = { size, weight };
  }

  return byKey;
}

function parseFonts(markdown) {
  function readVar(varName) {
    const match = markdown.match(new RegExp(`--${varName}:\\s*([^;\n}]+)`, 'm'));
    if (!match) {
      throw new Error(`Could not find --${varName} in typography/fonts.md`);
    }

    return match[1].trim().replace(/;$/, '').trim();
  }

  return {
    sans: readVar('font-sans'),
    mono: readVar('font-mono'),
  };
}

async function exportTokens() {
  console.log('Generating tokens.css...');

  const palettePath = path.join(rootDir, 'colors', 'palette.md');
  const fontsPath = path.join(rootDir, 'typography', 'fonts.md');

  const paletteMd = await fsp.readFile(palettePath, 'utf8');
  const fontsMd = await fsp.readFile(fontsPath, 'utf8');

  const colors = {
    darkOlive: extractHexColor(paletteMd, 'Dark Olive'),
    oliveDrab: extractHexColor(paletteMd, 'Olive Drab'),
    forestGreen: extractHexColor(paletteMd, 'Forest Green'),
    nearBlack: extractHexColor(paletteMd, 'Near Black'),
    offWhite: extractHexColor(paletteMd, 'Off White'),
    white: extractHexColor(paletteMd, 'White'),
  };

  const fontStacks = parseFonts(fontsMd);
  const scale = getRequiredScale(
    parseTypographyScale(fontsMd),
    ['h1', 'h2', 'h3', 'body', 'small'],
    'typography/fonts.md # Scale'
  );

  const tokensCss = `:root {
  /* Brand primitives */
  --bitcraft-color-dark-olive: ${colors.darkOlive};
  --bitcraft-color-olive-drab: ${colors.oliveDrab};
  --bitcraft-color-forest-green: ${colors.forestGreen};

  --bitcraft-color-neutral-near-black: ${colors.nearBlack};
  --bitcraft-color-neutral-off-white: ${colors.offWhite};
  --bitcraft-color-neutral-white: ${colors.white};

  --bitcraft-font-sans: ${fontStacks.sans};
  --bitcraft-font-mono: ${fontStacks.mono};

  --bitcraft-text-h1-size: ${scale.h1.size};
  --bitcraft-text-h1-weight: ${scale.h1.weight};
  --bitcraft-text-h2-size: ${scale.h2.size};
  --bitcraft-text-h2-weight: ${scale.h2.weight};
  --bitcraft-text-h3-size: ${scale.h3.size};
  --bitcraft-text-h3-weight: ${scale.h3.weight};
  --bitcraft-text-body-size: ${scale.body.size};
  --bitcraft-text-body-weight: ${scale.body.weight};
  --bitcraft-text-small-size: ${scale.small.size};
  --bitcraft-text-small-weight: ${scale.small.weight};

  /* Semantic aliases */
  --color-brand-primary: var(--bitcraft-color-dark-olive);
  --color-brand-secondary: var(--bitcraft-color-olive-drab);
  --color-brand-accent: var(--bitcraft-color-forest-green);

  --color-text: var(--bitcraft-color-neutral-near-black);
  --color-bg: var(--bitcraft-color-neutral-white);
  --color-surface: var(--bitcraft-color-neutral-off-white);

  --font-sans: var(--bitcraft-font-sans);
  --font-mono: var(--bitcraft-font-mono);

  --text-h1-size: var(--bitcraft-text-h1-size);
  --text-h1-weight: var(--bitcraft-text-h1-weight);
  --text-h2-size: var(--bitcraft-text-h2-size);
  --text-h2-weight: var(--bitcraft-text-h2-weight);
  --text-h3-size: var(--bitcraft-text-h3-size);
  --text-h3-weight: var(--bitcraft-text-h3-weight);
  --text-body-size: var(--bitcraft-text-body-size);
  --text-body-weight: var(--bitcraft-text-body-weight);
  --text-small-size: var(--bitcraft-text-small-size);
  --text-small-weight: var(--bitcraft-text-small-weight);
}
`;

  await fsp.mkdir(brandDir, { recursive: true });
  const tokensOutPath = path.join(brandDir, 'tokens.css');
  await fsp.writeFile(tokensOutPath, tokensCss);
  console.log(`  Created: ${path.relative(rootDir, tokensOutPath)}`);
}

async function copyLogos() {
  console.log('Copying logo SVGs...');

  // Core logo variants for website use (full-color + mono variants for light/dark backgrounds).
  // Additional variants in logo/ (padded, single-color, lockups) are for other contexts.
  const logos = [
    'bitcraft-logo.svg',
    'bitcraft-logo-mono-white.svg',
    'bitcraft-logo-mono-black.svg',
  ];

  for (const logo of logos) {
    const src = path.join(logoDir, logo);
    const dest = path.join(brandDir, logo);
    assertFileExists(src);
    await fsp.copyFile(src, dest);
    console.log(`  Copied: ${path.relative(rootDir, dest)}`);
  }
}

// Moved main to bottom to allow for extracting color
async function getThemeColor() {
  const palettePath = path.join(rootDir, 'colors', 'palette.md');
  const paletteMd = await fsp.readFile(palettePath, 'utf8');
  return extractHexColor(paletteMd, 'Dark Olive');
}

async function main() {
  await rmAndRecreateDir(bundleDir);

  const themeColor = await getThemeColor();
  await exportFavicons(themeColor);
  await exportOgImages();
  await exportTokens();
  await copyLogos();

  console.log('\nBundle build complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
