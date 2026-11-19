// Renders every piece of art onto one preview page: previews/art-sheet.html (+ .png if a browser is available).
// Usage: node tools/art-sheet.js
const fs = require('fs'), path = require('path');
global.window = {}; require(path.resolve(__dirname, '..', 'art.js'));
const OUT = path.resolve(__dirname, '..', 'previews'); fs.mkdirSync(OUT, { recursive: true });
const cells = window.ART_KEYS.map(k => `<div style="display:inline-block;width:150px;text-align:center;margin:6px;font:13px sans-serif;color:#ccc"><div style="width:140px;height:140px;margin:auto;background:#2a2540;border-radius:12px">${window.art(k)}</div>${k}</div>`).join('');
const html = `<html><body style="background:#1d1a2b;margin:10px;width:1150px">${window.ART_DEFS}<style>.ic{width:140px;height:140px}</style>${cells}</body></html>`;
fs.writeFileSync(OUT + '/art-sheet.html', html);
console.log('Wrote previews/art-sheet.html');
try {
  const { launch } = require('./browser');
  (async () => { const b = await launch(); const p = await b.newPage({ viewport: { width: 1170, height: 1200 } });
    await p.goto('file://' + OUT + '/art-sheet.html'); await p.screenshot({ path: OUT + '/art-sheet.png', fullPage: true }); await b.close(); console.log('Wrote previews/art-sheet.png'); })();
} catch (e) {}
