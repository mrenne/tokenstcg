// Builds cards in the v2 frame from the card data in design/design-v1/print-sheet-source.html.
//
//   node design/frame-v2/build-card.js "The Human Trainer"          one card, in its own color
//   node design/frame-v2/build-card.js "The Human Trainer" repres   same card, recolored (palette test)
//   node design/frame-v2/build-card.js --all                        every card, each in its own color
//   node design/frame-v2/build-card.js --all --icon=sample-flower.jpg preview one image on every card
//                                                                    (writes preview-*.html, not proof-*.html)
//
// Card icons live in design/icons/. A card uses the icon named in design/icons/icons.json
// ({ "The Human Trainer": "cubes.png", ... }), or else a file named after the card
// (the-human-trainer.png). Cards with no icon show just their background art.
// Transparent PNG/SVG/WebP icons sit directly on the art; photos and paintings (JPG or opaque PNG) fill
// the whole art window in place of the abstract background.
//
// Writes design/frame-v2/proof-<card>-<color>.html (750x1050, the print size at 300 DPI).
// To render a PNG, open the HTML in Chrome, or run headless Chrome:
//   chrome --headless --window-size=830,1130 --screenshot=out.png design/frame-v2/proof-....html
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..', '..');
const OUT = path.join(REPO, 'design/frame-v2');
const src = fs.readFileSync(path.join(REPO, 'design/design-v1/print-sheet-source.html'), 'utf8');

function readCard(name) {
  const i = src.search(new RegExp(`<h2[^>]*>${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h2>`));
  if (i < 0) throw new Error('card not found: ' + name);
  const start = src.lastIndexOf('<div class="card ', i);
  const re = /<div\b|<\/div>/g; re.lastIndex = start;
  let depth = 0, m, end = start;
  while ((m = re.exec(src))) { depth += m[0] === '</div>' ? -1 : 1; if (depth === 0) { end = re.lastIndex; break; } }
  const h = src.slice(start, end);
  const pick = (r, d = '') => (h.match(r) || [])[1] ?? d;
  const cls = pick(/^<div class="card ([^"]+)"/).split(/\s+/);
  const lines = [...h.matchAll(/<div class="tline"><b>([^<]+)<\/b>([\s\S]*?)<\/div>/g)].map(x => ({ label: x[1], html: x[2] }));
  return {
    name,
    suit: ['humans', 'repres', 'ml', 'ethics', 'impacts', 'any'].find(s => cls.includes(s)),
    cost: +pick(/<div class="cost[^"]*">(\d+)</),
    trainable: /<div class="cost trainable">/.test(h),
    tokens: (h.match(/<div class="dot"><\/div>/g) || []).length,
    cap: pick(/<div class="n">(\d+)<\/div><div class="l">CAP/),
    trust: pick(/<div class="n">(\d+)<\/div><div class="l">TRU/),
    rarity: pick(/<span class="gem ?([a-z]*)"><\/span>/) || 'common',
    typeText: pick(/<span class="gem[^"]*"><\/span>([^<]+)</).trim(),
    lines,
    question: pick(/<div class="tag">Discuss<\/div><p>([^<]+)<\/p>/),
  };
}

