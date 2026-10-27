/**
 * Ednivo Link and Asset Verification Test
 * Run: node test-links.js
 */
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

let totalChecked = 0;
let errors = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const matches = [...content.matchAll(/(?:href|src)=["']([^"']+)["']/g)];

  matches.forEach(m => {
    const val = m[1].trim();
    if (
      val.startsWith('http://') ||
      val.startsWith('https://') ||
      val.startsWith('#') ||
      val.startsWith('mailto:') ||
      val.startsWith('tel:') ||
      val.startsWith('javascript:') ||
      val.startsWith('data:') ||
      val.includes('${')
    ) {
      return;
    }

    const cleanVal = val.split('?')[0].split('#')[0];
    if (!cleanVal) return;

    totalChecked++;
    const targetPath = path.join(rootDir, cleanVal);
    if (!fs.existsSync(targetPath)) {
      errors.push(`${file} -> ${val}`);
    }
  });
});

console.log(`\n========================================`);
console.log(`EDNIVO INTEGRITY AUDIT TEST`);
console.log(`Files inspected: ${htmlFiles.length} HTML files`);
console.log(`Total internal references checked: ${totalChecked}`);
if (errors.length === 0) {
  console.log(`STATUS: PASSED (0 broken links or missing assets)`);
  console.log(`========================================\n`);
  process.exit(0);
} else {
  console.error(`STATUS: FAILED (${errors.length} broken links found):`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.log(`========================================\n`);
  process.exit(1);
}
