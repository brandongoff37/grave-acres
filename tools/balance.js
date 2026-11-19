// Simulates hundreds of battles per town and prints win rates.
// Usage: node tools/balance.js   (target: first towns ~100%, Mudbury→Castle Kale ~40-60%,
// The Capital needs mutants; mobs ~75-95% for a reasonable home horde)
const { launch, GAME } = require('./browser');
(async () => {
  const b = await launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(GAME); await p.waitForTimeout(400);
  const out = await p.evaluate(() => {
    const squads = {
      0: ['shamb','shamb','shamb'],
      1: ['shamb','shamb','sprint','shamb'],
      2: ['sprint','sprint','shamb','shamb'],
      3: ['brute','brute','sprint','sprint','shamb'],
      4: ['brute','brute','sprint','sprint','sprint','mummy'],
      5: ['mummy','mummy','brute','brute','sprint','vamp','sprint'],
      6: ['vamp','vamp','mummy','mummy','brute','brute','vamp','sprint'],
    };
    const res = [];
    for (const ti in squads) {
      const z = squads[ti]; let w = 0, lost = 0; const N = 400;
      for (let n = 0; n < N; n++) {
        const mine = z.map((id, i) => makeZ({ id: i, s: id, mut: ti == 6 && i < 3 }, i));
        const foes = TOWNS[ti].foes.map((f, i) => makeFoe(f, i, 1));
        if (simulate(mine, foes).win) w++; lost += mine.filter(u => u.hp <= 0).length;
      }
      res.push(TOWNS[ti].name.padEnd(13) + ' win ' + String(Math.round(100 * w / N)).padStart(3) + '%  avg fallen ' + (lost / N).toFixed(1) + '/' + z.length + (ti == 6 ? '  (3 mutants)' : ''));
    }
    for (const [lvl, z] of [[2,['shamb','shamb','sprint','shamb']],[4,['brute','sprint','sprint','shamb','shamb']],[7,['mummy','brute','brute','sprint','sprint','sprint']],[10,['vamp','vamp','mummy','mummy','brute','brute','vamp','sprint']]]) {
      S.level = lvl; S.beaten = { 0: 1, 1: 1, 2: lvl > 3 ? 1 : 0 }; let w = 0; const N = 300;
      for (let n = 0; n < N; n++) { const f = mobForce(); if (simulate(z.map((id, i) => makeZ({ id: i, s: id }, i)), f.map((x, i) => makeFoe(x, i, x[3]))).win) w++; }
      res.push(('Mob lvl ' + lvl).padEnd(13) + ' defenders win ' + Math.round(100 * w / N) + '%');
    }
    return res;
  });
  console.log(out.join('\n')); if (errs.length) console.log('ERRORS', errs);
  await b.close();
})();