const RARITY_LETTER = { common: 'C', uncommon: 'U', rare: 'R', chase: '★' };
// Per-color palettes. Only green is tuned for this proof; the rest follow once the look is approved.
const SUIT_LABEL = { humans: 'Humans and AI', repres: 'Rep. & Reasoning', ml: 'Machine Learning', ethics: 'Ethical AI Design', impacts: 'Societal Impacts', any: 'Any Data Type' };
const DARK_INK = { ink: '#ffffff', typeInk: '#ffffff', headInk: '#ffffff', statInk: '#ffffff', discussInk: '#ffffff', discussShadow: '0 2px 3px rgba(18,28,70,.75), 0 0 14px rgba(18,28,70,.35)' };
const PALETTES = {
  humans: { ...DARK_INK, art: 'humans', edge: '#45e3cf', outerA: '#0c3a36', outerB: '#062624', body1: '#136157', body2: '#0a3d38', head: '#0b3a37',
    panel1: 'rgba(104,200,188,.50)', panel2: 'rgba(33,104,98,.80)', label: '#8ff2e3', bracket: '#7ef0df', circuit: '#45e3cf',
    gem1: '#8ff8ea', gem2: '#1f9a8e', gem3: '#0b4a45', gemIn: '#0c4843', gemStroke: '#72ecdc', gemEdge: '#c9fff6',
    statA: '#1d6f55', statB: '#0b3a2c', statBorder: '#d6fff4', ledgeA: '#1b6a4a', ledgeB: '#0e4332',
    discussBg: 'linear-gradient(115deg,#93a6e6 0%,#7fc4d3 32%,#a9ade9 58%,#79cfc0 82%,#9c8fdb 100%)', discussBorder: 'rgba(228,244,255,.95)', discussBracket: '#e6f6ff', discussTag: '#e3fbff' },
  repres: { ...DARK_INK, art: 'repres', edge: '#5cb8ff', outerA: '#0b2448', outerB: '#061631', body1: '#17467f', body2: '#0b2448', head: '#0a2344',
    panel1: 'rgba(110,170,240,.45)', panel2: 'rgba(24,66,132,.82)', label: '#a6d4ff', bracket: '#8fcaff', circuit: '#5cb8ff',
    gem1: '#a9daff', gem2: '#2f72d4', gem3: '#0c2a5a', gemIn: '#0c2a5a', gemStroke: '#8cc6ff', gemEdge: '#dcefff',
    statA: '#1f559c', statB: '#0a2448', statBorder: '#dcecff', ledgeA: '#1f4f8f', ledgeB: '#0d2b55',
    discussBg: 'linear-gradient(115deg,#8aa2ec 0%,#7fb8e8 32%,#a3a4ee 58%,#78c0e0 82%,#9a8ce0 100%)', discussBorder: 'rgba(228,240,255,.95)', discussBracket: '#e6f1ff', discussTag: '#e6f4ff' },
  ml: { ...DARK_INK, art: 'ml', edge: '#b48cff', outerA: '#26222e', outerB: '#131118', body1: '#3b3645', body2: '#1b1921', head: '#15131a',
    panel1: 'rgba(150,128,196,.36)', panel2: 'rgba(36,32,48,.88)', label: '#d0b9ff', bracket: '#c4a6ff', circuit: '#b48cff',
    gem1: '#dccbff', gem2: '#6c52ad', gem3: '#211933', gemIn: '#211933', gemStroke: '#b99bff', gemEdge: '#efe6ff',
    statA: '#3e3155', statB: '#191424', statBorder: '#e8deff', ledgeA: '#3a3050', ledgeB: '#1c1727',
    discussBg: 'linear-gradient(115deg,#8b84c8 0%,#9aaad6 32%,#ae98de 58%,#8898cc 82%,#a286d8 100%)', discussBorder: 'rgba(238,232,255,.95)', discussBracket: '#efe9ff', discussTag: '#f1ecff' },
  ethics: { art: 'ethics', edge: '#e2c06a', outerA: '#efe5cb', outerB: '#d3c292', body1: '#f8f2e2', body2: '#e1d3ae', head: '#3a3224',
    ink: '#2b2418', typeInk: '#3a3224', headInk: '#ffffff', statInk: '#2b2418',
    panel1: 'rgba(255,255,255,.72)', panel2: 'rgba(228,214,176,.85)', label: '#8a6a22', bracket: '#b8913a', circuit: '#b8913a',
    gem1: '#fff7dc', gem2: '#d8b04f', gem3: '#8a631e', gemIn: '#5b4418', gemStroke: '#f3d88f', gemEdge: '#fffaf0',
    statA: '#f4ead0', statB: '#cdb680', statBorder: '#7a5a1c', ledgeA: '#cdb884', ledgeB: '#a88f55',
    discussBg: 'linear-gradient(115deg,#f4eedf 0%,#e2ecf4 32%,#efe3f6 58%,#e1f2ea 82%,#f4e7d6 100%)', discussBorder: 'rgba(184,145,58,.9)', discussBracket: '#b8913a', discussTag: '#7a5a1c',
    discussInk: '#2b2418', discussShadow: 'none', typeGlass: 'rgba(255,250,236,.72)', iconHalo: 'rgba(255,255,255,.75)' },
  impacts: { ...DARK_INK, art: 'impacts', edge: '#ff7c5e', outerA: '#3f0f0a', outerB: '#230604', body1: '#7c2619', body2: '#3f0f0a', head: '#380c08',
    panel1: 'rgba(240,132,108,.42)', panel2: 'rgba(116,28,18,.84)', label: '#ffbba6', bracket: '#ffa089', circuit: '#ff7c5e',
    gem1: '#ffc6ae', gem2: '#d2482c', gem3: '#58120b', gemIn: '#58120b', gemStroke: '#ffa18a', gemEdge: '#ffe8de',
    statA: '#8e2c1c', statB: '#3c0e09', statBorder: '#ffe2d8', ledgeA: '#8a2a1b', ledgeB: '#4a120b',
    discussBg: 'linear-gradient(115deg,#e0998a 0%,#d4a3c6 32%,#eeb08c 58%,#c697d4 82%,#e59c9e 100%)', discussBorder: 'rgba(255,236,228,.95)', discussBracket: '#ffece4', discussTag: '#fff0ea' },
  any: { ...DARK_INK, art: 'any', edge: '#ff9ee8', outerA: '#2a1f36', outerB: '#140e1c', body1: '#3a2c4c', body2: '#1a1324', head: '#170f20',
    panel1: 'rgba(200,150,255,.30)', panel2: 'rgba(40,28,56,.86)', label: '#ffc9f1', bracket: '#ffd76a', circuit: '#7ad9ff',
    gem1: '#ffd76a', gem2: '#ff7ad1', gem3: '#3a2c78', gemIn: '#241a3a', gemStroke: '#ffd76a', gemEdge: '#fff4d6',
    statA: '#4a3566', statB: '#1d1428', statBorder: '#ffe9a8', ledgeA: '#4a3566', ledgeB: '#1d1428',
    discussBg: 'linear-gradient(115deg,#ffd76a 0%,#ff9ad6 30%,#b39cff 55%,#7ad9ff 80%,#ffd76a 100%)', discussBorder: 'rgba(255,244,214,.95)', discussBracket: '#fff1c9', discussTag: '#4a2a66',
    discussInk: '#2a1640', discussShadow: '0 1px 0 rgba(255,255,255,.45)' },
};

