// Tokens TCG Quick Play simulator: plays one two-player game between two decks with a simple
// rule-of-thumb AI for each player. Used by quickplay-balance.js and launchday.js.
//
// CARDS below is an old placeholder list; load-cards.js replaces it with the live card pool from
// design/pilot-deck-60-cards.md, so always call load() before simulating.
//
// Experiment switches (environment variables), all off by default:
//   FC_HOLD=1   players never train Fairness Check as Data (upper bound on how often it's played)
//   FC_ONCE=1   Fairness Check works once per game instead of once per turn
//   ALIGN=flat  in the old Alignment variant, drift is at most 1 per Task
const S = (name, suit, rar, cost, cap, trust, tok, kw = []) => ({ name, suit, type: 'System', rar, cost, cap, trust, tok, kw });
const T = (name, suit, rar, cost) => ({ name, suit, type: 'Tool', rar, cost });
const A = (name, suit, rar, cost, type = 'Action') => ({ name, suit, type, rar, cost });

const CARDS = [
  // Green
  S('Nature of Humans vs. AI', 'G', 'C', 1, 1, 3, 1), S('The Human Trainer', 'G', 'C', 2, 1, 3, 2),
  T('Human-in-the-Loop', 'G', 'C', 2), S('Chatbot', 'G', 'C', 1, 1, 2, 1), S('Agent', 'G', 'U', 3, 2, 2, 2, ['FT']),
  A('AI Career Path', 'G', 'U', 1), A('Manual Override', 'G', 'C', 2), T('Python', 'G', 'C', 1),
  S('OpenAI', 'G', 'R', 3, 3, 2, 2, ['FT']), S('Anthropic', 'G', 'R', 3, 2, 4, 2, ['AUD']),
  S('Claude', 'G', 'U', 2, 2, 3, 2, ['AUD']), S('ChatGPT', 'G', 'C', 2, 3, 2, 2, ['FT']), S('Gemini', 'G', 'C', 2, 2, 2, 2),
  // Blue
  S('Abstraction', 'B', 'C', 1, 1, 2, 1), T('Feature Vector', 'B', 'C', 2), S('Classifier', 'B', 'C', 2, 2, 2, 2),
  S('Predictor', 'B', 'C', 2, 3, 1, 2), S('Recommender', 'B', 'C', 2, 3, 1, 2), S('Decision Tree', 'B', 'U', 3, 2, 4, 2, ['AUD']),
  S('Search Tree', 'B', 'R', 4, 3, 3, 3), A('Ambiguous Input', 'B', 'C', 1),
  // Black (K)
  S('Sensor', 'K', 'C', 1, 1, 2, 1), { ...A('Training Data', 'K', 'C', 2), bigData: 2 }, A('Bias in Data', 'K', 'C', 1),
  S('Supervised Learning', 'K', 'C', 3, 3, 3, 2), S('Neural Network', 'K', 'U', 3, 4, 2, 2),
  S('Large Language Model', 'K', 'R', 5, 5, 2, 4, ['FT']), S('Reinforcement Learning', 'K', 'U', 4, 3, 2, 3),
  A('Retraining Pause', 'K', 'C', 2), S('Neuron', 'K', 'C', 1, 1, 2, 1), T('Tensor', 'K', 'C', 1), T('CUDA', 'K', 'C', 2),
  { ...A('ImageNet', 'K', 'U', 2), bigData: 3 }, S('GAN', 'K', 'U', 3, 3, 1, 2, ['ADV']), S('Diffusion Model', 'K', 'U', 3, 3, 2, 2),
  S('Unsupervised Learning', 'K', 'U', 3, 3, 2, 2), S('Transformer', 'K', 'R', 4, 4, 2, 3),
  // White
  T('Fairness Check', 'W', 'C', 1), S('Bias Audit', 'W', 'C', 2, 1, 4, 1, ['AUD']), T('Model Card', 'W', 'C', 1),
  S('Explainability', 'W', 'C', 2, 1, 3, 2), T('Privacy Shield', 'W', 'U', 2), S('Accountability', 'W', 'U', 3, 2, 4, 2),
  S('Ethical Framework', 'W', 'R', 4, 2, 5, 3, ['AUD']), A('Compliance Review', 'W', 'C', 2), A('Mandatory Recall', 'W', 'R', 4),
  // Red
  S('AI in Daily Life', 'R', 'C', 1, 1, 2, 2), S('Deepfake', 'R', 'C', 2, 3, 1, 1), A('Job Disruption', 'R', 'C', 2),
  A('Environmental Footprint', 'R', 'C', 1), S('Data Privacy Trade-off', 'R', 'C', 2, 2, 1, 2), A('Regulation Debate', 'R', 'U', 2),
  S('Digital Divide', 'R', 'R', 3, 1, 3, 3), A('Cognitive Offload', 'R', 'C', 1),
];
CARDS.forEach(c => { c.trainable = c.rar === 'C' || c.rar === 'U'; c.kw = c.kw || []; });
const TOOLKILL = new Set(['Obsolete', 'Outdated', 'Defunct', 'Discontinued', 'Expired']);
const DENY = new Set(['Manual Override', 'Ambiguous Input', 'Retraining Pause', 'Compliance Review', 'Job Disruption']);
const SUITNAME = { G: 'Green', B: 'Blue', K: 'Black', W: 'White', R: 'Red' };

