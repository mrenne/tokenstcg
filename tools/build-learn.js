// Builds the "Look up your card" pages:
//   learn/index.html          type a card's number (printed on it, e.g. 24/70) or name to find its page
//   learn/<card-slug>/        one page per card: what it means, in real life, try it, Discuss, in the game
// Card data comes from design/design-v1/print-sheet-source.html; the extra "In real life" and "Try it"
// text comes from design/learn-content.json. Card images are assets/cards/<card-slug>.webp.
//   node tools/build-learn.js
const fs = require('fs');
const path = require('path');
const { REPO, cardOrder } = require('./common');

const src = fs.readFileSync(path.join(REPO, 'design/design-v1/print-sheet-source.html'), 'utf8');
const content = JSON.parse(fs.readFileSync(path.join(REPO, 'design/learn-content.json'), 'utf8'));
const OUT = path.join(REPO, 'learn');

const COLORS = {
  humans:  { name: 'Green', idea: 'Humans and AI', about: 'how people and AI work together, and who builds AI', sw: '#45e3cf' },
  repres:  { name: 'Blue', idea: 'Representation & Reasoning', about: 'how AI stores knowledge about the world and reasons with it', sw: '#5cb8ff' },
  ml:      { name: 'Black', idea: 'Machine Learning', about: 'how AI learns from data, and the computers it runs on', sw: '#b48cff' },
  ethics:  { name: 'White', idea: 'Ethical AI Design', about: 'how to build AI that is fair, safe, and trustworthy', sw: '#e2c06a' },
  impacts: { name: 'Red', idea: 'Societal Impacts', about: 'how AI changes people\'s lives, communities, and the planet', sw: '#ff7c5e' },
  any:     { name: 'Chase', idea: 'Any color', about: 'the rarest cards, which fit in any deck', sw: 'conic-gradient(#ffd76a,#ff7ad1,#7ad9ff,#ffd76a)' },
};
const RARITY = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', chase: 'Chase' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const text = h => h.replace(/<span class="legacy"[^>]*>[^<]*<\/span>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
// game text in plain words: "{E}" is "turn this card sideways"; the floppy is the Legacy marker
const KEYWORDS = {
  'Fast-Tracked.': 'Fast-Tracked: it can act the same turn you play it.',
  'Highly Trusted.': 'Highly Trusted: a System with lower Trust can\'t Audit it.',
  'Adversarial.': 'Adversarial: when it\'s Audited, it hits back with 1 extra Flag.',
  'Attention.': 'Attention:',
};
const plainRules = s => s.replace(/(Fast-Tracked|Highly Trusted|Adversarial|Attention)\./g, k => KEYWORDS[k])
  .replace(/Big Data (\d+) \(or pay by turning a Cost \d+\+ System sideways\)\./g, (m, n) => `Big Data ${n}: instead of paying Data, you may turn one of your Systems that costs ${n} or more sideways.`)
  .replace(/\{E\}\s*—\s*/g, 'Turn this card sideways to ').replace(/💾\s*/g, '').replace(/Turn this card sideways to (\w)/, (m, c) => 'Turn this card sideways to ' + c.toLowerCase());