// Token coin, one per Token: the pixel-art coin in assets/token-coin.png, drawn at 44px.
const coin = () => `<img class="coin" src="../../assets/token-coin.png" width="44" height="44" alt="">`;

function gemSvg(trainable, pal, id) {
  const outer = trainable
    ? `<polygon points="70,5 135,70 70,135 5,70" fill="url(#gA${id})" stroke="${pal.gemEdge}" stroke-width="3" filter="url(#glow${id})"/>` +
      `<polygon points="70,27 113,70 70,113 27,70" fill="${pal.gemIn}" stroke="${pal.gemStroke}" stroke-width="2"/>` +
      `<g stroke="#ffffff" stroke-opacity=".35" stroke-width="1.5"><line x1="70" y1="5" x2="70" y2="27"/><line x1="135" y1="70" x2="113" y2="70"/><line x1="70" y1="135" x2="70" y2="113"/><line x1="5" y1="70" x2="27" y2="70"/></g>` +
      `<g fill="none" stroke="${pal.gemStroke}" stroke-width="2" stroke-linecap="round" opacity=".85"><polyline points="18,44 26,40 23,34 31,29"/><polyline points="122,96 114,100 117,106 109,111"/><polyline points="96,18 100,26 106,23 111,31"/><polyline points="44,122 40,114 34,117 29,109"/></g>`
    : `<circle cx="70" cy="70" r="62" fill="url(#gA${id})" stroke="${pal.gemEdge}" stroke-width="3" filter="url(#glow${id})"/>` +
      `<circle cx="70" cy="70" r="41" fill="${pal.gemIn}" stroke="${pal.gemStroke}" stroke-width="2"/>`;
  return `<svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true"><defs>
    <linearGradient id="gA${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${pal.gem1}"/><stop offset=".5" stop-color="${pal.gem2}"/><stop offset="1" stop-color="${pal.gem3}"/></linearGradient>
    <filter id="glow${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>${outer}</svg>`;
}

// Type badge for cards without stats: wrench = Tool, bolt = Action, database = Dataset.
const KIND_ICON = {
  Tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.4-.4-2.6z"/>',
  Action: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  Dataset: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
};
const kindBadge = kind => `<div class="v2-ledge"></div><div class="v2-kind"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${KIND_ICON[kind] || ''}</svg><span>${kind}</span></div>`;

