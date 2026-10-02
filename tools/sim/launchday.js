// Launch Day co-op simulator: a team of players vs. an automated AI deck (Black+Red cards).
// Used by launchday-balance.js. The live rules (design/GAME_CONCEPT.md, Classroom use modes) are
// players: 2, Drift meter 6, team target 45, an 8-card Launch pile, players go first.
//
// Experiment switches (environment variables):
//   NO_HWFLIP=1 CPU and RAM do nothing when flipped (the rules have them speed the AI up)
//   FC_HOLD=1   players never train Fairness Check as Data
//   FC_ONCE=1   Fairness Check works once per game instead of once per round
const { CARDS } = require('./quickplay.js');

let rng = Math.random;
function seedRng(seed) { let s = seed >>> 0; rng = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const bySuit = s => CARDS.filter(c => s.includes(c.suit) && c.rar !== 'Ch');
const SUPPRESS = new Set(['Manual Override', 'Compliance Review', 'Ambiguous Input']);
const PAIRS = [['G', 'W'], ['G', 'B'], ['B', 'W']];

function play({ players = 2, meterMax = 10, target = 15, policy = 'balanced', flips = 1, deadline = 99, deckClock = false, aiDeckSize = 99, playersFirst = false, log = null }) {
  const L = log ? m => log.push(m) : () => {};
  const ai = { deck: shuffle(bySuit(['K', 'R']).slice()).slice(0, aiDeckSize), sys: [], capBonus: 0 };
  const team = { tokens: 0, meter: 0 };
  const st = { auditsAI: 0, aiKilled: 0, suppress: 0, lowered: 0, ownDrift: 0, lostBy: null };
  const P = [];
  for (let i = 0; i < players; i++) {
    const pair = PAIRS[Math.floor(rng() * PAIRS.length)];
    const p = { name: 'P' + (i + 1), deck: shuffle(bySuit(pair).slice()), hand: [], ts: 0, spent: 0, sys: [], tools: [], extraTrain: 0 };
    for (let k = 0; k < 5; k++) p.hand.push(p.deck.shift());
    if (!(p.hand.some(c => c.type === 'System' && c.cost <= 3) && p.hand.filter(c => c.trainable).length >= 2)) {
      p.deck.push(...p.hand); p.hand = []; shuffle(p.deck); for (let k = 0; k < 5; k++) p.hand.push(p.deck.shift());
    }
    P.push(p);
  }
  const aiCap = s => s.card.cap + ai.capBonus;
  const drifts = s => aiCap(s) > s.card.trust;
  const drifters = () => ai.sys.filter(s => drifts(s) && !s.suppressed);
  const allTeamSys = () => P.flatMap(p => p.sys.map(s => ({ p, s })));
  const shield = () => P.some(p => p.tools.some(t => t.card.name === 'Privacy Shield'));
  const bump = (n, why) => { team.meter += n; L(`   meter +${n} (${why}) -> ${team.meter}`); };
  const lost = () => team.meter >= meterMax;
  const won = () => team.tokens >= target;

  function killTeam(p, s) { if (s.flags >= s.card.trust) { p.sys.splice(p.sys.indexOf(s), 1); L(`   ${s.card.name} (${p.name}) Deprecated`); } }
  function killAI(s) {
    if (s.flags >= s.card.trust) {
      ai.sys.splice(ai.sys.indexOf(s), 1); st.aiKilled++; L(`   AI ${s.card.name} Deprecated`);
      if (s.card.name === 'Reinforcement Learning') bump(1, 'Reinforcement Learning shut down');
    }
  }

  function flip(round) {
    if (!ai.deck.length) return;
    const c = ai.deck.shift();
    L(` AI flips ${c.name}`);
    const topTeam = () => allTeamSys().sort((a, b) => b.s.card.tok - a.s.card.tok)[0];
    if (c.type === 'System') ai.sys.push({ card: c, flags: 0, suppressed: false });
    else if (c.name === 'Bias in Data') { const t = topTeam(); if (t && !shield()) { t.s.flags++; killTeam(t.p, t.s); } }
    else if (c.name === 'Retraining Pause' || c.name === 'Job Disruption') { const t = topTeam(); if (t && !shield()) t.s.blocked = true; }
    else if (c.name === 'Environmental Footprint') P.forEach(p => p.ts = Math.max(0, p.ts - 1));
    else if (c.name === 'Cognitive Offload') P.forEach(p => { if (p.hand.length) p.hand.splice(p.hand.indexOf(p.hand.slice().sort((a, b) => val(a) - val(b))[0]), 1); });
    else if (c.type === 'Dataset' || (!process.env.NO_HWFLIP && (c.name === 'CPU' || c.name === 'RAM'))) flip(round);
    else if (c.name === 'CUDA' || c.name === 'GPU') ai.capBonus++;
    else if (c.name === 'Regulation Debate') P.forEach(p => p.extraTrain++);
    else if (['Obsolete', 'Outdated', 'Defunct', 'Discontinued', 'Expired'].includes(c.name)) { const all = P.flatMap(p => p.tools.map(t => ({ p, t }))).sort((x, y) => val(x.t.card) - val(y.t.card)); if (all.length) { all[0].p.tools.splice(all[0].p.tools.indexOf(all[0].t), 1); L(`  ${c.name}: team discards ${all[0].t.card.name}`); } }
  }

  function val(c) {
    if (c.type === 'System') return c.tok * 2 + (c.cap + c.trust) / 2 + (c.kw.includes('FT') ? 1 : 0) - (c.cap > c.trust ? 1 : 0);
    if (c.type === 'Tool') return { 'Human-in-the-Loop': 6, 'Model Card': 5, Python: 3, 'Feature Vector': 2.5, 'Privacy Shield': 2 }[c.name] || 1;
    if (c.name === 'Mandatory Recall') return 5;
    if (SUPPRESS.has(c.name)) return 3.5;
    return 1.5;
  }

  const danger = () => team.meter + drifters().length >= meterMax - 2 || drifters().length >= 2;

  function playerTurn(p, round) {
    p.sys.forEach(s => { s.ex = false; s.fresh = false; }); p.tools.forEach(t => t.ex = false); p.spent = 0;
    if (round > 1 && p.deck.length) p.hand.push(p.deck.shift());
    const avail = () => p.ts - p.spent;
    let trains = 1 + p.extraTrain; p.extraTrain = 0;
    while (trains-- > 0) {
      const tr = p.hand.filter(c => c.trainable && !(p.ts >= 3 && val(c) >= 5) && !(process.env.FC_HOLD && c.name === 'Fairness Check'));
      if (!tr.length || !(p.ts < 7 || p.hand.length >= 4)) break;
      const c = tr.sort((a, b) => (val(a) - (a.cost > p.ts + 2 ? 2 : 0)) - (val(b) - (b.cost > p.ts + 2 ? 2 : 0)))[0];
      p.hand.splice(p.hand.indexOf(c), 1); p.ts++;
    }
    for (;;) {
      const tax = Math.max(0, p.sys.length - 1);
      const opts = p.hand.map(c => {
        const cost = c.cost + (c.type === 'System' ? tax : 0);
        if (cost > avail()) return null;
        let pr = -1;
        if (c.type === 'System') pr = 100 + val(c);
        else if (c.type === 'Tool') { if (!p.tools.some(t => t.card.name === c.name) && !['Tensor'].includes(c.name)) pr = 80 + val(c); }
        else if (policy !== 'greedy' && c.name === 'Mandatory Recall') { if (drifters().length >= 2) pr = 120; }
        else if (policy !== 'greedy' && SUPPRESS.has(c.name)) { if (drifters().length && (policy === 'safety' || danger())) pr = 110; }
        else if (c.name === 'AI Career Path') pr = 30;
        return pr > 0 ? { c, cost, pr } : null;
      }).filter(Boolean).sort((a, b) => b.pr - a.pr);
      if (!opts.length) break;
      const { c, cost } = opts[0];
      p.hand.splice(p.hand.indexOf(c), 1); p.spent += cost;
      if (c.type === 'System') { p.sys.push({ card: c, flags: 0, fresh: true }); L(`  ${p.name} deploys ${c.name}`); }
      else if (c.type === 'Tool') p.tools.push({ card: c, ex: false });
      else if (c.name === 'Mandatory Recall') { ai.sys.forEach(s => s.suppressed = true); st.suppress++; L(`  ${p.name} Mandatory Recall`); }
      else if (SUPPRESS.has(c.name)) { const t = drifters().sort((a, b) => aiCap(b) - aiCap(a))[0]; t.suppressed = true; st.suppress++; L(`  ${p.name} ${c.name} on AI ${t.card.name}`); }
      else if (c.name === 'AI Career Path' && p.deck.length) p.hand.push(p.deck.shift());
    }
    for (const t of p.tools) {
      if ((t.card.name === 'Python' || t.card.name === 'Feature Vector') && p.deck.length) p.hand.push(p.deck.shift());
      if (t.card.name === 'Human-in-the-Loop' && team.meter > 0) { const n = Math.min(2, team.meter); team.meter -= n; st.lowered += n; L(`  ${p.name} Human-in-the-Loop: meter -${n} -> ${team.meter}`); }
      if (t.card.name === 'Fairness Check' && !(process.env.FC_ONCE && t.used)) { const d = ai.sys.filter(s => aiCap(s) > s.card.trust).sort((a, b) => (b.flags - a.flags) || (aiCap(b) - aiCap(a)))[0]; if (d) { t.used = true; d.flags++; L(`  ${p.name} Fairness Check flags AI ${d.card.name}`); killAI(d); } }
      if (t.card.name === 'Model Card' && team.meter > 0) { team.meter--; st.lowered++; L(`  ${p.name} Model Card: meter -1 -> ${team.meter}`); }
    }
    const actors = p.sys.filter(s => !s.fresh || s.card.kw.includes('FT')).sort((a, b) => b.card.cap - a.card.cap);
    for (const s of actors) {
      if (!p.sys.includes(s)) continue;
      const targets = ai.sys.filter(t => t.card.trust - t.flags <= s.card.cap).sort((a, b) => (drifts(b) - drifts(a)) || (aiCap(b) - aiCap(a)));
      const tgt = targets.find(drifts);
      const misTask = s.card.cap > s.card.trust;
      let audit = false;
      if (tgt && policy === 'safety') audit = true;
      if (tgt && policy === 'balanced') audit = danger() || (team.meter >= meterMax - 3);
      const canTask = !s.blocked;
      if (policy === 'balanced' && canTask && !audit && misTask && team.meter + 1 >= meterMax - 1) {
        if (!tgt) continue;
        audit = true;
      }
      if (audit && tgt) {
        st.auditsAI++;
        const back = aiCap(tgt) + (tgt.card.kw.includes('ADV') ? 1 : 0);
        L(`  ${p.name} ${s.card.name} Audits AI ${tgt.card.name}`);
        tgt.flags += s.card.cap; s.flags += back;
        killAI(tgt); killTeam(p, s);
      } else if (canTask) {
        team.tokens += s.card.tok; L(`  ${p.name} ${s.card.name} Task +${s.card.tok} -> ${team.tokens}`);
        if (s.card.name === 'The Human Trainer' && p.deck.length && p.ts < 9) { p.deck.shift(); p.ts++; }
        if (s.card.name === 'Search Tree' && p.deck.length) p.hand.push(p.deck.shift());
        if (misTask) { st.ownDrift++; bump(1, `${s.card.name} drift`); }
      }
      if (won()) return; if (lost()) return;
    }
    p.sys.forEach(s => s.blocked = false);
  }

  let round = 0;
  while (round < 40) {
    round++;
    if (round > deadline || (deckClock && !ai.deck.length)) { st.lostBy = 'deadline'; return { win: false, round, st, team }; }
    L(`Round ${round}: tokens ${team.tokens}, meter ${team.meter}`);
    if (!(playersFirst && round === 1)) for (let f = 0; f < flips; f++) flip(round);
    const d = drifters();
    if (d.length) bump(d.length, `AI drift: ${d.map(s => s.card.name).join(', ')}`);
    ai.sys.forEach(s => s.suppressed = false);
    if (lost()) { st.lostBy = 'drift'; return { win: false, round, st, team }; }
    for (const p of P) {
      playerTurn(p, round);
      if (won()) return { win: true, round, st, team };
      if (lost()) { st.lostBy = 'drift'; return { win: false, round, st, team }; }
    }
  }
  return { win: false, round, st, team, timeout: true };
}

module.exports = { play, seedRng };

if (require.main === module) {
  const arg = process.argv[2] || 'grid';
  if (arg === 'sample') {
    seedRng(+process.argv[3] || 3);
    const log = [];
    const r = play({ players: 2, meterMax: +process.argv[4] || 10, target: +process.argv[5] || 15, log });
    console.log(log.join('\n')); console.log(r.win ? 'TEAM WINS' : 'TEAM LOSES', 'round', r.round);
    return;
  }
  seedRng(2026);
  const N = +process.argv[3] || 1500;
  const run = cfg => {
    let w = 0, wr = 0, dl = 0;
    for (let i = 0; i < N; i++) { const r = play(cfg); if (r.win) { w++; wr += r.round; } else if (r.st.lostBy === 'deadline') dl++; }
    return { win: w / N, winRounds: w ? wr / w : 0, deadlineLoss: dl / N };
  };
  const pc = x => (x * 100).toFixed(0).padStart(3) + '%';
  const rows = [];
  for (const players of [2, 3, 4]) for (const flips of [1, 2]) for (const meterMax of [6, 8, 10])
    for (const clock of ['d7', 'd8', 'd9', 'deck']) for (const target of [15, 20, 25, 30, 35, 40]) {
      if (clock === 'deck' && flips === 1) continue;
      const base = { players, meterMax, target, flips, deadline: clock === 'deck' ? 99 : +clock.slice(1), deckClock: clock === 'deck' };
      const b = run({ ...base, policy: 'balanced' });
      if (b.win < 0.45 || b.win > 0.75) continue;
      const g = run({ ...base, policy: 'greedy' }), sa = run({ ...base, policy: 'safety' });
      const score = Math.abs(b.win - 0.6) + Math.max(0, g.win - 0.3) + Math.max(0, sa.win - (b.win - 0.15));
      rows.push({ players, flips, meterMax, clock, target, b, g, sa, score });
    }
  for (const players of [2, 3, 4]) {
    console.log(`
=== ${players} players: best configs (target balanced ~60%, greedy <=30%, safety clearly below balanced) ===`);
    console.log('flips meter clock target | balanced greedy safety | balanced win round | lost to deadline (balanced)');
    rows.filter(r => r.players === players).sort((a, b) => a.score - b.score).slice(0, 6).forEach(r =>
      console.log(`  ${r.flips}    ${String(r.meterMax).padStart(3)}  ${r.clock.padEnd(5)} ${String(r.target).padStart(4)}   |  ${pc(r.b.win)}    ${pc(r.g.win)}   ${pc(r.sa.win)}  |  ${r.b.winRounds.toFixed(1)}  | ${pc(r.b.deadlineLoss)}`));
  }
}
