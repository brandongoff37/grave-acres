// Raises the release number everywhere it has to match, so phones pick up the new files.
// Usage: npm run bump          (goes from v9 to v10, and so on)
//        npm run bump -- 12    (sets a specific number)
// It updates: index.html (?v=), sw.js (cache name and ?v=), package.json (1.N.0) and CLAUDE.md ("Current: vN").
const fs = require('fs'), path = require('path');
const at = f => path.resolve(__dirname, '..', f);
const read = f => fs.readFileSync(at(f), 'utf8');
const now = +(read('sw.js').match(/grave-acres-v(\d+)/) || [])[1];
if (!now) { console.error('Could not find the current version in sw.js'); process.exit(1); }
const next = +process.argv[2] || now + 1;
const edit = (f, fn) => { const a = read(f), b = fn(a); fs.writeFileSync(at(f), b); console.log((a === b ? 'unchanged ' : 'updated   ') + f); };
edit('index.html', s => s.replace(/\?v=\d+/g, '?v=' + next));
edit('sw.js', s => s.replace(/\?v=\d+/g, '?v=' + next).replace(/grave-acres-v\d+/, 'grave-acres-v' + next));
edit('package.json', s => s.replace(/"version": "1\.\d+\.\d+"/, '"version": "1.' + next + '.0"'));
edit('CLAUDE.md', s => s.replace(/\(Current: \*\*v\d+\*\*\.\)/, '(Current: **v' + next + '**.)'));
console.log('Version is now v' + next + '. Add a CHANGELOG.md entry, then run: npm run check');
