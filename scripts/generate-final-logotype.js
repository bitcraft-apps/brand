const TextToSVG = require('text-to-svg');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, 'fonts', 'Poppins.ttf');
const outputDir = path.join(__dirname, '..', 'logo');

const textToSVG = TextToSVG.loadSync(fontPath);

// Generate "itcraft" path
const fontSize = 48;
const options = {
  x: 0,
  y: 0,
  fontSize: fontSize,
  anchor: 'left top',
};

const itcraftPath = textToSVG.getD('itcraft', options);
const itcraftMetrics = textToSVG.getMetrics('itcraft', options);

// Parse path to find actual bounding box (not font metrics)
function getPathBounds(pathD) {
  const coords = pathD.match(/[-]?\d+\.?\d*/g).map(Number);
  let minY = Infinity, maxY = -Infinity;
  let minX = Infinity, maxX = -Infinity;

  // Simple parsing - get all numeric values and find bounds
  // Path format uses pairs of x,y coordinates
  for (let i = 0; i < coords.length; i += 2) {
    if (i + 1 < coords.length) {
      const x = coords[i];
      const y = coords[i + 1];
      if (!isNaN(x)) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
      if (!isNaN(y)) {
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

const itcraftBounds = getPathBounds(itcraftPath);
console.log('itcraft actual bounds:', itcraftBounds);

// Logomark dimensions
const logomarkHeight = 48; // 39.8 + 8.2 = 48
const logomarkWidth = 45.2; // max x extent (8.2 + 37)
const gap = 2; // tight spacing

// Logomark SVG content (the "B")
const logomarkPaths = `
    <rect x="0" y="0" width="31.5" height="8.2" rx="4.1"/>
    <rect x="8.2" y="10.3" width="30.2" height="8.2" rx="4.1"/>
    <rect x="0" y="20.6" width="24.7" height="6.9" rx="3.4"/>
    <rect x="8.2" y="29.5" width="37" height="8.2" rx="4.1"/>
    <rect x="0" y="39.8" width="34.3" height="8.2" rx="4.1"/>`;

// Calculate dimensions for horizontal lockup
const textOffsetX = logomarkWidth + gap;

// Vertically center the text with the logomark using actual bounds
// Text needs to be shifted so its visual center aligns with logomark center
const textVisibleHeight = itcraftBounds.maxY - itcraftBounds.minY;
const textOffsetY = (logomarkHeight - textVisibleHeight) / 2 - itcraftBounds.minY;

// Calculate total dimensions based on actual content
const totalWidth = Math.ceil(textOffsetX + itcraftBounds.maxX);
const totalHeight = logomarkHeight; // Use logomark height as reference

console.log('Horizontal lockup dimensions:', totalWidth, 'x', totalHeight);

const colors = [
  { name: '', fill: '#556B2F', desc: 'Dark Olive' },
  { name: '-white', fill: '#FFFFFF', desc: 'White (for dark backgrounds)' },
  { name: '-black', fill: '#000000', desc: 'Black (for light backgrounds)' },
];

// Generate horizontal lockup SVGs (logomark B + itcraft)
colors.forEach(color => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  <!--
    Bitcraft Lockup Horizontal - ${color.desc}
    https://github.com/bitcraft-apps/brand
    Logomark + "itcraft" in Poppins SemiBold
  -->
  <g fill="${color.fill}">
    <!-- Logomark (B) -->
    <g>${logomarkPaths}
    </g>
    <!-- itcraft text -->
    <g transform="translate(${textOffsetX}, ${textOffsetY})">
      <path d="${itcraftPath}"/>
    </g>
  </g>
</svg>`;

  const filename = `bitcraft-lockup-horizontal${color.name}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Created: ${filename}`);
});

// Generate logotype-only SVGs (full "Bitcraft" wordmark)
const fullPath = textToSVG.getD('Bitcraft', options);
const fullBounds = getPathBounds(fullPath);
console.log('Bitcraft actual bounds:', fullBounds);

const logotypeWidth = Math.ceil(fullBounds.maxX - fullBounds.minX);
const logotypeHeight = Math.ceil(fullBounds.maxY - fullBounds.minY);

// Shift path to start at 0,0
const logotypeOffsetX = -fullBounds.minX;
const logotypeOffsetY = -fullBounds.minY;

console.log('Logotype dimensions:', logotypeWidth, 'x', logotypeHeight);

colors.forEach(color => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logotypeWidth} ${logotypeHeight}" width="${logotypeWidth}" height="${logotypeHeight}">
  <!--
    Bitcraft Logotype - ${color.desc}
    https://github.com/bitcraft-apps/brand
    "Bitcraft" in Poppins SemiBold (text converted to paths)
  -->
  <g transform="translate(${logotypeOffsetX}, ${logotypeOffsetY})">
    <path fill="${color.fill}" d="${fullPath}"/>
  </g>
</svg>`;

  const filename = `bitcraft-logotype${color.name}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Created: ${filename}`);
});

console.log('\n✓ All SVG files generated successfully!');
console.log(`\nFiles created in: ${outputDir}`);
console.log('\nHorizontal lockup: logomark "B" + "itcraft"');
console.log('Logotype: full "Bitcraft" wordmark');
