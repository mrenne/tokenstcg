// Quick Play balance check: every two-color deck (made legal at 20+ cards) plays every other,
// 500 games per matchup, on the live card pool. Prints first-player and deck win rates and
// Tokens per deploy for each System.
//   node tools/sim/quickplay-balance.js
const { load } = require('./load-cards.js');
const { play, deckFor, seedRng, SUITNAME, CARDS } = require('./quickplay.js');
load();
const legalDeck = s => { const d = deckFor(s); const cm = d.filter(c => c.rar === 'C').sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name)); for (let i = 0; d.length < 20 && i < cm.length; i++) d.push(cm[i]); return d; };
const su = ['G', 'B', 'K', 'W', 'R']; const pairs = [];
for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pairs.push([su[i], su[j]]);
seedRng(31337);
const N = 500;
const wins = {}, games = {}, card = {};
let firstWins = 0, total = 0, rounds = 0, mcSaves = 0, mcGames = 0, deepfakeLoop = 0;
const C = n => card[n] || (card[n] = { deploys: 0, tasks: 0, tokens: 0, deaths: 0, audits: 0 });
for (let a = 0; a < pairs.length; a++) for (let b = a + 1; b < pairs.length; b++) {
  const ka = pairs[a].join('+'), kb = pairs[b].join('+');
  for (let g = 0; g < N; g++) {
    const log = [], first = g % 2;
    const r = play(legalDeck(pairs[a]), legalDeck(pairs[b]), false, first, log);
    games[ka] = (games[ka] || 0) + 1; games[kb] = (games[kb] || 0) + 1;
    if (r.winner === 0) wins[ka] = (wins[ka] || 0) + 1; else if (r.winner === 1) wins[kb] = (wins[kb] || 0) + 1;
    if (r.winner === first) firstWins++;
    total++; rounds += r.rounds;
    let saves = 0;
    for (const line of log) {
      let m;
      if ((m = line.match(/^  deploys (.+) \(cost/))) C(m[1]).deploys++;
      else if ((m = line.match(/^  (.+) Runs a Task: \+(\d)/))) { C(m[1]).tasks++; C(m[1]).tokens += +m[2]; }
      else if ((m = line.match(/^  (.+) Audits /))) C(m[1]).audits++;
      else if ((m = line.match(/^   (.+) \([AB]\) Deprecated by audit/))) C(m[1]).deaths++;
      else if (line.includes('Model Card saves')) { saves++; mcSaves++; }
    }
    if (saves) mcGames++;
    if (saves >= 3) deepfakeLoop++;
  }
}
const pc = x => (x * 100).toFixed(0).padStart(3) + '%';
console.log(`Games ${total} | first player wins ${pc(firstWins / total)} | avg ${(rounds / total).toFixed(1)} rounds`);
console.log(`Model Card: ${(mcSaves / total).toFixed(2)} saves per game; ${pc(mcGames / total)} of games have at least one; ${pc(deepfakeLoop / total)} have 3+ (a save-loop engine)`);
console.log('\nDeck win rates:');
Object.keys(games).sort((x, y) => wins[y] / games[y] - wins[x] / games[x]).forEach(k =>
  console.log(`  ${(k.split('+').map(s => SUITNAME[s]).join('+') + ' (' + legalDeck(k.split('+')).length + ')').padEnd(22)} ${pc((wins[k] || 0) / games[k])}`));
console.log('\nSystems: tokens per deploy (deploys > 300), best and worst:');
const rows = Object.entries(card).filter(([n, s]) => { const c = CARDS.find(x => x.name === n); return c && c.type === 'System' && s.deploys > 300; })
  .map(([n, s]) => { const c = CARDS.find(x => x.name === n); return { n, c, tpd: s.tokens / s.deploys, death: s.deaths / s.deploys, aud: s.audits / s.deploys, dep: s.deploys }; })
  .sort((a, b) => b.tpd - a.tpd);
const show = r => console.log(`  ${SUITNAME[r.c.suit].padEnd(6)} ${r.n.padEnd(22)} ${r.c.cost}|${r.c.cap}/${r.c.trust}/${r.c.tok}  tok/deploy ${r.tpd.toFixed(2)}  Audited out ${pc(r.death)}  audits/deploy ${r.aud.toFixed(2)}`);
rows.slice(0, 6).forEach(show); console.log('  ...'); rows.slice(-6).forEach(show);