const circuit = `<svg class="circuit" viewBox="0 0 210 40" width="210" height="40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <path d="M8 20h58l10-10h54"/><path d="M40 20l10 10h70l8-8h60"/><path d="M130 10h36"/></g>
  <g fill="currentColor"><circle cx="8" cy="20" r="4"/><circle cx="130" cy="10" r="3.5"/><circle cx="166" cy="10" r="3.5"/><circle cx="188" cy="22" r="3.5"/></g></svg>`;

// Artwork with no transparency (a JPG, or a PNG without an alpha channel) is a picture, not a cutout.
function iconIsPhoto(icon) {
  if (/.jpe?g$/i.test(icon)) return true;
  if (!/.png$/i.test(icon)) return false;
  const buf = fs.readFileSync(path.join(REPO, 'design/icons', icon));
  const colorType = buf[25];                       // PNG header: 2 = RGB, 3 = palette, 4/6 = with alpha
  return colorType === 2 || (colorType === 3 && !buf.includes('tRNS'));
}

// Transparent PNGs much wider than tall (a logo, a landscape) get a wide slot instead of a square one.
function iconIsWide(icon) {
  if (!/\.png$/i.test(icon)) return false;
  const buf = fs.readFileSync(path.join(REPO, 'design/icons', icon));
  return buf.readUInt32BE(16) / buf.readUInt32BE(20) > 1.25;   // PNG header: width, height
}

function cardHtml(c, suit = c.suit, icon = null, number = '') {
  const pal = PALETTES[suit];
  if (!pal) throw new Error('no palette for ' + suit);
  const isSystem = c.cap !== '';
  const coins = Array.from({ length: c.tokens }, (_, k) => coin(suit + k)).join('');
  const vars = ['edge','outerA','outerB','body1','body2','head','panel1','panel2','label','bracket','circuit','statA','statB','statBorder','ledgeA','ledgeB','discussBg','discussBorder','discussBracket','discussTag','discussInk','discussShadow','ink','typeInk','headInk','statInk','typeGlass','iconHalo'];
  const style = vars.filter(k => pal[k] !== undefined).map(k => `--${k}:${pal[k]}`).join(';') + `;--art:url('../backgrounds/selected/${pal.art}.jpg')`;
  const typeText = c.typeText.replace(/·.*$/, '· ' + SUIT_LABEL[suit]);
  const full = c.rarity === 'rare' || c.rarity === 'chase';
  const kind = c.typeText.split('·')[0].trim();
  return `<div class="v2${full ? ' full' : ''}${isSystem ? '' : ' nostats'}${isSystem && c.tokens > 2 ? ' tall-tray' : ''}" style="${style}">
  <div class="v2-body">
    <div class="v2-art"></div>
    ${icon ? `<div class="v2-icon${iconIsPhoto(icon) ? ' photo' : iconIsWide(icon) ? ' wide' : ''}"><img src="../icons/${icon}" alt=""></div>` : ''}
    <header class="v2-head"><h2>${c.name}</h2></header>
    <div class="v2-gem ${c.trainable ? 'diamond' : 'round'}">${gemSvg(c.trainable, pal, suit)}<span>${c.cost}</span></div>
    ${isSystem && c.tokens ? `<div class="v2-tray" style="--cols:${Math.min(c.tokens, 2)}">${coins}</div>` : ''}
    ${isSystem ? `<div class="v2-ledge"></div><div class="v2-stats">
      <div class="v2-stat"><div class="in"><b>${c.cap}</b><i>CAP</i></div></div>
      <div class="v2-stat"><div class="in"><b>${c.trust}</b><i>TRU</i></div></div></div>` : kindBadge(kind)}
    <div class="v2-type"><span class="chip">${RARITY_LETTER[c.rarity]}</span><span class="tt">${typeText}</span>${circuit}</div>
    <div class="v2-panel v2-text brk">${c.lines.map(l => `<div class="ln"><b>${l.label}</b><p>${l.html}</p></div>`).join('')}</div>
    <div class="v2-panel v2-discuss brk"><div class="tag">◈ DISCUSS ◈</div><p class="q">${c.question}</p></div>
    ${number ? `<div class="v2-num">${number}</div>` : ''}
  </div>
</div>`;
}

