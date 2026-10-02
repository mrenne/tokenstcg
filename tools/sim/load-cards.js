// Loads the live card pool from design/pilot-deck-60-cards.md into the simulator's CARDS array
// (Chase cards are left out, as they are of base decks).
//   node tools/sim/load-cards.js   prints a summary of what was loaded
const fs = require('fs');
const { CARDS } = require('./quickplay.js');
const MD = require('path').join(require('../common').REPO, 'design/pilot-deck-60-cards.md');
const SUIT = { 'Humans and AI (green)': 'G', 'Representation and Reasoning (blue)': 'B', 'Machine Learning (black)': 'K', 'Ethical AI System Design and Programming (white)': 'W', 'Societal Impacts of AI (red)': 'R' };

function load() {
  const text = fs.readFileSync(MD, 'utf8');
  const out = [];
  let suit = null;
  for (const line of text.split('\n')) {
    const h = line.match(/^## (.+?) —/);
    if (h) { suit = SUIT[h[1]] || null; continue; }
    if (!suit || !line.startsWith('|') || line.startsWith('|---') || line.startsWith('| Card |')) continue;
    const cells = line.split(/(?<!\\)\|/).slice(1, -1).map(s => s.trim());
    if (cells.length !== 7) continue;
    let [name, type, rar, stats, ability] = cells;
    name = name.replace(/\*\*/g, '');
    rar = rar.replace(/\*\*/g, '');
    if (rar === 'Ch') continue; // Chase card isn't in base decks
    const kw = [];
    if (/\*\*Fast-Tracked\.\*\*/.test(ability)) kw.push('FT');
    if (/\*\*Highly Trusted\.\*\*/.test(ability)) kw.push('AUD');
    if (/\*\*Adversarial\.\*\*/.test(ability)) kw.push('ADV');
    if (/\*\*Legacy\.\*\*/.test(ability)) kw.push('LEG');
    const m = stats.match(/^(\d+)(?:\s*\\\|\s*(\d+)\/(\d+)\/(\d+))?/);
    if (!m) throw new Error('stats: ' + line);
    const card = { name, suit, type: type === 'Dataset' ? 'Dataset' : type, rar, cost: +m[1], kw, trainable: rar === 'C' || rar === 'U' };
    if (type === 'System') { card.cap = +m[2]; card.trust = +m[3]; card.tok = +m[4]; }
    out.push(card);
  }
  CARDS.length = 0;
  CARDS.push(...out);
  return out;
}
module.exports = { load };
if (require.main === module) {
  const c = load();
  console.log('loaded', c.length, 'cards (Chase excluded)');
  const by = k => c.filter(x => x.suit === k).length;
  console.log('G', by('G'), 'B', by('B'), 'K', by('K'), 'W', by('W'), 'R', by('R'));
  console.log('keywords:', c.filter(x => x.kw.length).map(x => x.name + '[' + x.kw + ']').join(', '));
}
