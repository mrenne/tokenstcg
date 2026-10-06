// Builds the Alpha Set page, <repo>/sample_cards/index.html. Card data comes from
// design/design-v1/print-sheet-source.html; each card is shown as its v2 render,
// assets/cards/<card-slug>.webp (made by render-card-images.js).
//   node tools/build-alpha-set.js
const fs = require('fs');
const path = require('path');
const { REPO } = require('./common');
const src = fs.readFileSync(path.join(REPO, 'design/design-v1/print-sheet-source.html'), 'utf8');
const slugOf = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const text = h => h.replace(/<[^>]+>/g, '').replace(/💾/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

// ---- extract each card element with a div-depth scan ----
const cards = [];
let pos = 0;
while ((pos = src.indexOf('<div class="card ', pos)) !== -1) {
  let depth = 0, i = pos;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = pos;
  let m;
  while ((m = re.exec(src))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) { i = re.lastIndex; break; }
  }
  const html = src.slice(pos, i);
  const cls = html.match(/^<div class="card ([^"]+)"/)[1].split(/\s+/);
  const suit = ['humans', 'repres', 'ml', 'ethics', 'impacts', 'any'].find(s => cls.includes(s));
  const name = html.match(/<h2[^>]*>([^<]+)<\/h2>/)[1];
  const typeText = html.match(/<div class="typebar"><span class="gem ?([a-z]*)"><\/span>([^<·]+)·/);
  const rarity = typeText[1] || 'common';
  const type = typeText[2].trim();
  const cost = html.match(/<div class="cost[^"]*">(\d+)</)[1];
  const stat = l => (html.match(new RegExp(`<div class="n">(\\d+)</div><div class="l">${l}`)) || [])[1];
  const tokens = (html.match(/<div class="dot"><\/div>/g) || []).length;
  const lines = [...html.matchAll(/<div class="tline"><b>([^<]+)<\/b>([\s\S]*?)<\/div>/g)].map(m => `${m[1]}: ${text(m[2])}`);
  const question = text((html.match(/<div class="tag">Discuss<\/div><p>([\s\S]*?)<\/p>/) || [])[1] || '');
  const statText = type === 'System' ? ` Capability ${stat('CAP')}, Trust ${stat('TRU')}, ${tokens} Token${tokens === 1 ? '' : 's'}.` : '';
  const legacy = html.includes('class="legacy"') ? ' Legacy Tool.' : '';
  const color = text(html.match(/<div class="typebar">([\s\S]*?)<\/div>/)[1]).split('·')[1].trim();
  const rarityName = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', chase: 'Chase' }[rarity];
  const alt = `${name}. ${type}, ${color}, ${rarityName}, cost ${cost}.${statText}${legacy} ${lines.join('. ')}. Discuss: ${question}`;
  cards.push({ slug: slugOf(name), alt: alt.replace(/\.\./g, '.'), suit, name, type, rarity, cost });
  pos = i;
}
if (cards.length !== 70) throw new Error('expected 70 cards, found ' + cards.length);

const SUITS = [
  ['humans', 'Humans and AI', 'var(--green)'],
  ['repres', 'Representation & Reasoning', 'var(--blue)'],
  ['ml', 'Machine Learning', 'var(--black)'],
  ['ethics', 'Ethical AI Design', 'var(--white)'],
  ['impacts', 'Societal Impacts', 'var(--red)'],
  ['any', 'Wildcard', 'conic-gradient(from 90deg,var(--chase-a),var(--chase-b),var(--chase-c),var(--chase-a))'],
];
const TYPES = ['System', 'Tool', 'Action', 'Dataset'];
const RARITY = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', chase: 'Chase' };
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const count = f => cards.filter(f).length;

