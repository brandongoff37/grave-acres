# Changelog

## v11 — Title screen, music and volume controls
- **Title screen:** the game now opens on a start menu with the Grave Acres logo, a Play (or Continue) button, Sound settings and How to play. You can get back to it from the menu.
- **Background music:** "Midnight at Grave Acres", an original slow, ominous organ piece in the style of old pipe-organ music: a deep held bass note, held chords, and a creeping tune with quick flicks and a long tumbling run, echoing like a stone hall, over a slow heartbeat. It is made by the phone's own sound chip, so there is no music file to download and it works offline. It starts when you tap Play and pauses when you leave the game.
- **Volume controls:** separate sliders for music and sound effects, plus one button that mutes everything. They are on the title screen and in the menu, and your choices are remembered.
- The **Farm** tab is now called **Harvest**.
- **App icon:** the zombie hand now has four fingers and a thumb (it had three fingers). The same hand is used in the game. If the game is already on your home screen, remove it and add it again to see the new icon.

## v10 — The graveyard
- **The farm is now a graveyard.** Each plot is a grave: a bed of dirt with its own headstone (four designs). Empty plots are open graves, zombie seeds stir under the dirt with glowing eyes, and ground you haven't bought yet is overgrown with brambles (and takes less room on screen).
- **More 3D:** an iron fence and stone gate stand along the back, fences run down both sides, a dead tree with a crow creaks in the corner, lanterns flicker at the front, fog drifts just above the ground and wisps float through it. The view sways slowly so near and far things shift against each other. Headstones thump down when you plant.
- **Torch mobs are now a real fight.** If a mob arrives while you're playing, you watch your defenders fight it at the graveyard gate, with the same speed and skip buttons as a raid. If it came while the game was closed you still get the short report.
- **Battles:** every hit sends a shockwave ring across the ground (gold for critical hits) and fallen fighters are knocked into the air before they land.
- **Horde:** tapping a zombie now shows its attack, health and what its ability does, with Release as a choice instead of the only thing a tap does. Zombies cast shadows on their cards.
- Clearer messages when you can't afford a plot (it tells you how many coins you're short).
- **For developers:** `npm run bump` raises the version number in every file that needs it, `npm run check` runs every check in one go, and the playtest now fails loudly (non-zero exit) and also checks the graveyard, the mob battle, the screen fit and that version numbers match.

## v9 — 3D look and clearer play
- **Farm in 3D:** the field leans back like a game board, soil beds are raised, and crops stand up on them. New plants drop in, ripe crops hop, harvested crops jump out toward you, and coins spin up to your purse. Raised zombies fly to the Horde tab.
- **Battles in 3D:** fights play out on a tilted battlefield with the town's rooftops behind it. Attackers leap across the field, hits knock fighters back with damage numbers, fallen fighters tip over and lie flat, and the winners cheer. Critical hits shake the screen.
- **Clearer results:** a Victory or Driven off card shows loot and losses when a raid ends. Leveling up shows a gold card listing what you unlocked.
- **Easier to follow:** empty plots show a +, growing plots show a countdown and a water-drop hint, the Raid screen explains what to do when you have no zombies, and "Plant N at once" replaces the small fill-all link.
- **Battle speed button** (×1 or ×2, remembered). Skip now ends the fight instantly.
- Buttons look raised and press down. Messages no longer cover the Farm, Horde and Raid tabs.
- Players who turn on "reduce motion" on their phone keep the 3D look without the movement.

## v8 — Townsfolk abilities
- Every townsperson has a distinct ability: Farmer **Rally**, Farmhand **Hay Bale**, Guard Dog **Quick**, Constable **Whistle** (calls a Guard Dog), Sheriff **Sharpshooter**, Town Guard **Bodyguard**, Knight **Heavy Armor**, Hedge Wizard **Healer**, Scarecrow-Bot **Sweep**.
- Squad picker lists each defender's ability. Mudbury, Cobble Creek and Castle Kale rebalanced.
- Fixed the mob timer showing "NaN" right after the first win.

## v7 — Harder, deeper gameplay
- New battle engine with zombie abilities (Dasher Quick, Lugnut Tough, Wrapster Wrap, Night Count Drain).
- Choose a raid squad; squad size grows with level. Towns rebuild 20% stronger after each overrun.
- Crops wither if left too long. Torch mobs counterattack the farm.
- 14 goals with rewards, sound effects with a toggle, and save codes to move a farm between devices.
- Steeper XP curve, rarer mutants, fewer zombies crawl home.

## v4–v6 — Art polish
- Gloom Plum redrawn as an eggplant with a clearer face; Ghost Carrot got feathery leaf "hair"; Moon Corn's purple cob separated from its green husk.
- Fixed updates being held back by browser caching (versioned files, fresh service-worker installs).

## v3 — Detailed art
- Every drawing redrawn with outlines, shading, highlights and more detail; new app icon.

## v2 — Original art and quality-of-life
- All emoji replaced with original SVG art.
- Harvest all, fill all empty plots, raid odds labels, skip-to-result, daily bonus, stats menu.

## v1 — First release
- Installable web app hosted on GitHub Pages; works offline.
