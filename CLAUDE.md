# Grave Acres — project guide for Claude

Read this first. It explains what this project is, how it is built, and the rules for changing it.

## What it is
Grave Acres is Brandon's original zombie-farming game for phones. It was inspired by the
*kind* of game he played on an iPod touch around 2010–2012 (Zombie Farm by The Playforge), but
**it is an original game**: original name, characters, art and code. Don't copy names, art,
text or code from Zombie Farm or any other game, and don't draw well-known characters.

- **Play it:** https://brandongoff37.github.io/grave-acres/
- **Code:** https://github.com/brandongoff37/grave-acres (public; GitHub Pages serves `main` from the root)
- **Owner:** Brandon (GitHub `brandongoff37`). He's new to coding, so explain things in plain language
  and avoid jargon. He prefers building his own tools over paying for them. Keep his full name off anything public.

## How it's built
A Progressive Web App (PWA): plain HTML, CSS and JavaScript with no framework and no build step.
It installs to the home screen on iPhone (Safari → Share → Add to Home Screen) and Android
(Chrome → ⋮ → Install app), and works offline.

| File | What it holds |
|---|---|
| `index.html` | Page layout and all CSS. Loads `art.js` then `game.js`. |
| `game.js` | All game logic: data tables (seeds, townsfolk, towns, goals), farm, horde, battle engine, raids, torch mobs, menu, save system, title screen, and all sound and music (generated in code, no audio files). |
| `art.js` | Every picture in the game as hand-drawn inline SVG on a 64×64 grid, plus shared gradients. `art(key)` returns an `<svg>` string. |
| `sw.js` | Service worker for offline play and updates. |
| `manifest.json`, `icon-*.png`, `apple-touch-icon.png` | Install metadata and app icons. |
| `tools/` | Test and asset tools (see below). |
| `docs/DESIGN.md` | Game rules, numbers, abilities, balance targets. |
| `docs/ART-GUIDE.md` | Art style rules and how to add or edit a drawing. |
| `CHANGELOG.md` | History of changes. |

## Rules when changing things
1. **Bump versions on every release that changes `art.js` or `game.js`**, or phones keep the old copy:
   - in `index.html`: `art.js?v=N` and `game.js?v=N`
   - in `sw.js`: `CACHE = 'grave-acres-vN'` and the same `?v=N` entries in `FILES`
   `npm run bump` does all of this in one step.
   (Current: **v17**.)
2. **Never break old saves.** Saves live in `localStorage` under `graveacres.v1`. New fields go in
   `fresh()` and are filled in by `migrate()` in `game.js`. Keep seed/zombie `id`s stable
   (`radish`, `corn`, `pump`, `egg`, `mush`, `shamb`, `sprint`, `brute`, `mummy`, `vamp`).
3. **Run the checks before pushing:** `npm run check` (syntax, playtest and balance report in one go;
   all PASS, no page errors, win rates near the targets in `docs/DESIGN.md`).
4. **Art must be original** and follow `docs/ART-GUIDE.md`. Crops are spooky but PG.
5. Keep it a single static site: no build step, no server, no paid services.
   The 3D look is plain CSS (`rotateX`, `perspective`, `preserve-3d`), so don't add a 3D library.
   Phones are played in **landscape** first: the landscape layout lives in the `@media (orientation:landscape) and (max-height:600px)` block in `index.html` (tab rail on the left, graveyard 5 across in the middle, side column on the right). Portrait still has to work. `npm test` checks both.
   The farm is drawn as a graveyard (see "The graveyard" in `docs/DESIGN.md`). `#field` must hold exactly the 20 plot buttons and nothing else.
   An element with `overflow:hidden`, `opacity` below 1 or a `filter` flattens the 3D inside it, so put those on the innermost picture, not on a plot or fighter wrapper.
6. Commit with clear messages and push to `main`. The live site updates in about a minute.
   Then confirm the new `?v=` files load at the live URL.

## Tools
Requires Node.js. One-time setup: `npm install` then `npx playwright install chromium`.

| Command | What it does |
|---|---|
| `npm run serve` | Runs the game locally at http://localhost:8080 |
| `npm test` | Plays through the game on a phone-sized screen; prints PASS/FAIL; screenshots go to `previews/` |
| `npm run balance` | Simulates hundreds of battles per town and mob; prints win rates |
| `npm run art` | Renders every drawing onto `previews/art-sheet.html` / `.png` |
| `npm run bump` | Raises the version number in every file that needs it (`index.html`, `sw.js`, `package.json`, this file) |
| `npm run check` | Runs every check before a push: syntax, playtest, balance report |
| `npm run icons` | Rebuilds app icons from the art (needs `rsvg-convert`, or export `previews/icon.svg` in Inkscape) |

Set `CHROME_PATH` to use an installed Chrome instead of Playwright's browser.

## Ideas Brandon may ask for next
More crops and zombie types, seasonal events, decorations for the farm, a leaderboard
(would need a free backend), and editing the art in Inkscape.
