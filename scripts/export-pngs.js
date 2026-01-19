const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoDir = path.join(__dirname, '..', 'logo');

// SVG files to convert
const svgFiles = [
  'bitcraft-logotype.svg',
  'bitcraft-logotype-white.svg',
  'bitcraft-logotype-black.svg',
  'bitcraft-lockup-horizontal.svg',
  'bitcraft-lockup-horizontal-white.svg',
  'bitcraft-lockup-horizontal-black.svg',
];

// Export sizes (height in pixels)
const heights = [128, 256];

async function exportPngs() {
  for (const svgFile of svgFiles) {
    const svgPath = path.join(logoDir, svgFile);

    if (!fs.existsSync(svgPath)) {
      console.log(`Skipping ${svgFile} - file not found`);
      continue;
    }

    const baseName = svgFile.replace('.svg', '');

    for (const height of heights) {
      const pngName = `${baseName}-${height}h.png`;
      const pngPath = path.join(logoDir, pngName);

      try {
        await sharp(svgPath)
          .resize({ height: height })
          .png()
          .toFile(pngPath);

        console.log(`Created: ${pngName}`);
      } catch (err) {
        console.error(`Error creating ${pngName}:`, err.message);
      }
    }
  }

  console.log('\nPNG export complete!');
}

exportPngs();
