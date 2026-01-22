const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico').default;

const logoDir = path.join(__dirname, '..', 'logo');
const exportDir = path.join(logoDir, 'exports');
const pngDir = path.join(exportDir, 'png');
const faviconDir = path.join(exportDir, 'favicon');
const ogDir = path.join(exportDir, 'og-images');

// Source SVGs
const logoSvg = path.join(logoDir, 'bitcraft-logo-padded.svg');
const ogSvg = path.join(logoDir, 'og-images', 'og-default.svg');

// Core Logotypes & Lockups
const coreSvgs = [
  'bitcraft-logotype.svg',
  'bitcraft-logotype-white.svg',
  'bitcraft-logotype-black.svg',
  'bitcraft-lockup-horizontal.svg',
  'bitcraft-lockup-horizontal-white.svg',
  'bitcraft-lockup-horizontal-black.svg',
];

// Export sizes
const logoSizes = [64, 128, 256, 512, 1024];
const faviconSizes = [16, 32, 48];
const coreHeights = [128, 256];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function exportLogos() {
  console.log('Exporting logo PNGs...');
  await ensureDir(pngDir);

  // 1. Export square logos
  for (const size of logoSizes) {
    const pngName = `logo-${size}.png`;
    const pngPath = path.join(pngDir, pngName);

    try {
      await sharp(logoSvg)
        .resize(size, size)
        .png()
        .toFile(pngPath);

      console.log(`  Created: ${pngName}`);
    } catch (err) {
      console.error(`  Error creating ${pngName}:`, err.message);
    }
  }

  // 2. Export core logotypes & lockups
  console.log('Exporting logotypes & lockups...');
  for (const svgFile of coreSvgs) {
    const svgPath = path.join(logoDir, svgFile);

    if (!fs.existsSync(svgPath)) {
      console.error(`  Error: Skipping ${svgFile} - file not found`);
      process.exit(1);
    }

    const baseName = svgFile.replace('.svg', '');

    for (const height of coreHeights) {
      const pngName = `${baseName}-${height}h.png`;
      const pngPath = path.join(pngDir, pngName);

      try {
        await sharp(svgPath)
          .resize({ height: height })
          .png()
          .toFile(pngPath);

        console.log(`  Created: ${pngName}`);
      } catch (err) {
        console.error(`  Error creating ${pngName}:`, err.message);
      }
    }
  }
}

async function exportFavicons() {
  console.log('Exporting favicons...');
  await ensureDir(faviconDir);

  const faviconPaths = [];

  for (const size of faviconSizes) {
    const pngName = `favicon-${size}.png`;
    const pngPath = path.join(faviconDir, pngName);

    try {
      await sharp(logoSvg)
        .resize(size, size)
        .png()
        .toFile(pngPath);

      console.log(`  Created: ${pngName}`);
      faviconPaths.push(pngPath);
    } catch (err) {
      console.error(`  Error creating ${pngName}:`, err.message);
    }
  }

  // Bundle into .ico
  try {
    const icoPath = path.join(faviconDir, 'favicon.ico');
    const icoBuffer = await pngToIco(faviconPaths);
    fs.writeFileSync(icoPath, icoBuffer);
    console.log('  Created: favicon.ico');
  } catch (err) {
    console.error('  Error creating favicon.ico:', err.message);
  }
}

async function exportOgImages() {
  console.log('Exporting OG images...');
  await ensureDir(ogDir);

  if (!fs.existsSync(ogSvg)) {
    console.error(`  Source OG SVG not found: ${ogSvg}`);
    process.exit(1);
  }

  const pngName = 'bitcraft-og.png';
  const pngPath = path.join(ogDir, pngName);

  try {
    await sharp(ogSvg)
      .png()
      .toFile(pngPath);
    console.log(`  Created: ${pngName}`);
  } catch (err) {
    console.error(`  Error creating ${pngName}:`, err.message);
  }
}

async function main() {
  if (!fs.existsSync(logoSvg)) {
    console.error(`Source SVG not found: ${logoSvg}`);
    process.exit(1);
  }

  await exportLogos();
  await exportFavicons();
  await exportOgImages();

  console.log('\nExport complete!');
}

main();