// ---- read every card, in card-number order ----
const order = cardOrder();
const blocks = src.split('<div class="cutwrap">').slice(1);
const cards = blocks.map((b, i) => {
  const o = order[i];
  const typebar = b.match(/<div class="typebar"><span class="gem ?([a-z]*)"><\/span>([\s\S]*?)<\/div>/);
  const stat = l => (b.match(new RegExp(`<div class="n">(\\d+)</div><div class="l">${l}`)) || [])[1];
  const lines = [...b.matchAll(/<div class="tline"><b>([^<]+)<\/b>([\s\S]*?)<\/div>/g)].map(m => ({ label: m[1], text: text(m[2]) }));
  const extra = content[o.slug];
  if (!extra) throw new Error(`no learn content for ${o.name} (add "${o.slug}" to design/learn-content.json)`);
  return {
    n: i + 1, name: o.name, slug: o.slug, suit: o.suit,
    type: text(typebar[2]).split('·')[0].trim(),
    rarity: typebar[1] || 'common',
    cost: (b.match(/<div class="cost[^"]*">(\d+)</) || [])[1],
    trainable: /<div class="cost trainable">/.test(b),
    cap: stat('CAP'), trust: stat('TRU'),
    tokens: (b.match(/<div class="dot"><\/div>/g) || []).length,
    legacy: b.includes('class="legacy"'),
    definition: (lines.find(l => l.label === 'Definition') || {}).text || '',
    rule: lines.filter(l => l.label !== 'Definition').map(l => plainRules(l.text)).join(' '),
    question: text((b.match(/<div class="tag">Discuss<\/div><p>([\s\S]*?)<\/p>/) || [])[1] || ''),
    ...extra,
  };
});
const TOTAL = cards.length;

const head = (title, desc, depth) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%83%8F%3C/text%3E%3C/svg%3E">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap">
<link rel="stylesheet" href="${depth}learn.css">
</head>
<body>
<div class="wrap">`;

const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) =>
  i === items.length - 1 ? `<li><span aria-current="page">${esc(it[0])}</span></li>` : `<li><a href="${it[1]}">${esc(it[0])}</a></li>`).join('')}</ol></nav>`;

const footer = depth => `<footer><p>Part of the <a href="${depth}../sample_cards/">Tokens TCG Alpha Set</a>, an unplugged card game about AI. The Alpha Set is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license">CC BY-NC-SA 4.0</a>. Nothing you do on these pages is saved or sent anywhere.</p></footer>
</div>`;

// ---- shared stylesheet ----
const css = `:root{ --ground:#060913; --panel:#0f1426; --panel-2:#161c33; --rule:#232b47; --text:#eef2fb; --muted:#9aa6c4; --accent:#5ec8ff; --warm:#f0913f; }
*{ box-sizing:border-box; }
html{ background:var(--ground); }
body{ margin:0; background:var(--ground); color:var(--text); font:16px/1.55 'Manrope',system-ui,sans-serif; padding:0 clamp(16px,5vw,40px) 56px; }
.wrap{ max-width:760px; margin:0 auto; }
a{ color:var(--accent); }
:focus-visible{ outline:2px solid var(--accent); outline-offset:3px; border-radius:3px; }
.crumbs{ padding-top:clamp(12px,3vw,28px); }
.crumbs ol{ display:flex; flex-wrap:wrap; align-items:center; gap:6px 10px; margin:0; padding:0; list-style:none; font:16px/1 'JetBrains Mono',ui-monospace,monospace; letter-spacing:.04em; }
.crumbs li{ display:flex; align-items:center; gap:10px; color:var(--muted); }
.crumbs li + li::before{ content:"›"; font-size:18px; }
.crumbs a{ display:inline-flex; align-items:center; min-height:44px; padding:0 10px; margin-left:-10px; font-weight:700; text-decoration:none; }
.crumbs a:hover{ text-decoration:underline; }
.crumbs [aria-current="page"]{ color:var(--text); }
h1{ margin:4px 0 10px; font:800 clamp(38px,8vw,60px)/1 'Baloo 2',system-ui,sans-serif; text-wrap:balance; }
h2{ margin:0 0 8px; font:800 24px/1.15 'Baloo 2',system-ui,sans-serif; }
p{ margin:0 0 12px; }
.lede{ color:var(--muted); font-size:18px; max-width:56ch; }
.muted{ color:var(--muted); }
.kicker{ font:700 12px/1 'JetBrains Mono',monospace; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
.sw{ display:inline-block; width:12px; height:12px; border-radius:3px; margin-right:8px; vertical-align:-1px; box-shadow:0 0 0 1px rgba(255,255,255,.28); }
footer{ margin-top:48px; padding-top:16px; border-top:1px solid var(--rule); color:var(--muted); font-size:13px; }

/* lookup page */
.find{ display:flex; flex-wrap:wrap; gap:10px; margin:22px 0 8px; }
.find input{ flex:1 1 240px; min-height:56px; padding:0 18px; border-radius:14px; border:1.5px solid var(--rule); background:var(--panel); color:var(--text);
  font:700 20px/1 'Manrope',sans-serif; }
.find input:focus{ border-color:var(--accent); outline:none; box-shadow:0 0 0 3px rgba(94,200,255,.25); }
.find button{ min-height:56px; padding:0 26px; border-radius:14px; border:0; background:var(--accent); color:#06122a; font:800 18px/1 'Manrope',sans-serif; cursor:pointer; }
.hint{ color:var(--muted); font-size:14px; }
.msg{ min-height:24px; color:#ffb4a8; font-weight:700; }
.group{ margin-top:30px; }
.group h2{ display:flex; align-items:center; font-size:21px; }
.group p{ color:var(--muted); font-size:15px; margin-bottom:10px; }
.list{ display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr)); gap:8px; margin:0; padding:0; list-style:none; }
.list a{ display:flex; align-items:center; gap:10px; min-height:48px; padding:0 14px; border-radius:12px; background:var(--panel); border:1px solid var(--rule); color:var(--text); text-decoration:none; font-weight:700; }
.list a:hover{ border-color:var(--accent); }
.list .no{ font:700 13px/1 'JetBrains Mono',monospace; color:var(--muted); min-width:2.2em; }

/* card page */
.top{ display:grid; grid-template-columns:minmax(0,230px) 1fr; gap:clamp(18px,4vw,36px); align-items:start; margin-top:14px; }
.top img{ width:100%; height:auto; display:block; border-radius:12px; box-shadow:0 14px 40px rgba(0,0,0,.45); }
.meta{ display:flex; flex-wrap:wrap; gap:8px; margin:6px 0 14px; }
.meta > span{ display:inline-flex; align-items:center; min-height:30px; padding:0 12px; border-radius:999px; background:var(--panel); border:1px solid var(--rule); font-size:14px; font-weight:700; }
.def{ font-size:clamp(19px,2.6vw,22px); line-height:1.45; font-weight:600; }
section{ margin-top:26px; }
.box{ background:var(--panel); border:1px solid var(--rule); border-radius:18px; padding:18px 20px; }
.box.try{ border-color:rgba(240,145,63,.45); background:rgba(240,145,63,.08); }
.box.talk{ background:linear-gradient(135deg,rgba(255,215,106,.10),rgba(255,122,209,.10),rgba(122,217,255,.10)); border-color:rgba(255,255,255,.12); }
.box.talk p.q{ font:800 22px/1.3 'Baloo 2',sans-serif; margin:0; }
.box p:last-child{ margin-bottom:0; }
.lab{ display:inline-flex; align-items:center; min-height:48px; padding:0 22px; border-radius:999px; background:var(--accent); color:#06122a; font-weight:800; text-decoration:none; margin-top:12px; }
.nav{ display:flex; justify-content:space-between; gap:10px; margin-top:32px; flex-wrap:wrap; }
.nav a{ display:inline-flex; align-items:center; min-height:48px; padding:0 18px; border-radius:999px; border:1.5px solid rgba(94,200,255,.5); color:var(--text); text-decoration:none; font-weight:700; }
.nav a:hover{ background:var(--panel-2); }
@media (max-width:560px){ .top{ grid-template-columns:1fr; } .top img{ max-width:230px; margin:0 auto; } }
`;

// ---- lookup page ----
function lookupPage() {
  const groups = Object.entries(COLORS).map(([suit, c]) => {
    const list = cards.filter(x => x.suit === suit);
    if (!list.length) return '';
    return `<div class="group"><h2><span class="sw" style="background:${c.sw}"></span>${c.name}: ${esc(c.idea)}</h2><p>Cards about ${esc(c.about)}.</p>
<ul class="list">${list.map(x => `<li><a href="${x.slug}/"><span class="no">${x.n}</span>${esc(x.name)}</a></li>`).join('')}</ul></div>`;
  }).join('\n');
  const index = cards.map(x => ({ n: x.n, name: x.name, slug: x.slug }));
  return `${head('Look Up Your Card · Tokens', 'Type the number or name on any Tokens card to learn more about the AI idea behind it.', '')}
${crumbs([['Home', '../'], ['Look Up Your Card']])}
<header>
  <h1>Look up your card</h1>
  <p class="lede">Every card has a number in its bottom-right corner, like <b>24/${TOTAL}</b>. Type the number or the card's name to learn more about the AI idea on it.</p>
</header>
<form class="find" id="find" role="search" aria-label="Find a card">
  <label class="kicker" for="q" style="flex-basis:100%">Card number or name</label>
  <input id="q" name="q" list="names" autocomplete="off" inputmode="text" placeholder="e.g. 24 or Classifier" required>
  <button type="submit">Find it</button>
</form>
<datalist id="names">${cards.map(x => `<option value="${esc(x.name)}"></option>`).join('')}</datalist>
<p class="msg" id="msg" role="status" aria-live="polite"></p>
<p class="hint">Or browse every card by color:</p>
${groups}
${footer('')}
<script>
(function(){
  var CARDS = ${JSON.stringify(index)};
  var norm = function(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g, ''); };
  document.getElementById('find').addEventListener('submit', function(e){
    e.preventDefault();
    var q = document.getElementById('q').value.trim(), msg = document.getElementById('msg'), hit = null;
    var num = q.match(/^#?\\s*(\\d{1,3})(\\s*\\/\\s*\\d+)?$/);
    if (num) hit = CARDS.filter(function(c){ return c.n === +num[1]; })[0];
    if (!hit && q) {
      var k = norm(q);
      hit = CARDS.filter(function(c){ return norm(c.name) === k; })[0] || CARDS.filter(function(c){ return norm(c.name).indexOf(k) >= 0; })[0];
    }
    if (hit) { location.href = hit.slug + '/'; return; }
    msg.textContent = num ? 'There\\'s no card number ' + num[1] + ' yet. The Alpha Set has cards 1 to ${TOTAL}.' : 'No card matches "' + q + '". Check the spelling, or browse below.';
  });
})();
</script>
</body>
</html>
`;
}

// ---- one card page ----
function cardPage(c, i) {
  const col = COLORS[c.suit];
  const prev = cards[(i - 1 + TOTAL) % TOTAL], next = cards[(i + 1) % TOTAL];
  const meta = [
    `<span><span class="sw" style="background:${col.sw}"></span>${c.suit === 'any' ? 'Any color' : col.name}</span>`,
    `<span>${esc(c.type)}</span>`,
    `<span>${RARITY[c.rarity]}</span>`,
    `<span>Card ${c.n}/${TOTAL}</span>`,
  ].join('');
  const stats = c.cap ? ` It has <b>Capability ${c.cap}</b> (how hard it hits) and <b>Trust ${c.trust}</b> (how many Flags it can take), and scores <b>${c.tokens} Token${c.tokens === 1 ? '' : 's'}</b> each time it Runs a Task.` : '';
  const legacy = c.legacy ? ' It\'s a <b>Legacy</b> Tool: old tech that a Tool-removal card can discard for a bonus card.' : '';
  const lab = c.lab && fs.existsSync(path.join(OUT, c.slug, c.lab, 'index.html'))
    ? `<a class="lab" href="${c.lab}">Try the hands-on lab</a>` : '';
  return `${head(`${c.name} · Tokens`, `${c.name}: ${c.definition}`, '../')}
${crumbs([['Home', '../../'], ['Look Up Your Card', '../'], [c.name]])}
<div class="top">
  <img src="../../assets/cards/${c.slug}.webp" width="600" height="840" alt="The ${esc(c.name)} card">
  <div>
    <p class="kicker">${esc(col.idea)}</p>
    <h1>${esc(c.name)}</h1>
    <div class="meta">${meta}</div>
    <p class="def">${esc(c.definition)}</p>
  </div>
</div>

<section aria-labelledby="real"><div class="box">
  <h2 id="real">In real life</h2>
  <p>${esc(c.example)}</p>
</div></section>

<section aria-labelledby="try"><div class="box try">
  <h2 id="try">Try it (2 minutes)</h2>
  <p>${esc(c.try)}</p>
  ${lab}
</div></section>

<section aria-labelledby="talk"><div class="box talk">
  <h2 id="talk">Talk about it</h2>
  <p class="q">${esc(c.question)}</p>
</div></section>

<section aria-labelledby="game">
  <h2 id="game">In the game</h2>
  <p class="muted">${c.rule ? esc(c.rule) + ' ' : ''}It costs <b>${c.cost} Data</b> to play${c.trainable ? ', and you can put it in your Training Set' : ', and it can\'t go in your Training Set'}.${stats}${legacy} <a href="../../how_to_play/">How to play</a></p>
</section>

<nav class="nav" aria-label="More cards">
  <a href="../${prev.slug}/">← ${esc(prev.name)}</a>
  <a href="../">All cards</a>
  <a href="../${next.slug}/">${esc(next.name)} →</a>
</nav>
${footer('../')}
</body>
</html>
`;
}

// ---- write everything ----
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'learn.css'), css);
fs.writeFileSync(path.join(OUT, 'index.html'), lookupPage());
// remove pages for cards that no longer exist
for (const d of fs.readdirSync(OUT)) {
  const p = path.join(OUT, d);
  if (fs.statSync(p).isDirectory() && !cards.some(c => c.slug === d)) fs.rmSync(p, { recursive: true });
}
cards.forEach((c, i) => {
  fs.mkdirSync(path.join(OUT, c.slug), { recursive: true });
  fs.writeFileSync(path.join(OUT, c.slug, 'index.html'), cardPage(c, i));
});
const labs = cards.filter(c => c.lab && fs.existsSync(path.join(OUT, c.slug, c.lab, 'index.html'))).length;
console.log(`learn/: lookup page + ${cards.length} card pages (${labs} with a lab link)`);
