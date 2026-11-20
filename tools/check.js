// One command to run before every push: checks the code for typos, then runs the playtest and the balance report.
// Usage: npm run check
const { spawnSync } = require('child_process'), path = require('path');
const run = (label, args) => { console.log('\n== ' + label + ' =='); const r = spawnSync(process.execPath, args, { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' }); return r.status === 0; };
let good = true;
for (const f of ['art.js', 'game.js', 'sw.js']) good = run('Syntax: ' + f, ['--check', f]) && good;
good = run('Playtest', ['tools/playtest.js']) && good;
good = run('Balance report (compare with the targets in docs/DESIGN.md)', ['tools/balance.js']) && good;
console.log(good ? '\nAll checks passed.' : '\nSomething failed. Scroll up for the FAIL line.');
process.exit(good ? 0 : 1);