const CSS = `
  .v2{ position:relative; width:750px; height:1050px; border-radius:56px; padding:9px; box-sizing:border-box;
    background:linear-gradient(160deg,var(--outerA),var(--outerB)); font-family:'Manrope',system-ui,sans-serif;
    box-shadow:inset 0 0 0 5px var(--edge), inset 0 0 18px 2px color-mix(in srgb, var(--edge) 45%, transparent), 0 0 18px 4px color-mix(in srgb, var(--edge) 40%, transparent); }
  .v2-body{ position:absolute; inset:14px; border-radius:44px; overflow:hidden;
    background:linear-gradient(180deg,var(--body1),var(--body2));
    box-shadow:inset 0 0 0 3px color-mix(in srgb, var(--edge) 70%, transparent), inset 0 0 26px rgba(0,0,0,.45); }
  /* header plate */
  .v2-head{ position:absolute; left:0; right:0; top:0; height:118px; background:linear-gradient(180deg,var(--head),color-mix(in srgb,var(--head) 70%, #000));
    border-bottom:3px solid color-mix(in srgb, var(--edge) 80%, transparent); display:flex; align-items:center; padding:0 162px 0 150px; box-sizing:border-box; z-index:3; }
  .v2-head h2{ margin:0; width:100%; text-align:center; color:var(--headInk); font-family:'Baloo 2',sans-serif; font-weight:700; font-style:italic; font-size:52px; line-height:1.05;
    white-space:nowrap; text-shadow:0 3px 10px rgba(0,0,0,.55); }
  /* cost gem */
  .v2-gem{ position:absolute; left:18px; top:17px; width:112px; height:112px; z-index:6; display:grid; place-items:center; }
  .v2-gem svg{ position:absolute; inset:0; width:100%; height:100%; }
  .v2-gem span{ position:relative; font-family:'Baloo 2',sans-serif; font-weight:800; font-size:46px; color:#fff; text-shadow:0 2px 6px rgba(0,0,0,.6); margin-top:3px; }
  /* token tray: a glass panel in the card's own color holding one gold coin per Token.
     Up to 2 coins per row, so 3-4 Tokens stack into a 2x2 block. */
  .v2-tray{ position:absolute; top:22px; right:24px; z-index:5; display:flex; flex-wrap:wrap; justify-content:center; width:calc(var(--cols) * 44px + (var(--cols) - 1) * 8px); gap:6px 8px;
    padding:10px 12px; border-radius:20px;
    background:linear-gradient(180deg, color-mix(in srgb, var(--edge) 22%, var(--head)), color-mix(in srgb, var(--head) 80%, #000));
    border:2.5px solid color-mix(in srgb, var(--edge) 85%, transparent);
    box-shadow:0 0 14px color-mix(in srgb, var(--edge) 45%, transparent), inset 0 1px 0 rgba(255,255,255,.25), inset 0 0 12px rgba(0,0,0,.35); }
  .v2-tray .coin{ display:block; filter:drop-shadow(0 2px 2px rgba(0,0,0,.45)); }
  /* art window */
  .v2-art{ position:absolute; left:26px; right:26px; top:118px; height:268px; background:var(--art) center/cover;
    border:3px solid color-mix(in srgb, var(--edge) 75%, transparent); border-top:0; border-radius:0 0 10px 10px; box-sizing:border-box; }
  .v2-ledge{ position:absolute; left:240px; right:240px; top:364px; height:30px; z-index:2;
    background:linear-gradient(180deg,var(--ledgeA),var(--ledgeB)); clip-path:polygon(8% 0,92% 0,100% 100%,0 100%); }
  .v2-stats{ position:absolute; left:0; right:0; top:278px; display:flex; justify-content:center; gap:22px; z-index:5; }
  .v2-stat{ width:88px; height:88px; transform:rotate(45deg); border:5px solid var(--statBorder); border-radius:6px;
    background:radial-gradient(circle at 50% 40%,var(--statA),var(--statB)); box-shadow:0 6px 16px rgba(0,0,0,.45), inset 0 0 12px rgba(120,255,200,.25);
    display:grid; place-items:center; }
  .v2-stat .in{ transform:rotate(-45deg); text-align:center; line-height:1; }
  .v2-stat b{ display:block; font-family:'Baloo 2',sans-serif; font-weight:800; font-size:46px; color:var(--statInk); }
  .v2-stat i{ display:block; font-style:normal; font-family:'JetBrains Mono',monospace; font-weight:700; font-size:16px; color:var(--statInk); opacity:.85; letter-spacing:.06em; margin-top:-2px; }

  /* Tools, Actions, Datasets: a rounded type badge where Systems show their stats */
  .v2.nostats .v2-head{ padding-right:150px; }
  .v2-kind{ position:absolute; top:338px; left:50%; transform:translateX(-50%); z-index:5; display:flex; align-items:center; gap:12px;
    padding:10px 28px 10px 22px; border-radius:999px; white-space:nowrap; color:var(--statInk);
    background:radial-gradient(circle at 50% 30%, var(--statA), var(--statB)); border:4px solid var(--statBorder);
    box-shadow:0 6px 16px rgba(0,0,0,.45), inset 0 0 12px rgba(255,255,255,.12);
    font:700 25px/1 'JetBrains Mono',monospace; letter-spacing:.12em; text-transform:uppercase; }
  .v2-kind svg{ flex:none; }
  /* card icon: centered on the art, above the stat diamonds or type badge */
  .v2-icon{ position:absolute; left:50%; top:196px; width:168px; height:168px; margin:-84px 0 0 -84px; z-index:2; pointer-events:none; }
  .v2.nostats .v2-icon{ top:226px; width:196px; height:196px; margin:-98px 0 0 -98px; }
  .v2-icon::before{ content:""; position:absolute; inset:-16%; border-radius:50%;
    background:radial-gradient(circle, var(--iconHalo, rgba(0,0,0,.5)) 0%, transparent 68%); }
  .v2-icon img{ position:relative; display:block; width:100%; height:100%; object-fit:contain;
    filter:drop-shadow(0 6px 8px rgba(0,0,0,.55)) drop-shadow(0 0 16px color-mix(in srgb, var(--edge) 55%, transparent)); }
  /* wide transparent art: centered above the stats or badge; on Systems it ends just where the diamonds begin */
  .v2-icon.wide{ top:191px; width:420px; height:134px; margin:-67px 0 0 -210px; }
  .v2.nostats .v2-icon.wide{ top:232px; width:460px; height:196px; margin:-98px 0 0 -230px; }
  /* photo or painting (JPG or opaque PNG): fills the art window in place of the abstract background,
     set just below the name bar with an edge line and rounded corners like the text boxes. The stat
     diamonds and ledge (Systems) or the type badge (Tools, Actions, Datasets) sit on its lower edge. */
  .v2-icon.photo, .v2.nostats .v2-icon.photo{ left:26px; right:26px; top:128px; width:auto; height:258px; margin:0; z-index:1;
    border:3px solid color-mix(in srgb, var(--edge) 75%, transparent); border-radius:26px;
    box-sizing:border-box; overflow:hidden; }
  .v2:has(.v2-icon.photo) .v2-art{ visibility:hidden; }   /* the card body shows around the rounded art, not the abstract background */
  .v2-icon.photo::before{ display:none; }
  .v2-icon.photo img{ object-fit:cover; object-position:center; filter:none; }
  /* collector number: bottom-right, inside the Discuss box's bottom padding (the question
     never reaches it) and inside the 1/8" print safe zone */
  .v2-num{ position:absolute; right:48px; bottom:28px; z-index:4; pointer-events:none;
    font:700 17px/1 'JetBrains Mono',monospace; letter-spacing:.04em; font-variant-numeric:tabular-nums;
    color:var(--discussTag); text-shadow:var(--discussShadow); opacity:.9; }
  /* type bar */
  .v2-type{ position:absolute; left:34px; right:30px; top:408px; height:46px; display:flex; align-items:center; gap:18px; color:var(--typeInk); }
  .v2-type .chip{ width:40px; height:40px; flex:none; border:3px solid currentColor; border-radius:9px; display:grid; place-items:center;
    font:700 22px/1 'JetBrains Mono',monospace; }
  .v2-type .tt{ font:700 27px/1 'JetBrains Mono',monospace; letter-spacing:.09em; text-transform:uppercase; white-space:nowrap; }
  .v2-type .circuit{ margin-left:auto; color:var(--circuit); opacity:.75; flex:none; }
  /* panels with corner brackets */
  .v2-panel{ position:absolute; box-sizing:border-box; }
  .brk::before{ content:""; position:absolute; inset:-9px; pointer-events:none;
    border:5px solid var(--bk,var(--bracket)); border-radius:calc(var(--r) + 9px);
    -webkit-mask:
      linear-gradient(#000 0 0) left top / 58px 58px no-repeat,
      linear-gradient(#000 0 0) right top / 58px 58px no-repeat,
      linear-gradient(#000 0 0) left bottom / 58px 58px no-repeat,
      linear-gradient(#000 0 0) right bottom / 58px 58px no-repeat;
    mask:
      linear-gradient(#000 0 0) left top / 58px 58px no-repeat,
      linear-gradient(#000 0 0) right top / 58px 58px no-repeat,
      linear-gradient(#000 0 0) left bottom / 58px 58px no-repeat,
      linear-gradient(#000 0 0) right bottom / 58px 58px no-repeat; }
  .v2-text{ --r:26px; left:40px; right:40px; top:468px; height:236px; padding:20px 32px; border-radius:var(--r);
    background:linear-gradient(135deg,var(--panel1),var(--panel2)); border:2px solid color-mix(in srgb, var(--edge) 70%, transparent);
    box-shadow:inset 0 0 20px rgba(160,255,240,.18); display:flex; flex-direction:column; justify-content:center; gap:10px; }
  .v2-text .ln b{ display:block; font:700 24px/1 'JetBrains Mono',monospace; letter-spacing:.1em; text-transform:uppercase; color:var(--label); margin-bottom:6px; }
  .v2-text .ln p{ margin:0; color:var(--ink); font-size:28px; line-height:1.34; }
  .v2-text .kw{ font-family:'Baloo 2',sans-serif; font-weight:700; font-style:italic; }
  .v2-discuss{ left:24px; right:24px; top:774px; bottom:22px; --r:34px; padding:26px 44px 30px; border-radius:var(--r); --bk:var(--discussBracket);
    background:
      radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,.35), transparent 55%),
      var(--discussBg);
    border:3px solid var(--discussBorder); box-shadow:inset 0 0 26px rgba(255,255,255,.35);
    display:flex; flex-direction:column; justify-content:center; gap:14px; }

  /* full-art (Rare / Chase): the art fills the whole card; header, type bar and
     text boxes turn see-through so it shows behind them. A soft darkening toward
     the bottom keeps the text readable. */
  .v2.full .v2-body{ background:
      linear-gradient(180deg, transparent 0%, transparent 34%, color-mix(in srgb, var(--body2) 45%, transparent) 58%, color-mix(in srgb, var(--body2) 72%, transparent) 100%),
      var(--art) center/cover; }
  .v2.full .v2-art, .v2.full .v2-ledge{ display:none; }
  .v2.full .v2-head{ background:color-mix(in srgb, var(--head) 55%, transparent); }
  .v2.full .v2-type{ left:26px; right:26px; padding:0 10px; box-sizing:border-box; border-radius:14px;
    background:var(--typeGlass, color-mix(in srgb, var(--head) 62%, transparent)); }
  .v2.full .v2-text{ background:linear-gradient(135deg, color-mix(in srgb, var(--body2) 52%, transparent), color-mix(in srgb, var(--body2) 80%, transparent)); }
  .v2.full .v2-discuss{ background:none; isolation:isolate; }
  .v2.full .v2-discuss::after{ content:""; position:absolute; inset:0; border-radius:inherit; z-index:-1;
    background:radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,.3), transparent 55%), var(--discussBg); opacity:.72; }
  .v2-discuss .tag{ font:700 26px/1 'JetBrains Mono',monospace; letter-spacing:.12em; color:var(--discussTag); text-shadow:var(--discussShadow); }
  .v2-discuss .q{ margin:0; color:var(--discussInk); font-family:'Baloo 2',sans-serif; font-weight:800; font-size:46px; line-height:1.18;
    text-shadow:var(--discussShadow); }
`;

