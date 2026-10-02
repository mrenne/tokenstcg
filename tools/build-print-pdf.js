// Print-and-play sheets from the v2 card renders: 9 cards per US Letter page at 300 DPI
// (2550 x 3300 px; each card 750 x 1050 px = 2.5 x 3.5 in), cards butted edge to edge with
// cut marks in the margins. Writes design/print/tokens-print-page-N.jpg (kept local) and
// design/print/tokens-print-and-play.pdf (committed). Uses the card PNGs that
// render-card-images.js leaves in tools/.cache/cards/, so run that first.
//   node tools/build-print-pdf.js          card fronts only (what's published)
//   BACKS=1 node tools/build-print-pdf.js  adds mirrored card-back pages for double-sided printing
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { REPO, CACHE, requireChrome, cardOrder, fileUrl } = require('./common');
const CHROME = requireChrome();
const OUT = path.join(REPO, 'design/print');
const PNG = fileUrl(path.join(CACHE, 'cards'));
const order = cardOrder().map(c => c.slug);
const missing = order.filter(s => !fs.existsSync(path.join(CACHE, 'cards', s + '.png')));
if (missing.length) throw new Error('no card render for: ' + missing.join(', ') + ' (run tools/render-card-images.js first)');
const BACK = fileUrl(path.join(REPO, 'assets/home-background.jpg'));
fs.mkdirSync(OUT, { recursive: true });

const PW = 2550, PH = 3300, CW = 750, CH = 1050, R = 56;
const X0 = (PW - 3 * CW) / 2, Y0 = (PH - 3 * CH) / 2;       // 150, 75
const pages = [];
for (let i = 0; i < order.length; i += 9) pages.push(order.slice(i, i + 9));

