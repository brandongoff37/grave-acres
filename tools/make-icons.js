// Rebuilds the app icons from the game art. Needs rsvg-convert (librsvg) on your PATH,
// or open previews/icon.svg in Inkscape and export PNGs at 512, 192 and 180 px.
// Usage: node tools/make-icons.js
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
global.window = {}; require(path.resolve(__dirname, '..', 'art.js'));
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'previews'); fs.mkdirSync(OUT, { recursive: true });
const defs = window.ART_DEFS.match(/<defs>[\s\S]*<\/defs>/)[0];
const inner = k => window.art(k).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">${defs}
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e2650"/><stop offset="1" stop-color="#151122"/></linearGradient></defs>
<rect width="64" height="64" fill="url(#sky)"/><circle cx="49" cy="13" r="7" fill="#ffe27a"/><circle cx="52" cy="11" r="6.4" fill="#2b2449"/>
<circle cx="12" cy="10" r=".8" fill="#fff"/><circle cx="22" cy="6" r=".6" fill="#fff"/><circle cx="36" cy="12" r=".7" fill="#fff"/><circle cx="58" cy="28" r=".6" fill="#fff"/>
<rect y="50" width="64" height="14" fill="#3f6b35"/><g transform="translate(14 4) scale(.82)">${inner('mound')}</g><g transform="translate(-4 12) scale(.72)">${inner('hand')}</g></svg>`;
fs.writeFileSync(path.join(OUT, 'icon.svg'), svg); console.log('Wrote previews/icon.svg');
try {
  for (const [f, s] of [['icon-512.png', 512], ['icon-maskable-512.png', 512], ['icon-192.png', 192], ['apple-touch-icon.png', 180]])
    execSync(`rsvg-convert -w ${s} -h ${s} "${path.join(OUT, 'icon.svg')}" -o "${path.join(ROOT, f)}"`);
  console.log('Updated app icons');
} catch (e) { console.log('rsvg-convert not found — export previews/icon.svg manually.'); }