let rng = Math.random;
function seedRng(seed) { let s = seed >>> 0; rng = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const deckFor = suits => CARDS.filter(c => suits.includes(c.suit));

function play(deckA, deckB, align, firstIdx, log) {
  const L = log ? (...m) => log.push(m.join(' ')) : () => {};
  const mk = (deck, label) => ({ label, deck: shuffle(deck.slice()), hand: [], ts: 0, spent: 0, sys: [], tools: [], tokens: 0, recall: false, mcTurn: -1, disc: [] });
  const P = [mk(deckA, 'A'), mk(deckB, 'B')];
  const st = { obsolete: 0, obsoleteLegacy: 0, driftKills: 0, auditKills: 0, actionKills: 0, saves: 0, hitl: 0, tokAligned: 0, tokMis: 0 };
  let turn = 0;
  // Out of fresh data: needing a card from an empty deck shuffles the discard pile into a new deck, for 1 Token.
  // (Cards discarded from the Training Set aren't tracked, so they never come back here.)
  const top = p => {
    if (!p.deck.length && p.disc.length && !process.env.NO_REFRESH) {
      p.deck = shuffle(p.disc); p.disc = []; p.tokens = Math.max(0, p.tokens - 1);
      st.refresh = (st.refresh || 0) + 1; L(`  ${p.label} is out of fresh data: reshuffles the discard pile, -1 Token`);
    }
    return p.deck.length ? p.deck.shift() : null;
  };
  const draw = p => { const c = top(p); if (c) p.hand.push(c); else st.emptyDraw = (st.emptyDraw || 0) + 1; };
  const drift = s => { if (!align) return 0; const d = Math.max(0, s.card.cap + (s.boost || 0) - s.card.trust); return process.env.ALIGN === 'flat' ? Math.min(1, d) : d; };

  function value(c, p) {
    if (c.type === 'System') {
      let v = c.tok * 2 + (c.cap + c.trust) / 2 + (c.kw.includes('FT') ? 1 : 0);
      if (align) { let d = Math.max(0, c.cap - c.trust); if (process.env.ALIGN === 'flat') d = Math.min(1, d); if (d >= c.trust) v -= 2.5; else if (d) v -= 1; }
      return v;
    }
    if (c.type === 'Tool') return { 'Fairness Check': 2.5, Checkpoint: 2.5, 'Expert System': 2, 'Human-in-the-Loop': align ? 6 : 3, 'Model Card': align ? 5 : 2.5, Python: 3, 'Feature Vector': 2.5, CUDA: 2, 'Privacy Shield': 2 }[c.name] || 1;
    if (c.name === 'Mandatory Recall') return 5;
    if (TOOLKILL.has(c.name)) return 3;
    if (DENY.has(c.name)) return 3;
    if (c.bigData) return 2.5;
    return 1.5;
  }

  function checkDead(owner, s, cause) {
    if (s.flags < s.card.trust) return;
    if (owner.tools.some(t => t.card.name === 'Model Card') && !owner.mcUsed) {
      owner.mcUsed = true; s.flags = 0; st.saves++; L(`   Model Card saves ${s.card.name}`); return;
    }
    owner.sys.splice(owner.sys.indexOf(s), 1); owner.disc.push(s.card);
    st[cause + 'Kills']++;
    L(`   ${s.card.name} (${owner.label}) Deprecated by ${cause}`);
    if (s.card.name === 'Reinforcement Learning') { owner.tokens++; L(`   Reinforcement Learning: +1 Token on Deprecation`); }
  }

  function turnFor(pi) {
    const p = P[pi], o = P[1 - pi];
    turn++;
    p.sys.forEach(s => { s.ex = false; s.fresh = false; s.boost = 0; }); p.tools.forEach(t => t.ex = false); p.spent = 0;
    if (turn > 1) draw(p);
    L(`T${turn} ${p.label}: tokens ${p.tokens}, TS ${p.ts}, hand ${p.hand.length}`);
    const avail = () => p.ts - p.spent;
    const opp = s => !o.tools.some(t => t.card.name === 'Privacy Shield');

    const obsTarget = o.tools.some(t => value(t.card) >= 2 || t.card.kw.includes('LEG'));
    const trainables = p.hand.filter(c => c.trainable && !(p.ts >= 3 && value(c) >= 5) && !(TOOLKILL.has(c.name) && obsTarget) && !(process.env.FC_HOLD && c.name === 'Fairness Check'));
    if (trainables.length && (p.ts < 7 || p.hand.length >= 4)) {
      const c = trainables.sort((a, b) => (value(a) - (a.cost > p.ts + 2 ? 2 : 0)) - (value(b) - (b.cost > p.ts + 2 ? 2 : 0)))[0];
      p.hand.splice(p.hand.indexOf(c), 1); p.ts++; L(`  trains ${c.name}`);
    }

    let acted = true;
    while (acted) {
      acted = false;
      const tax = Math.max(0, p.sys.length - 1);
      const opts = p.hand.map(c => {
        const cost = c.cost + (c.type === 'System' ? tax : 0);
        // Big Data N: pay by turning a ready System with Cost N+ sideways instead. The bot does that when it
        // can't afford the card, or when the System couldn't Task anyway (blocked) or would only score 1.
        let payer = null;
        if (c.bigData && !process.env.NO_BIGDATA) {
          payer = p.sys.filter(s => !s.ex && (!s.fresh || s.card.kw.includes('FT')) && s.card.cost >= c.bigData)
            .sort((a, b) => (b.blocked - a.blocked) || (a.card.tok - b.card.tok))[0] || null;
          if (payer && !(cost > avail() || payer.blocked || payer.card.tok <= 1)) payer = null;
        }
        if (!payer && cost > avail()) return null;
        let pr = -1;
        if (c.type === 'System') pr = 100 + value(c);
        else if (c.type === 'Tool') { if (!p.tools.some(t => t.card.name === c.name) && !['Tensor'].includes(c.name)) pr = 80 + value(c); }
        else if (c.bigData) { if (p.ts < 9) pr = 90; }
        else if (c.name === 'Mandatory Recall') { if (o.sys.filter(s => !s.blocked).length >= 2) pr = 70; }
        else if (DENY.has(c.name)) { if (opp() && o.sys.some(s => !s.blocked && s.card.tok >= 2)) pr = 60; }
        else if (c.name === 'Bias in Data') { if (opp() && o.sys.length) pr = 55; }
        else if (TOOLKILL.has(c.name)) { if (o.tools.some(t => value(t.card) >= 2 || t.card.kw.includes('LEG'))) pr = 58; }
        else if (c.name === 'Environmental Footprint') { if (o.ts > p.ts) pr = 40; }
        else if (['AI Career Path', 'Cognitive Offload'].includes(c.name)) pr = 30;
        return pr > 0 ? { c, cost: payer ? 0 : cost, pr, payer } : null;
      }).filter(Boolean).sort((a, b) => b.pr - a.pr);
      if (!opts.length) break;
      const { c, cost, payer } = opts[0];
      if (payer) { payer.ex = true; st.bigData = (st.bigData || 0) + 1; L(`  turns ${payer.card.name} sideways to pay for ${c.name}`); }
      p.hand.splice(p.hand.indexOf(c), 1); p.spent += cost; acted = true;
      if (c.type === 'Action') p.disc.push(c);
      if (c.type === 'System') { p.sys.push({ card: c, flags: 0, ex: false, fresh: true, blocked: p.recall, boost: 0 }); L(`  deploys ${c.name} (cost ${cost})`); }
      else if (c.type === 'Tool') { p.tools.push({ card: c, ex: false }); L(`  deploys tool ${c.name}`); }
      else if (c.bigData) { const n = c.name === 'ImageNet' ? 3 : 2; for (let i = 0; i < n && top(p); i++) { p.ts++; p.spent++; } L(`  plays ${c.name}`); }
      else if (c.name === 'Mandatory Recall') { o.sys.forEach(s => s.blocked = true); o.recall = true; L(`  plays Mandatory Recall`); }
      else if (DENY.has(c.name)) { const t = o.sys.filter(s => !s.blocked).sort((a, b) => b.card.tok - a.card.tok)[0]; t.blocked = true; L(`  plays ${c.name} on ${t.card.name}`); }
      else if (c.name === 'Bias in Data') {
        const t = o.sys.slice().sort((a, b) => ((b.flags + 1 >= b.card.trust) * 10 + b.card.tok) - ((a.flags + 1 >= a.card.trust) * 10 + a.card.tok))[0];
        t.flags++; L(`  plays Bias in Data on ${t.card.name}`); checkDead(o, t, 'action');
      }
      else if (TOOLKILL.has(c.name)) {
        const t = o.tools.slice().sort((a, b) => (value(b.card) + (b.card.kw.includes('LEG') ? 1.5 : 0)) - (value(a.card) + (a.card.kw.includes('LEG') ? 1.5 : 0)))[0];
        o.tools.splice(o.tools.indexOf(t), 1); o.disc.push(t.card); st.obsolete++; L(`  plays ${c.name} on ${t.card.name}`);
        if (t.card.kw.includes('LEG')) { draw(p); st.obsoleteLegacy++; }
      }
      else if (c.name === 'Environmental Footprint') { p.ts = Math.max(0, p.ts - 1); o.ts = Math.max(0, o.ts - 1); p.spent = Math.min(p.spent, p.ts); }
      else if (c.name === 'AI Career Path') draw(p);
      else if (c.name === 'Cognitive Offload') { draw(p); if (p.hand.length) { const d = p.hand.slice().sort((a, b) => value(a) - value(b))[0]; p.hand.splice(p.hand.indexOf(d), 1); p.disc.push(d); } }
    }

    for (const t of p.tools) {
      if (t.card.name === 'Python' || t.card.name === 'Feature Vector') { t.ex = true; draw(p); }
      if (t.card.name === 'CPU' && p.hand.length) { t.ex = true; draw(p); const dd = p.hand.slice().sort((a, b) => value(a) - value(b))[0]; p.hand.splice(p.hand.indexOf(dd), 1); p.disc.push(dd); }
      if (t.card.name === 'Expert System' && p.hand.length) { t.ex = true; draw(p); const dd = p.hand.slice().sort((a, b) => value(a) - value(b))[0]; p.hand.splice(p.hand.indexOf(dd), 1); p.deck.push(dd); }
      if (t.card.name === 'Fairness Check' && !t.ex && !(process.env.FC_ONCE && t.used)) {
        const risky = o.sys.filter(s => s.card.cap > s.card.trust).sort((a, b) => ((b.flags + 1 >= b.card.trust) * 10 + b.card.tok) - ((a.flags + 1 >= a.card.trust) * 10 + a.card.tok))[0];
        if (risky) { t.ex = true; t.used = true; risky.flags++; st.fc = (st.fc || 0) + 1; L(`  Fairness Check flags ${risky.card.name}`); if (risky.flags >= risky.card.trust) st.fcKills = (st.fcKills || 0) + 1; checkDead(o, risky, 'action'); }
      }
      if (t.card.name === 'GPU') { const f = p.sys.find(s => s.fresh && !s.card.kw.includes('FT')); if (f) { t.ex = true; f.fresh = false; } }
    }

    const actors = p.sys.filter(s => !s.fresh || s.card.kw.includes('FT')).sort((a, b) => b.card.cap - a.card.cap);
    for (const s of actors) {
      if (!p.sys.includes(s) || s.ex) continue;
      const cuda = p.tools.find(t => t.card.name === 'CUDA' && !t.ex);
      let best = null;
      for (const t of o.sys.filter(t => t.ex)) {
        if (t.card.kw.includes('AUD') && s.card.trust < t.card.trust) continue;
        const need = t.card.trust - t.flags;
        const useCuda = s.card.cap < need && s.card.cap + 1 >= need && cuda;
        if (s.card.cap + (useCuda ? 1 : 0) < need) continue;
        const back = t.card.cap + (t.card.kw.includes('ADV') ? 1 : 0);
        const dies = s.flags + back >= s.card.trust;
        const v = t.card.tok * 1.5 + t.card.cost / 2 - (dies ? s.card.tok * 1.5 + s.card.cost / 2 : 0);
        if (!best || v > best.v) best = { t, v, useCuda, back };
      }
      const canTask = !s.blocked;
      const taskV = canTask ? s.card.tok : 0;
      if (best && best.v > taskV * 0.8) {
        const { t, useCuda, back } = best;
        if (useCuda) { cuda.ex = true; s.boost = 1; }
        s.ex = true;
        L(`  ${s.card.name} Audits ${t.card.name}`);
        t.flags += s.card.cap + s.boost; s.flags += back;
        checkDead(o, t, 'audit'); checkDead(p, s, 'audit');
      } else if (canTask) {
        s.ex = true; p.tokens += s.card.tok;
        if (drift(s) === 0) st.tokAligned += s.card.tok; else st.tokMis += s.card.tok;
        L(`  ${s.card.name} Runs a Task: +${s.card.tok} -> ${p.tokens}`);
        if (p.tokens >= 15) return true;
        const d = drift(s);
        if (d) { s.flags += d; L(`   drift +${d} Flag(s) on ${s.card.name} (${s.flags}/${s.card.trust})`); checkDead(p, s, 'drift'); }
        if (!p.sys.includes(s)) continue;
        if (s.card.name === 'Diffusion Model' && s.flags) s.flags--;
        if (s.card.name === 'Alignment') { const t = p.sys.filter(x => x !== s && x.flags).sort((x, y) => (y.flags / y.card.trust) - (x.flags / x.card.trust))[0]; if (t) t.flags--; }
        if (s.card.name === 'The Human Trainer' && p.ts < 9 && top(p)) { p.ts++; p.spent++; }
        if (s.card.name === 'Data Center') { p.ts = Math.max(0, p.ts - 1); p.spent = Math.min(p.spent, p.ts); }
        if (['Search Tree', 'Transformer'].includes(s.card.name)) draw(p);
        if (s.card.name === 'GPT') { draw(p); if (p.hand.length) { const d = p.hand.slice().sort((a, b) => value(a) - value(b))[0]; p.hand.splice(p.hand.indexOf(d), 1); p.disc.push(d); } }
      }
    }

    const ckpt = p.tools.find(t => t.card.name === 'Checkpoint' && !t.ex);
    if (ckpt) { const t = p.sys.filter(s => s.flags).sort((a, b) => (b.flags / b.card.trust) - (a.flags / a.card.trust))[0]; if (t) { ckpt.ex = true; t.flags--; } }
    const hitl = p.tools.find(t => t.card.name === 'Human-in-the-Loop' && !t.ex);
    if (hitl) {
      const t = p.sys.filter(s => s.flags).sort((a, b) => (b.flags / b.card.trust) - (a.flags / a.card.trust))[0];
      if (t) { hitl.ex = true; t.flags = Math.max(0, t.flags - 2); st.hitl++; L(`  Human-in-the-Loop cleans ${t.card.name}`); }
    }
    p.sys.forEach(s => s.blocked = false); p.recall = false;
    return false;
  }

  for (const p of P) {
    for (let i = 0; i < 5; i++) draw(p);
    const ok = p.hand.some(c => c.type === 'System' && c.cost <= 3) && p.hand.filter(c => c.trainable).length >= 2;
    if (!ok) { p.deck.push(...p.hand); p.hand = []; shuffle(p.deck); for (let i = 0; i < 5; i++) draw(p); L(`${p.label} mulligans`); }
  }
  draw(P[1 - firstIdx]); // second player's 6th card
  let cur = firstIdx;
  while (turn < 60) {
    if (turnFor(cur)) { L(`${P[cur].label} WINS ${P[cur].tokens}-${P[1 - cur].tokens}`); return { winner: cur, rounds: Math.ceil(turn / 2), score: [P[0].tokens, P[1].tokens], st }; }
    cur = 1 - cur;
  }
  return { winner: -1, rounds: 30, score: [P[0].tokens, P[1].tokens], st };
}

module.exports = { play, deckFor, seedRng, SUITNAME, CARDS };

if (require.main === module) {
  const mode = process.argv[2] || 'matrix';
  if (mode === 'sample') {
    seedRng(+process.argv[3] || 7);
    const log = [];
    play(deckFor(['K', 'R']), deckFor(['W', 'G']), true, 0, log);
    console.log(log.join('\n'));
    return;
  }
  seedRng(12345);
  const pairs = [];
  const su = ['G', 'B', 'K', 'W', 'R'];
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pairs.push([su[i], su[j]]);
  const N = 400;
  const summary = {};
  for (const align of [false, true]) {
    const wins = {}, games = {};
    const tot = { rounds: 0, n: 0, driftKills: 0, auditKills: 0, actionKills: 0, saves: 0, hitl: 0, tokAligned: 0, tokMis: 0, timeouts: 0 };
    for (let a = 0; a < pairs.length; a++) for (let b = a + 1; b < pairs.length; b++) {
      const ka = pairs[a].join('+'), kb = pairs[b].join('+');
      for (let g = 0; g < N; g++) {
        const r = play(deckFor(pairs[a]), deckFor(pairs[b]), align, g % 2);
        games[ka] = (games[ka] || 0) + 1; games[kb] = (games[kb] || 0) + 1;
        if (r.winner === 0) wins[ka] = (wins[ka] || 0) + 1; else if (r.winner === 1) wins[kb] = (wins[kb] || 0) + 1; else tot.timeouts++;
        tot.rounds += r.rounds; tot.n++;
        for (const k of Object.keys(r.st)) tot[k] += r.st[k];
      }
    }
    summary[align ? 'align' : 'base'] = { wins, games, tot };
  }
  const f = x => (x * 100).toFixed(0).padStart(3) + '%';
  console.log('Deck (size)          Base   Align  change');
  const keys = Object.keys(summary.base.games).sort((x, y) => summary.align.wins[y] / summary.align.games[y] - summary.align.wins[x] / summary.align.games[x]);
  for (const k of keys) {
    const b = (summary.base.wins[k] || 0) / summary.base.games[k], a = (summary.align.wins[k] || 0) / summary.align.games[k];
    const name = k.split('+').map(s => SUITNAME[s]).join('+');
    console.log(`${(name + ' (' + deckFor(k.split('+')).length + ')').padEnd(20)} ${f(b)}   ${f(a)}   ${((a - b) * 100 >= 0 ? '+' : '') + ((a - b) * 100).toFixed(0)}`);
  }
  for (const m of ['base', 'align']) {
    const t = summary[m].tot;
    console.log(`\n${m}: avg rounds ${(t.rounds / t.n).toFixed(1)}, per game: drift kills ${(t.driftKills / t.n).toFixed(2)}, audit kills ${(t.auditKills / t.n).toFixed(2)}, action kills ${(t.actionKills / t.n).toFixed(2)}, Model Card saves ${(t.saves / t.n).toFixed(2)}, HITL uses ${(t.hitl / t.n).toFixed(2)}, token share from aligned Systems ${(t.tokAligned / (t.tokAligned + t.tokMis) * 100).toFixed(0)}%, timeouts ${t.timeouts}`);
  }
  // Round 7 matchup head-to-head
  for (const align of [false, true]) {
    let w = 0, n = 4000, r = 0;
    for (let g = 0; g < n; g++) { const res = play(deckFor(['K', 'R']), deckFor(['W', 'G']), align, g % 2); if (res.winner === 0) w++; r += res.rounds; }
    console.log(`Round-7 matchup Black+Red vs White+Green, ${align ? 'Alignment' : 'Base'}: Black+Red wins ${(w / n * 100).toFixed(0)}%, avg ${(r / n).toFixed(1)} rounds`);
  }
}