function build() {
  const missing = cards.filter(c => !fs.existsSync(path.join(REPO, 'assets/cards', c.slug + '.webp')));
  if (missing.length) throw new Error('no card image for: ' + missing.map(c => c.name).join(', ') + ' (run tools/render-card-images.js)');

  const suitChips = SUITS.map(([k, label, sw]) =>
    `<button type="button" class="chip" id="f-suit-${k}" data-group="suit" data-value="${k}" aria-pressed="false"><span class="sw" style="background:${sw}"></span>${label}<span class="n">${count(c => c.suit === k)}</span></button>`).join('');
  const typeChips = TYPES.map(t =>
    `<button type="button" class="chip" id="f-type-${t.toLowerCase()}" data-group="type" data-value="${t}" aria-pressed="false">${t}<span class="n">${count(c => c.type === t)}</span></button>`).join('');
  const slots = cards.map((c, i) =>
    `<div class="slot" role="button" tabindex="0" data-i="${i}" data-suit="${c.suit}" data-type="${c.type}" aria-label="${esc(c.name)}: ${c.type}, ${RARITY[c.rarity]}, cost ${c.cost}"><img src="../assets/cards/${c.slug}.webp" width="600" height="840" loading="${i < 12 ? 'eager' : 'lazy'}" decoding="async" alt="${esc(c.alt)}"></div>`).join('\n');

  const head = `<title>Tokens Alpha Set</title>
<meta name="description" content="Every card in the Tokens TCG Alpha Set: ${cards.length} cards across five AI literacy suits.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
  :root{ --ground:#060913; --panel:#0f1426; --panel-2:#161c33; --rule:#232b47;
    --text:#eef2fb; --muted:#9aa6c4; --accent:#5ec8ff; --warm:#f0913f;
    --green:#45e3cf; --blue:#5cb8ff; --black:#b48cff; --white:#e2c06a; --red:#ff7c5e;   /* v2 card edge colors */
    --chase-a:#ffd76a; --chase-b:#ff7ad1; --chase-c:#7ad9ff; }
  html{ background:var(--ground); }
  body{ margin:0; background:var(--ground); color:var(--text); font-family:'Manrope',system-ui,sans-serif; font-size:15px; line-height:1.5;
    padding-inline:clamp(16px,4vw,48px); padding-block:0 64px; }
  .wrap{ max-width:1320px; margin:0 auto; }
  header.top{ display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:12px 32px; padding-block:clamp(28px,5vw,56px) 20px; }
  .brand{ display:flex; flex-direction:column; gap:6px; min-width:0; }
  .crumbs ol{ display:flex; flex-wrap:wrap; align-items:center; gap:6px 10px; margin:0; padding:0; list-style:none;
    font-family:'JetBrains Mono',ui-monospace,monospace; font-size:16px; letter-spacing:.06em; }
  .crumbs li{ display:flex; align-items:center; gap:10px; color:var(--muted); }
  .crumbs li + li::before{ content:"›"; color:var(--muted); font-size:18px; }
  .crumbs a{ display:inline-flex; align-items:center; min-height:44px; padding:0 10px; margin-left:-10px; color:var(--accent); font-weight:700; text-decoration:none; }   /* 44px-tall tap target */
  .crumbs a:hover{ text-decoration:underline; }
  .crumbs a:focus-visible{ outline:2px solid var(--accent); outline-offset:3px; border-radius:3px; }
  .crumbs [aria-current="page"]{ color:var(--text); }
  h1{ margin:0; font-family:'Baloo 2',system-ui,sans-serif; font-weight:800; font-size:clamp(40px,7vw,72px); line-height:.95; letter-spacing:.005em; text-wrap:balance; }
  .lede{ margin:0; max-width:60ch; color:var(--muted); font-size:16px; text-wrap:pretty; }
  .tally{ font-family:'JetBrains Mono',ui-monospace,monospace; font-size:13px; color:var(--muted); white-space:nowrap; font-variant-numeric:tabular-nums; }
  .tally b{ color:var(--text); font-weight:700; }
  .filters{ position:sticky; top:env(safe-area-inset-top,0px); z-index:20; display:grid; gap:10px; padding-block:14px; margin-bottom:24px;
    background:linear-gradient(var(--ground) 82%, transparent); }
  .frow{ display:flex; flex-wrap:wrap; align-items:center; gap:8px; }
  .flabel{ font-family:'JetBrains Mono',ui-monospace,monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); width:4.5em; flex:none; }
  .chip{ display:inline-flex; align-items:center; gap:8px; min-height:36px; padding:6px 12px; border-radius:999px; border:1px solid var(--rule);
    background:var(--panel); color:var(--text); font:600 13.5px/1.2 'Manrope',system-ui,sans-serif; cursor:pointer; transition:background .15s,border-color .15s; }
  .chip:hover{ background:var(--panel-2); border-color:#34406a; }
  .chip[aria-pressed="true"]{ background:#15233d; border-color:var(--accent); box-shadow:inset 0 0 0 1px var(--accent); }
  .chip .sw{ width:12px; height:12px; border-radius:3px; box-shadow:0 0 0 1px rgba(255,255,255,.28); flex:none; }
  .chip .n{ font-family:'JetBrains Mono',ui-monospace,monospace; font-size:11.5px; color:var(--muted); font-variant-numeric:tabular-nums; }
  .chip[aria-pressed="true"] .n{ color:var(--accent); }
  .chip.all[aria-pressed="true"]::before{ content:""; width:7px; height:7px; border-radius:50%; background:var(--warm); }
  .chip:focus-visible, .slot:focus-visible, .lb button:focus-visible{ outline:2px solid var(--accent); outline-offset:3px; }
  .grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,232px),1fr)); gap:clamp(16px,2vw,28px); }
  .slot{ position:relative; aspect-ratio:5/7; max-width:100%; border-radius:7.5%/5.3%; cursor:zoom-in; transition:transform .18s ease; }
  .slot:hover{ transform:translateY(-4px); }
  .slot img{ display:block; width:100%; height:auto; pointer-events:none; }
  .empty{ grid-column:1/-1; padding:48px 0; text-align:center; color:var(--muted); }
  footer{ margin-top:48px; padding-top:20px; border-top:1px solid var(--rule); color:var(--muted); font-size:13px; max-width:70ch; }
  footer p{ margin:0 0 10px; }
  footer .license a{ color:var(--accent); font-weight:700; }
  /* lightbox */
  .lb{ border:0; padding:0; background:transparent; max-width:100vw; max-height:100vh; width:100vw; height:100vh; margin:0; color:var(--text); }
  .lb::backdrop{ background:rgba(3,5,12,.86); }
  .lb-inner{ height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:max(16px,env(safe-area-inset-top,0px)) 16px max(16px,env(safe-area-inset-bottom,0px)); box-sizing:border-box; }
  .lb-stage{ position:relative; }
  .lb-stage img{ display:block; width:100%; height:100%; }
  .lb-stage.wobble{ animation:wobble .7s cubic-bezier(.3,.7,.4,1) both; }
  @keyframes wobble{
    0%{ transform:scale(.82) rotate(-7deg); opacity:0; }
    30%{ transform:scale(1.03) rotate(5deg); opacity:1; }
    50%{ transform:scale(.99) rotate(-3deg); }
    68%{ transform:scale(1.01) rotate(1.6deg); }
    84%{ transform:rotate(-.6deg); }
    100%{ transform:none; }
  }
  .lb-bar{ display:flex; align-items:center; gap:10px; }
  .lb button{ min-height:40px; padding:8px 16px; border-radius:999px; border:1px solid var(--rule); background:var(--panel); color:var(--text); font:600 14px 'Manrope',system-ui,sans-serif; cursor:pointer; }
  .lb button:hover{ background:var(--panel-2); }
  .lb-pos{ font-family:'JetBrains Mono',ui-monospace,monospace; font-size:12.5px; color:var(--muted); min-width:6.5em; text-align:center; font-variant-numeric:tabular-nums; }
  @media (prefers-reduced-motion: reduce){ .slot, .chip{ transition:none; } .slot:hover{ transform:none; } .lb-stage.wobble{ animation:none; } }
</style>`;

  const body = `<div class="wrap">
  <header class="top">
    <div class="brand">
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="../">Home</a></li><li><span aria-current="page">Alpha Set</span></li></ol></nav>
      <h1>Alpha Set</h1>
      <p class="lede">Every card in the Alpha Set, the first set of Tokens cards: AI concepts from the five AI4K12 big ideas, each with a plain-language definition and a question to talk about. Tap a card to read it up close.</p>
    </div>
    <div class="tally" id="tally" aria-live="polite">Showing <b>${cards.length}</b> of ${cards.length} cards</div>
  </header>
  <nav class="filters" aria-label="Filter cards">
    <div class="frow"><span class="flabel">Color</span><button type="button" class="chip all" id="f-suit-all" data-group="suit" data-value="" aria-pressed="true">All</button>${suitChips}</div>
    <div class="frow"><span class="flabel">Type</span><button type="button" class="chip all" id="f-type-all" data-group="type" data-value="" aria-pressed="true">All</button>${typeChips}</div>
  </nav>
  <main class="grid" id="grid">
${slots}
    <p class="empty" id="empty" hidden>No cards match both filters. Choose a different color or type.</p>
  </main>
  <footer>
    <p>Alpha Set, ${cards.length} cards. Stats are still being tuned through playtesting, so costs and numbers may change before the cards are printed.</p>
    <p class="license"><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license">CC BY-NC-SA 4.0</a> · The Tokens TCG Alpha Set is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International: you may share and adapt these cards for non-commercial use, with credit, under the same license.</p>
  </footer>
</div>
<dialog class="lb" id="lb" aria-label="Card detail">
  <div class="lb-inner">
    <div class="lb-stage" id="lb-stage"></div>
    <div class="lb-bar">
      <button type="button" id="lb-prev" aria-label="Previous card">Prev</button>
      <span class="lb-pos" id="lb-pos"></span>
      <button type="button" id="lb-next" aria-label="Next card">Next</button>
      <button type="button" id="lb-close">Close</button>
    </div>
  </div>
</dialog>
<script>
(function(){
  var grid = document.getElementById('grid');
  var slots = Array.prototype.slice.call(grid.querySelectorAll('.slot'));
  var tally = document.getElementById('tally');
  var empty = document.getElementById('empty');
  var filter = { suit:'', type:'' };

  function apply(){
    var shown = 0;
    slots.forEach(function(s){
      var ok = (!filter.suit || s.dataset.suit === filter.suit) && (!filter.type || s.dataset.type === filter.type);
      s.hidden = !ok; if(ok) shown++;
    });
    empty.hidden = shown > 0;
    tally.innerHTML = 'Showing <b>' + shown + '</b> of ' + slots.length + ' cards';
  }
  document.querySelectorAll('.chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      var g = chip.dataset.group;
      filter[g] = chip.dataset.value;
      document.querySelectorAll('.chip[data-group="' + g + '"]').forEach(function(c){ c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      apply();
    });
  });

  var lb = document.getElementById('lb'), stage = document.getElementById('lb-stage'), pos = document.getElementById('lb-pos');
  var current = -1;
  function visible(){ return slots.filter(function(s){ return !s.hidden; }); }
  function sizeLb(){
    var s = Math.min((window.innerWidth - 32) / 600, (window.innerHeight - 110) / 840, 1);
    stage.style.width = (600 * s) + 'px'; stage.style.height = (840 * s) + 'px';
  }
  function show(slot){
    current = slots.indexOf(slot);
    stage.innerHTML = '';
    var im = slot.querySelector('img').cloneNode(true);
    im.loading = 'eager';
    stage.appendChild(im);
    var v = visible();
    pos.textContent = (v.indexOf(slot) + 1) + ' / ' + v.length;
    lb.setAttribute('aria-label', slot.getAttribute('aria-label'));
    sizeLb();
    stage.classList.remove('wobble'); void stage.offsetWidth; stage.classList.add('wobble');
  }
  function step(d){
    var v = visible(), i = v.indexOf(slots[current]);
    if(i < 0) return;
    show(v[(i + d + v.length) % v.length]);
  }
  slots.forEach(function(slot){
    slot.addEventListener('click', function(){ show(slot); if(!lb.open) lb.showModal(); });
    slot.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); show(slot); if(!lb.open) lb.showModal(); } });
  });
  document.getElementById('lb-prev').addEventListener('click', function(){ step(-1); });
  document.getElementById('lb-next').addEventListener('click', function(){ step(1); });
  document.getElementById('lb-close').addEventListener('click', function(){ lb.close(); });
  lb.addEventListener('click', function(e){ if(e.target === lb || e.target.classList.contains('lb-inner')) lb.close(); });
  lb.addEventListener('keydown', function(e){ if(e.key === 'ArrowLeft') step(-1); if(e.key === 'ArrowRight') step(1); });
  lb.addEventListener('close', function(){ if(slots[current]) slots[current].focus(); });
  window.addEventListener('resize', function(){ if(lb.open) sizeLb(); });
})();
</script>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%83%8F%3C/text%3E%3C/svg%3E">
${head}
</head>
<body>
${body}
</body>
</html>
`;
}

fs.mkdirSync(path.join(REPO, 'sample_cards'), { recursive: true });
fs.writeFileSync(path.join(REPO, 'sample_cards/index.html'), build());
console.log('cards', cards.length, 'types', TYPES.map(t => t + ':' + count(c => c.type === t)).join(' '),
  'suits', SUITS.map(([k]) => k + ':' + count(c => c.suit === k)).join(' '));
