# Grave Acres — game design

All numbers below come straight from `game.js`. If you change them there, update this file (or regenerate it).

## Core loop
1. **Farm:** plant crops for coins and zombie seeds for your horde. Water once to grow 35% faster.
2. **Harvest in time:** ripe crops wither if left too long (they flash red in the last quarter of that window).
3. **Raid:** pick a squad, attack a town, win coins, bones and XP. Fallen zombies are lost unless they crawl home (20%).
4. **Defend:** once you've overrun a town, torch mobs hit your farm every 7–12 minutes. Your strongest squad defends automatically.
5. **Grow:** levels raise horde size (6 + level) and squad size (3 + level ÷ 2), unlock seeds and towns. Goals give extra rewards.

## Crops
| Crop | Level | Cost | Grows | Sells | Profit | XP | Withers after ripe |
|---|---|---|---|---|---|---|---|
| Ghost Carrot (`radish`) | 1 | 5 | 20s | 12 | +7 | 2 | 5m 0s |
| Moon Corn (`corn`) | 1 | 12 | 45s | 30 | +18 | 4 | 5m 0s |
| Grin Gourd (`pump`) | 3 | 25 | 1m 30s | 65 | +40 | 7 | 6m 0s |
| Gloom Plum (`egg`) | 5 | 45 | 3m 0s | 125 | +80 | 12 | 12m 0s |
| Spook Cap (`mush`) | 7 | 80 | 5m 0s | 230 | +150 | 20 | 20m 0s |

## Zombies
Mutants (10% when harvested, or via Mutation Serum for 6 bones) get +50% attack and health.

| Zombie | Level | Cost | Grows | Attack | Health | Ability | Release value |
|---|---|---|---|---|---|---|---|
| Shambler (`shamb`) | 1 | 20 | 40s | 3 | 13 | **Steady** — Cheap and reliable | 8 |
| Dasher (`sprint`) | 2 | 45 | 1m 15s | 5 | 9 | **Quick** — 35% chance to strike twice | 18 |
| Lugnut (`brute`) | 4 | 90 | 2m 30s | 5 | 30 | **Tough** — Takes 2 less damage from every hit | 35 |
| Wrapster (`mummy`) | 6 | 140 | 3m 40s | 7 | 24 | **Wrap** — 30% chance to wrap up its target so it loses a turn | 55 |
| Night Count (`vamp`) | 8 | 220 | 5m 20s | 11 | 28 | **Drain** — Heals half the damage it deals | 90 |

## Townsfolk
| Townsperson | Ability |
|---|---|
| Farmer (`farmer`) | **Rally** — When knocked down, the other townsfolk get +1 attack |
| Farmhand (`farmhand`) | **Hay Bale** — Blocks the first hit it takes |
| Guard Dog (`dog`) | **Quick** — 35% chance to bite twice |
| Constable (`constable`) | **Whistle** — Calls in a Guard Dog the first time it drops below half health |
| Sheriff (`sheriff`) | **Sharpshooter** — 30% chance of a double-damage hit |
| Town Guard (`guard`) | **Bodyguard** — Often steps in to take hits meant for others; light armor |
| Knight (`knight`) | **Heavy Armor** — Takes 3 less damage from every hit |
| Hedge Wizard (`wizard`) | **Healer** — Heals badly hurt allies instead of attacking |
| Scarecrow-Bot (`robot`) | **Sweep** — Armored, and every swing hits two zombies |

## Towns
Each town must be overrun before the next unlocks. After each win the town rebuilds **20% stronger** (up to +200%); repeat loot is 60% coins (+10% per rebuild), half bones, half XP.

| Town | Level | Defenders (attack/health) | Coins | Bones | XP |
|---|---|---|---|---|---|
| Pickleton | 1 | Farmer 2/11, Farmer 2/11 | 40 | 1 | 15 |
| Hayford | 2 | Farmer 3/12, Farmhand 3/14, Guard Dog 3/10 | 85 | 2 | 28 |
| Mudbury | 3 | Constable 4/14, Farmhand 3/12, Farmer 3/12, Guard Dog 3/7 | 150 | 3 | 45 |
| Cobble Creek | 5 | Constable 5/16, Constable 4/16, Sheriff 6/20, Guard Dog 4/12, Farmhand 4/12 | 240 | 4 | 70 |
| Fort Turnip | 6 | Town Guard 6/26, Town Guard 6/26, Sheriff 7/22, Constable 5/20, Guard Dog 5/12 | 350 | 6 | 100 |
| Castle Kale | 8 | Knight 9/46, Town Guard 7/32, Town Guard 7/32, Hedge Wizard 8/26, Sheriff 9/28, Farmer 5/16 | 560 | 10 | 150 |
| The Capital | 10 | Scarecrow-Bot 12/58, Knight 9/40, Knight 9/40, Hedge Wizard 9/26, Town Guard 8/30, Town Guard 8/30 | 1000 | 20 | 260 |

## Battle rules
- Every round, all living fighters act in random order. Damage is attack × 75–125%, doubled on a critical (8% base, Sheriff 30%), minus the target's armor (minimum 1).
- Abilities: **quick** (chance of a second swing), **armor** (flat damage reduction), **stun/wrap** (target skips its next turn), **drain** (heal half of damage dealt), **heal** (Hedge Wizard heals an ally under 60% health, 60% of the time), **cleave** (hit two targets), **rally** (allies +1 attack when it falls), **shield** (blocks first hit), **backup** (summons a Guard Dog once below half health), **taunt** (45% chance to take a hit aimed at an ally).
- Odds labels compare squad power to defense: Easy ≥ 1.5×, Fair ≥ 1.15×, Risky ≥ 0.9×, otherwise Deadly.