const FIT = `
// Measure the text itself (children + gaps + padding), not scrollHeight: the corner
// brackets sit just outside each panel and would otherwise count as overflow.
function need(el){
  var cs = getComputedStyle(el), gap = parseFloat(cs.rowGap) || 0, kids = el.children, h = 0;
  for (var i = 0; i < kids.length; i++) h += kids[i].offsetHeight;
  return h + gap * Math.max(0, kids.length - 1) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
}
document.fonts.ready.then(function(){
  document.querySelectorAll('.v2').forEach(function(card){
    var h = card.querySelector('.v2-head h2'), s = 52;
    while (h.scrollWidth > h.clientWidth && s > 34) { s -= .5; h.style.fontSize = s + 'px'; }

    // The ability box hugs its text; the Discuss box grows up into whatever is left.
    var tp = card.querySelector('.v2-text'), ps = tp.querySelectorAll('p');
    var box = card.querySelector('.v2-discuss'), q = box.querySelector('.q');
    var TOP = tp.offsetTop, MAX = 262, MIN = 132, GAP = 22;
    function layout(f){
      ps.forEach(function(p){ p.style.fontSize = f + 'px'; });
      tp.style.height = MAX + 'px';
      var cs = getComputedStyle(tp), border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      var hh = Math.min(MAX, Math.max(MIN, Math.ceil(need(tp) + border)));
      tp.style.height = hh + 'px';
      box.style.top = (TOP + hh + GAP) + 'px';
      var t = 48; q.style.fontSize = t + 'px';
      while (need(box) > box.clientHeight && t > 28) { t -= .5; q.style.fontSize = t + 'px'; }
      return t;
    }
    // Start at full size; shrink the ability text only while it overflows,
    // or (down to 25px) while the question would drop below 40px.
    var f = 30, t = layout(f);
    while ((need(tp) > tp.clientHeight || t < 40) && f > 25) { f -= .5; t = layout(f); }
    while (need(tp) > tp.clientHeight && f > 20) { f -= .5; t = layout(f); }
  });
});`;

