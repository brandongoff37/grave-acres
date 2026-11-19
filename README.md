# Grave Acres

Grow spooky crops, raise a zombie horde, and raid the towns next door, but watch out: they fight back.

**▶ Play:** https://brandongoff37.github.io/grave-acres/

An original game by Brandon. It's a web app you can install on Android and iPhone, and it works offline.

## Install on your phone
- **iPhone/iPad (Safari):** open the link → **Share** → **Add to Home Screen**
- **Android (Chrome):** open the link → **⋮** → **Install app**

Your farm is saved on each device. Use **⚙️ Menu → Copy save code** to move it to another phone.

## Project layout
```
index.html        page layout + styles
game.js           game logic
art.js            all game art (hand-drawn SVG)
sw.js             offline support
manifest.json     install info; icon-*.png app icons
tools/            playtest, balance simulator, art preview, icon builder
docs/DESIGN.md    rules, numbers, balance targets
docs/ART-GUIDE.md art style and how to edit drawings
CLAUDE.md         guide for Claude when working on this project
CHANGELOG.md      history
```

## Working on it
No build step: edit the files and open `index.html`, or run a local server.

```
npm install
npx playwright install chromium
npm run serve     # http://localhost:8080
npm test          # phone-sized play-through, prints PASS/FAIL
npm run balance   # battle win-rate simulator
npm run art       # preview sheet of every drawing
```

Pushing to `main` publishes to GitHub Pages in about a minute. Bump the `?v=` versions first (see `CLAUDE.md`).
