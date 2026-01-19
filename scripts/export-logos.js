const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico').default;

const logoDir = path.join(__dirname, '..', 'logo');
const exportDir = path.join(logoDir, 'exports');
const pngDir = path.join(exportDir, 'png');
const faviconDir = path.join(exportDir, 'favicon');

// Source SVG (padded version for better rendering at small sizes)
const logoSvg = path.join(logoDir, 'bitcraft-logo-padded.svg');

// Export sizes
const logoSizes = [64, 128, 256, 512, 1024];
const faviconSizes = [16, 32, 48];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function exportLogos() {
  console.log('Exporting logo PNGs...');
  await ensureDir(pngDir);

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

async function main() {
  if (!fs.existsSync(logoSvg)) {
    console.error(`Source SVG not found: ${logoSvg}`);
    process.exit(1);
  }

  await exportLogos();
  await exportFavicons();

  console.log('\nExport complete!');
}

main();
