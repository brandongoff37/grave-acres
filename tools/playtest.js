// End-to-end smoke test on a phone-sized screen. Saves screenshots to previews/.
// Usage: node tools/playtest.js
const fs = require('fs');
const { launch, GAME, OUT } = require('./browser');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  const shot = n => p.screenshot({ path: OUT + '/' + n + '.png' });
  const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) process.exitCode = 1; };
  await p.goto(GAME); await p.waitForTimeout(600); await shot('01-welcome');
  await p.evaluate(() => closeSheet());
  await p.evaluate(() => { plant(0, 'radish'); plant(1, 'radish'); plant(2, 'shamb'); }); await p.waitForTimeout(600);
  await p.click('#goal button'); ok(await p.evaluate(() => S.goal === 1), 'goal claim');
  await p.evaluate(() => { S.plots[0].t = Date.now() - 3600e3; S.plots[1].t = Date.now() - 280e3; refresh(); }); await p.waitForTimeout(700);
  ok(await p.evaluate(() => plotState(S.plots[0]) === 'withered'), 'crops wither');
  ok(await p.evaluate(() => document.querySelector('#field .plot:nth-child(2)').classList.contains('warn')), 'wither warning flash');
  await shot('02-farm');
  ok(await p.evaluate(() => document.querySelectorAll('#field .plot').length === 20 && document.querySelectorAll('#field .plot .hs svg').length === 8), 'graveyard: 20 plots, a headstone on every open grave');
  ok(await p.evaluate(() => { const a = document.querySelector('#field .plot').getBoundingClientRect(), b = document.querySelector('#harvestAll').getBoundingClientRect(); return a.width > 60 && b.bottom < innerHeight; }), 'farm fits on a phone screen without scrolling');
  await p.evaluate(() => { S.level = 5; S.coins = 3000; S.bones = 10; S.beaten = { 0: 1, 1: 1, 2: 1 }; S.horde = [];
    ['brute','brute','sprint','sprint','shamb','shamb','mummy'].forEach((s, i) => S.horde.push({ id: S.zid++, s, mut: i == 0 })); S.nextMob = Date.now() + 1e5; save(); refresh(); });
  await p.click('nav button[data-v=raid]'); await p.waitForTimeout(300); await shot('03-raid');
  ok(!/NaN/.test(await p.evaluate(() => document.getElementById('raidPick').innerText)), 'raid screen has no NaN');
  await p.evaluate(() => pickSquad(3)); await p.waitForTimeout(300); await shot('04-squad');
  const n0 = await p.evaluate(() => squadSel.length); await p.click('#sheetBody .zcard.sel >> nth=0');
  ok(await p.evaluate(() => squadSel.length) === n0 - 1, 'squad toggle');
  await p.click('#sheetBody .zcard.off >> nth=0'); await p.click('#sheetBody button.gold'); await p.waitForTimeout(1800); await shot('05-battle');
  await p.click('#skipBtn'); await p.waitForTimeout(400);
  ok(/rebuild stronger|held them off/.test(await p.evaluate(() => document.getElementById('log').innerText)), 'battle resolves');
  ok(await p.evaluate(() => document.getElementById('result').classList.contains('show') && document.querySelectorAll('#mine .u, #foes .u').length >= 2), 'battle result card shows');
  await p.click('#battleDone');
  // A mob that arrives while you're playing is fought on screen at the graveyard gate
  await p.evaluate(() => { S.nextMob = Date.now() - 1000; }); await p.waitForTimeout(2200); await shot('06-mob');
  ok(await p.evaluate(() => fighting && /mob/i.test(document.getElementById('vsTxt').textContent)), 'torch mob battle starts');
  await p.click('#skipBtn'); await p.waitForTimeout(400);
  ok(/mob/i.test(await p.evaluate(() => document.getElementById('result').innerText)), 'torch mob resolves');
  await p.click('#battleDone'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => view === 'raid' && !fighting && S.nextMob > Date.now()), 'back from the mob, next one scheduled');
  // A mob that came while the game was closed just gives a report
  await p.evaluate(() => { S.nextMob = Date.now() - 60000; }); await p.waitForTimeout(1200);
  ok(/while you were away/i.test(await p.evaluate(() => document.getElementById('sheetBody').innerText)), 'away mob report');
  await p.evaluate(() => closeSheet());
  await p.click('#menuBtn'); await p.click('#exportBtn'); await p.waitForTimeout(200);
  const code = await p.evaluate(() => document.getElementById('saveCode').value); const c0 = await p.evaluate(() => S.coins);
  await p.evaluate(() => { S.coins = 1; save(); });
  await p.click('#importBtn'); await p.fill('#loadCode', code); await p.click('#loadGo'); await p.waitForTimeout(800);
  ok(await p.evaluate(() => S.coins) === c0, 'save code backup/restore');
  await p.evaluate(() => localStorage.setItem('graveacres.v1', JSON.stringify({ coins: 99, bones: 0, level: 2, xp: 0, plots: [{}, {}, { seed: 'egg', t: Date.now() }], horde: [{ id: 1, s: 'shamb' }], beaten: { 0: true }, zid: 2, stats: { harvests: 1, raised: 1, raids: 1, wins: 1 }, seen: 1, lastDay: '2000-1-1' })));
  await p.reload(); await p.waitForTimeout(800);
  ok(await p.evaluate(() => S.beaten[0] === 1 && S.plots.length === 20 && S.stats.planted === 0), 'old save migrates');
  // The version numbers in index.html and sw.js must agree, or phones keep serving the old files
  const html = fs.readFileSync(__dirname + '/../index.html', 'utf8'), sw = fs.readFileSync(__dirname + '/../sw.js', 'utf8');
  const vs = [...html.matchAll(/\?v=(\d+)/g), ...sw.matchAll(/\?v=(\d+)/g), ...sw.matchAll(/grave-acres-v(\d+)/g)].map(m => m[1]);
  ok(vs.length >= 5 && new Set(vs).size === 1, 'version numbers match everywhere (v' + [...new Set(vs)].join(', v') + ')');
  ok(errs.length === 0, 'no page errors ' + (errs.length ? JSON.stringify(errs) : ''));
  await b.close();
  if (process.exitCode !== 1 && errs.length) process.exitCode = 1;
})();
