# Grave Acres — art guide

Every picture in the game is original, hand-drawn SVG kept in `art.js`. There are no image files
for game art, so the game stays tiny, sharp at any size, and works offline.

## Style rules
- **Grid:** every drawing sits on a 64 × 64 canvas (`viewBox="0 0 64 64"`), centered, with a little breathing room.
- **Outlines:** main shapes get a dark outline (`#1b1626`). Use the `O` (1.8 wide) or `O2` (1.2 wide) shortcuts.
- **Shading:** fill shapes with the shared gradients (`url(#ga-...)`) so light comes from the top-left.
- **Highlights:** add a soft white `shine()` on round surfaces, and a `shadow()` under things that sit on the ground.
- **Faces:** big readable eyes (use `eye()` or `dot()`), simple mouths, optional `blush()`. They must still read at about 50 px wide on a phone.
- **Tone:** spooky but PG. Silly-creepy, never gory.
- **Originality:** design your own characters. Don't copy or imitate characters from other games, films or brands.

## Palette
| Use | Colors |
|---|---|
| Night background | `#1d1a2b`, panels `#2a2540` |
| Outline | `#1b1626` |
| Zombie skins | green `ga-zg`, teal `ga-zt`, blue-gray `ga-zb`, pale lavender `ga-vp`, bandage `ga-mu` |
| Human skin | `ga-sk` |
| Plants | leaf `ga-lf` / `ga-lf2`, dirt `ga-dt` |
| Crops | ghost white `ga-gh`, corn purple `ga-cn`, pumpkin `ga-or` / `ga-or2`, plum `ga-pu`, mushroom cap `ga-mr`, cream `ga-st` |
| Materials | gold `ga-gd`, metal `ga-mt` / `ga-mtv`, wood `ga-wd`, stone `ga-ts`, cloth `ga-bl` `ga-rd` `ga-gr` `ga-br` `ga-pk`, cape `ga-cp` |
| Glows | `ga-glow` (ghostly), `ga-eyeY` (yellow eyes), `ga-eyeG` (green eyes), `ga-fire` (flame), `ga-orb` (magic) |

## Graveyard pieces
`stone0`–`stone3` are the headstones (drawn standing on the bottom edge of the canvas so they sit on the dirt), `dirt` is a zombie seed stirring, `weeds` covers locked plots, and `fence`, `gate`, `tree` and `lamp` are the scenery. `fence` is used as a repeating background, so it uses flat colors (no shared gradients) and its rails run edge to edge.

## Adding or editing a drawing
1. Open `art.js` and find the `ART` object. Each entry is `key: \`...svg shapes...\``.
2. Add or edit shapes. Reuse helpers: `shadow()`, `shine()`, `eye()`, `dot()`, `blush()`, `bust()` (shoulders), `neck()`, `frond()` (feathery leaves).
3. Run `npm run art` and open `previews/art-sheet.png` to check it at large size, and in the game at small size.
4. If a new crop or zombie needs it, the art key must match the seed `id` in `game.js`.
5. Bump the `?v=` version (see `CLAUDE.md`) and push.

## Editing in Inkscape (free)
1. Run `npm run art`, open `previews/art-sheet.html` in a browser, right-click a drawing and copy it, or copy the SVG out of `art.js` into a file wrapped in
   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">…</svg>` (include `ART_DEFS` gradients if colors look missing).
2. Edit in Inkscape, then use **Edit → XML Editor** to copy the shapes back into `art.js`.
3. Keep the 64 × 64 canvas and the outline and shading style above.

## App icon
`npm run icons` builds `previews/icon.svg` (zombie hand and tombstone under a crescent moon) and the PNG icons from the current art.