const page = `<!doctype html><meta charset="utf-8"><pre id="o">pending</pre><script>
const pages = ${JSON.stringify(pages)}, out = [];
const load = f => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(f); im.src = '${PNG}/' + f + '.png'; });
(async () => {
  for (const [n, list] of pages.entries()) {
    const c = document.createElement('canvas'); c.width = ${PW}; c.height = ${PH};
    const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, ${PW}, ${PH});
    for (const [k, f] of list.entries()) {
      const im = await load(f), cx = ${X0} + (k % 3) * ${CW}, cy = ${Y0} + Math.floor(k / 3) * ${CH};
      x.save(); x.beginPath(); x.roundRect(cx, cy, ${CW}, ${CH}, ${R}); x.clip();
      x.drawImage(im, 40, 40, ${CW}, ${CH}, cx, cy, ${CW}, ${CH}); x.restore();
    }
    // cut marks: short grey lines in the margins, in line with every card edge
    const rows = Math.ceil(list.length / 3);
    x.strokeStyle = '#888'; x.lineWidth = 2; x.beginPath();
    for (let i = 0; i <= 3; i++) { const vx = ${X0} + i * ${CW}; x.moveTo(vx, ${Y0} - 60); x.lineTo(vx, ${Y0} - 12); x.moveTo(vx, ${Y0} + rows * ${CH} + 12); x.lineTo(vx, ${Y0} + rows * ${CH} + 60); }
    for (let j = 0; j <= rows; j++) { const hy = ${Y0} + j * ${CH}; x.moveTo(${X0} - 110, hy); x.lineTo(${X0} - 20, hy); x.moveTo(${X0} + 3 * ${CW} + 20, hy); x.lineTo(${X0} + 3 * ${CW} + 110, hy); }
    x.stroke();
    x.fillStyle = '#999'; x.font = '28px sans-serif'; x.textAlign = 'right';
    // footer text sits between the bottom cut marks: license under the left card column, page info under the right
    x.fillText('page ' + (n + 1) + ' of ${pages.length}  ·  print at 100% / Actual Size', ${X0} + 3 * ${CW} - 16, ${PH} - 14);
    x.textAlign = 'left';
    x.fillText('Tokens TCG Alpha Set  ·  CC BY-NC-SA 4.0', ${X0} + 16, ${PH} - 14);
    out.push(c.toDataURL('image/jpeg', 0.9));
  }
  // card backs: one back page per front page, mirrored left-right so each back lands behind its
  // front when the sheet is printed double-sided and flipped on the long edge
  if (${process.env.BACKS ? 1 : 0}) {   // card backs are off unless BACKS=1 (teachers sleeve the cards instead)
  const backImg = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej('card back'); im.src = '${BACK}'; });
  for (const [n, list] of pages.entries()) {
    const c = document.createElement('canvas'); c.width = ${PW}; c.height = ${PH};
    const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, ${PW}, ${PH});
    const s = Math.max(${CW} / backImg.width, ${CH} / backImg.height), sw = ${CW} / s, sh = ${CH} / s;
    const sx = (backImg.width - sw) / 2, sy = (backImg.height - sh) / 2;
    for (let k = 0; k < list.length; k++) {
      const cx = ${X0} + (2 - k % 3) * ${CW}, cy = ${Y0} + Math.floor(k / 3) * ${CH};
      x.save(); x.beginPath(); x.roundRect(cx, cy, ${CW}, ${CH}, ${R}); x.clip();
      x.drawImage(backImg, sx, sy, sw, sh, cx, cy, ${CW}, ${CH}); x.restore();
    }
    out.push(c.toDataURL('image/jpeg', 0.9));
  }
  }
  document.getElementById('o').textContent = JSON.stringify(out);
})().catch(e => { document.getElementById('o').textContent = 'ERROR ' + e; });
</script>`;
const html = path.join(CACHE, 'print-compose.html');
fs.writeFileSync(html, page);
const dom = execFileSync(CHROME, ['--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', '--virtual-time-budget=60000', '--dump-dom', html],
  { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
const m = dom.match(/<pre id="o">([^<]*)<\/pre>/);
if (!m || m[1] === 'pending' || m[1].startsWith('ERROR')) throw new Error('compose failed: ' + (m ? m[1].slice(0, 200) : 'no output'));
const jpgs = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
let total = 0;
// first half: card fronts; second half: the matching back pages
const n = pages.length, names = [], hasBacks = jpgs.length > n;
jpgs.forEach((d, i) => {
  const name = i < n ? `tokens-print-page-${i + 1}.jpg` : `tokens-print-page-${i - n + 1}-back.jpg`;
  const b = Buffer.from(d.split(',')[1], 'base64'); fs.writeFileSync(path.join(OUT, name), b); total += b.length; names.push(name);
});
console.log(`${n} front${hasBacks ? ` + ${n} back` : ''} pages, ${(total / 1024 / 1024).toFixed(1)} MB`);

// one PDF; with BACKS=1 it's for double-sided printing: front, back, front, back... (flip on the long edge)
const pdfHtml = path.join(CACHE, 'print-pdf.html');
// back pages with all 9 slots are identical, so they share one image (stored once in the PDF)
const order2 = [];
for (let i = 0; i < n; i++) { order2.push(names[i]); if (hasBacks) order2.push(pages[i].length === 9 ? names[n] : names[n + i]); }
fs.writeFileSync(pdfHtml, `<!doctype html><meta charset="utf-8"><style>@page{size:8.5in 11in;margin:0}html,body{margin:0}img{display:block;width:8.5in;height:11in;page-break-after:always}</style>` +
  order2.map(f => `<img src="${fileUrl(path.join(OUT, f))}">`).join(''));
execFileSync(CHROME, ['--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', '--no-pdf-header-footer', '--virtual-time-budget=20000',
  `--print-to-pdf=${path.join(OUT, 'tokens-print-and-play.pdf')}`, pdfHtml], { stdio: 'ignore' });
console.log(`PDF ${(fs.statSync(path.join(OUT, 'tokens-print-and-play.pdf')).size / 1024 / 1024).toFixed(1)} MB`);