## How it looks and moves (3D)
- The 3D is done with CSS only (no 3D library): the farm and the battlefield are flat boards leaned back with `rotateX`, and every picture standing on them is turned back by the same angle so it faces the player.
- Two numbers in `index.html` control the lean: `--tilt` (farm, 26°) and `--lean` (battlefield, 50°).
- Farm plots are only rebuilt when their contents change, so their animations keep running; the progress bar and countdown are updated in place.
- Battle playback reads the same step list the engine has always produced. The picture side (leaps, knock-backs, numbers, falling over) lives in `playBattle()` in `game.js` and never changes who wins.
- Battle speed: 520 ms per step at ×1, 250 ms at ×2 (`S.fast`, saved).
- Everything animated respects the phone's "reduce motion" setting.

### The graveyard (farm screen)
- `#yard` is the leaning ground. Inside it: `.gy-back` (fence, gate, tree standing along the back), two `.gy-side` fences that stand straight up along the edges, `#field` (the 20 plots), two `.gy-lamp` lanterns, `.fog` and two `.wisp` lights.
- Each open plot is a grave: `.plot` (the dirt bed) with a `.hs` headstone standing at its head. The headstone design is picked from the plot's position, so it never changes.
- Locked plots are flat and shorter than open ones so new players don't have to scroll.
- `#fieldWrap` slowly moves its `perspective-origin` left and right (the "look" animation), which is what makes near and far things shift.

## Title screen and sound
- `#title` covers the game every time it opens. `showTitle()` fills it in; tapping Play sets `started = true`, starts the music and then shows the welcome, daily bonus or "ready to harvest" message (`greet()`). Torch mobs wait until Play has been tapped.
- Phones only allow sound after a tap, which is why the music starts from the Play button.
- All sound is generated with Web Audio in `game.js` (no audio files). `SONG` holds the music as numbers: 8 bars of 16 steps at 72 beats per minute (slow), with a pedal note and a held chord per bar and a list of `[step, note, length]` for the tune. `organ()` plays one note using a ready-made organ wave shape (`PIPE`), one sound source per note. All sound runs through a filter that removes rumble below about 85 Hz (phone speakers buzz on it) and a limiter, and every sound fades in and out for a few milliseconds so nothing clicks. Keep both habits when adding sounds. To change the speed, change `bpm`. `musicStep()` plays one step; `musicTick()` schedules steps a fraction of a second ahead.
- Volume: `S.musicVol` and `S.sfxVol` (0 to 1, saved) feed two volume knobs (`MG` for music, `SG` for effects). `S.sound` is the master on/off. `soundUI()` / `bindSound()` draw and wire the sliders wherever they are shown.

## Torch mobs
- If the game is open when a mob arrives, the fight is shown on the battlefield (`playBattle(..., atHome=true)`), then the result is applied. If the game was closed, the result is applied straight away and shown as a report.
- Start after your first overrun town. Arrive every 7–12 minutes (also resolved when you reopen the game).
- Size: 2 + level ÷ 2.5 (max 6). Stronger with level and with total town rebuilds.
- **Win:** coins (10 × level), bones (1 + level ÷ 3), XP. **Lose:** 2 planted plots trampled and 15% of coins stolen.

## Progression
| Level | XP needed |
|---|---|
| 1 → 2 | 40 |
| 2 → 3 | 100 |
| 3 → 4 | 180 |
| 4 → 5 | 280 |
| 5 → 6 | 400 |
| 6 → 7 | 540 |
| 7 → 8 | 700 |
| 8 → 9 | 880 |
| 9 → 10 | 1080 |
| 10 → 11 | 1300 |

Level-up bonus: 25 × new level coins. Daily bonus: 20 + 5 × level coins.

Plot costs (plots 9–20): 60, 90, 130, 180, 250, 330, 420, 520, 650, 800, 1000, 1250.

## Goals
| # | Goal | Reward |
|---|---|---|
| 1 | Plant 3 crops | 20 coins |
| 2 | Raise your first zombie | 25 coins |
| 3 | Overrun Pickleton | 40 coins |
| 4 | Reach level 3 | 50 coins |
| 5 | Raise 8 zombies | 60 coins |
| 6 | Fight off a torch mob | 80 coins + 2 bones |
| 7 | Overrun Mudbury | 100 coins |
| 8 | Get a mutant zombie | 3 bones |
| 9 | Reach level 6 | 150 coins |
| 10 | Overrun Fort Turnip | 200 coins |
| 11 | Harvest 150 crops | 250 coins |
| 12 | Overrun Castle Kale | 350 coins + 5 bones |
| 13 | Overrun The Capital | 800 coins + 10 bones |
| 14 | Overrun The Capital 3 times | 1500 coins + 20 bones |

## Balance targets (check with `npm run balance`)
| Fight | Typical first-try squad | Target win rate |
|---|---|---|
| Pickleton, Hayford | 3–4 Shamblers/Dashers | ~95–100% (teaching) |
| Mudbury → Castle Kale | level-appropriate squad, no mutants | ~40–60% |
| The Capital | level-10 squad | near 0% without mutants, ~95%+ with 3 mutants |
| Torch mobs | reasonable home horde | 95–100% early, ~70–80% later |
