// Launch Day balance check at the live rules (2 players, meter 6, target 45, 8-card Launch pile):
// 5,000 games for each player strategy. A healthy result has balanced play winning around 60-70%,
// safety-first a bit lower, and greedy (always score, never Audit) clearly worst.
//   node tools/sim/launchday-balance.js
//   TARGET=40 node tools/sim/launchday-balance.js    try a different team target
const { load } = require('./load-cards.js');
const { play, seedRng } = require('./launchday.js');
load();
const target = +(process.env.TARGET || 45), N = 5000;
const cfg = { players: 2, flips: 1, meterMax: 6, target, deckClock: true, aiDeckSize: 8, playersFirst: true };
const pc = x => (x * 100).toFixed(0) + '%';
console.log(`Launch Day, team target ${target}, ${N} games per strategy`);
for (const policy of ['balanced', 'safety', 'greedy']) {
  seedRng(77);
  let w = 0, rounds = 0;
  for (let i = 0; i < N; i++) { const r = play({ ...cfg, policy }); if (r.win) { w++; rounds += r.round; } }
  console.log(`  ${policy.padEnd(9)} wins ${pc(w / N).padStart(4)}${w ? `, in ${(rounds / w).toFixed(1)} rounds on average` : ''}`);
}
