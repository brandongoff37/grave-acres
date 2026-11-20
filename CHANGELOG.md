# Changelog


## v14 — made for playing sideways (2026-11-20)
- **Landscape is now the main layout on phones.** The Harvest, Horde and Raid tabs become a rail down the left side, the graveyard fills the middle, and the goal, Harvest all button and tips sit in a column on the right. Nothing needs scrolling on the Harvest screen.
- The graveyard is laid out 5 graves across and 4 deep in landscape, with wider, shallower graves and a steeper view, so it fits a short, wide screen. Its width is capped by the screen's height so the front row never falls off the bottom.
- Raid: the battlefield on the left, the play-by-play and buttons on the right. Horde and squad pickers show more zombies per row. The title screen puts the logo on the left and the menu on the right.
- The installed app now opens sideways on Android (manifest orientation is landscape). In portrait the old layout still works, and the title screen suggests turning the phone sideways.
- Playtest: new checks that the graveyard fits on two landscape phone sizes.
## v13 — the graveyard, seen from the side (2026-11-20)
- The camera now stands off to one side and lower down, so the yard reads as a real 3D patch of ground. The whole graveyard no longer sways.
- Wind instead: the dead oak bends in gusts, and wooden grave markers rock gently, each on its own beat. Stone stays still.
- Redrew the border to scale: slimmer wrought-iron fence on a stone footing, a taller stone-pillared gate with iron doors and a lantern, a bigger gnarled oak standing just outside the back corner, and tall iron lantern posts at the front corners.
- Crosses are gone from the graveyard, the title screen and the home battle backdrop. New headstones: weathered-wood versions of the two carved stones (`wood0`, `wood2`) and two gargoyles on plinths (`garg0`, `garg1`, three graves have one).
- Headstones are now slabs with a visible edge when seen from the side.

## v12 — Cleaner sound
- **Fixed static and distortion in the audio.** Three causes, all fixed:
  - The organ's lowest notes were deeper than a phone speaker can play, which makes small speakers buzz. The bass now sits an octave higher, and a filter removes anything too deep (rumble below 80 Hz went from 38% of the sound to 2%).
  - Each organ note was built from four or five separate sound sources, up to 35 starting at the same instant, which can make a phone stutter and crackle. Each note is now a single source with the organ tone built in.
  - Sound effects and the heartbeat started and stopped instantly, which makes a tiny click each time. They now fade in and out over a few thousandths of a second.
- A limiter on the final output stops music and sound effects from overloading when they play together, and the volume sliders glide instead of stepping.

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