// Collector numbers follow the card-list order; the total is counted, not hard-coded.
const ALL_NAMES = [...src.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1]);
const numberOf = name => `${ALL_NAMES.indexOf(name) + 1}/${ALL_NAMES.length}`;

const ICON_DIR = path.join(REPO, 'design/icons');
let ICON_MAP = {};
try { ICON_MAP = JSON.parse(fs.readFileSync(path.join(ICON_DIR, 'icons.json'), 'utf8')); } catch (e) { if (e.code !== 'ENOENT') throw e; }
const slugOf = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function iconFor(name) {
  if (ICON_MAP[name]) {
    if (!fs.existsSync(path.join(ICON_DIR, ICON_MAP[name]))) throw new Error(`icons.json: "${ICON_MAP[name]}" for ${name} is not in design/icons/`);
    return ICON_MAP[name];
  }
  for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'svg']) {
    const f = `${slugOf(name)}.${ext}`;
    if (fs.existsSync(path.join(ICON_DIR, f))) return f;
  }
  return null;
}

const args = process.argv.slice(2);
const forcedIcon = (args.find(a => a.startsWith('--icon=')) || '').slice('--icon='.length);
if (forcedIcon && !fs.existsSync(path.join(ICON_DIR, forcedIcon))) throw new Error(`--icon: ${forcedIcon} is not in design/icons/`);
const positional = args.filter(a => !a.startsWith('--icon='));

function writeCard(name, suitOverride) {
  const c = readCard(name);
  const suit = suitOverride || c.suit;
  const icon = forcedIcon || iconFor(name);
  const prefix = forcedIcon ? 'preview' : 'proof';
  const slug = slugOf(name) + '-' + suit;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Frame v2 proof: ${name}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap">
<style>html,body{margin:0;background:#f2f2f2}.stage{padding:40px;display:inline-block}${CSS}</style></head>
<body><div class="stage">${cardHtml(c, suit, icon, numberOf(name))}</div><script>${FIT}</script></body></html>`;
  fs.writeFileSync(path.join(OUT, `${prefix}-${slug}.html`), html);
  return { file: `design/frame-v2/${prefix}-${slug}.html`, icon };
}

fs.mkdirSync(OUT, { recursive: true });
if (positional[0] === '--all') {
  const names = [...src.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1]);
  const withIcon = names.map(n => writeCard(n)).filter(r => r.icon).length;
  console.log(`wrote ${names.length} cards to design/frame-v2/ (${withIcon} with an icon)`);
} else {
  const r = writeCard(positional[0] || 'The Human Trainer', positional[1]);
  console.log('wrote', r.file, r.icon ? '(icon: ' + r.icon + ')' : '(no icon)');
}
