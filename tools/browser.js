// Shared helper for the test tools: launches a headless browser on the game.
// Needs Playwright (npm i -D playwright && npx playwright install chromium).
// Set CHROME_PATH to use an installed Chrome instead of Playwright's own browser.
const path = require('path');
let pw;
try { pw = require('playwright'); } catch (e) {
  try { pw = require('/opt/node22/lib/node_modules/playwright'); } catch (e2) {
    console.error('Playwright not found. Run: npm install && npx playwright install chromium'); process.exit(1);
  }
}
const GAME = 'file://' + path.resolve(__dirname, '..', 'index.html');
async function launch() {
  const opts = { args: ['--no-sandbox'] };
  if (process.env.CHROME_PATH) opts.executablePath = process.env.CHROME_PATH;
  return pw.chromium.launch(opts);
}
module.exports = { launch, GAME, OUT: path.resolve(__dirname, '..', 'previews') };
