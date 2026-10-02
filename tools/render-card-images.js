// Renders every v2 card proof to a web image for the site: assets/cards/<card-slug>.webp
// (600x840, transparent rounded corners). Also leaves a full-size PNG of each card in
// tools/.cache/cards/, which build-print-pdf.js uses. Run after build-card.js --all.
//   node tools/render-card-images.js
const fs = require('fs');
const path = require('path');
const { execFile, execFileSync } = require('child_process');
const { REPO, CACHE, requireChrome, cardOrder, fileUrl } = require('./common');
const CHROME = requireChrome();
const OUT = path.join(REPO, 'assets/cards');
const TMP = path.join(CACHE, 'cards');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });

const cards = cardOrder();

// 1. screenshot each proof (6 at a time)
function shot(c) {
  return new Promise((res, rej) => execFile(CHROME, ['--headless', '--no-sandbox', '--disable-gpu', '--force-color-profile=srgb', '--hide-scrollbars',
    '--virtual-time-budget=9000', '--window-size=830,1130', `--screenshot=${path.join(TMP, c.slug + '.png')}`,
    path.join(REPO, 'design/frame-v2', c.proof)], err => err ? rej(err) : res()));
}
async function main() {
  for (let i = 0; i < cards.length; i += 6) await Promise.all(cards.slice(i, i + 6).map(shot));
  // 2. crop to the card, round the corners, scale, and encode as WebP in a headless page
  const W = 600, H = 840, R = 56 * W / 750;
  const page = `<!doctype html><meta charset="utf-8"><pre id="o">pending</pre><script>
const list = ${JSON.stringify(cards.map(c => c.slug))}, out = {};
let left = list.length;
list.forEach(slug => {
  const im = new Image();
  im.onload = () => {
    const c = document.createElement('canvas'); c.width = ${W}; c.height = ${H};
    const x = c.getContext('2d');
    x.beginPath(); x.roundRect(0, 0, ${W}, ${H}, ${R}); x.clip();
    x.imageSmoothingQuality = 'high';
    x.drawImage(im, 40, 40, 750, 1050, 0, 0, ${W}, ${H});
    out[slug] = c.toDataURL('image/webp', 0.86);
    if (--left === 0) document.getElementById('o').textContent = JSON.stringify(out);
  };
  im.onerror = () => { out[slug] = 'ERROR'; if (--left === 0) document.getElementById('o').textContent = JSON.stringify(out); };
  im.src = ${JSON.stringify(fileUrl(TMP))} + '/' + slug + '.png';
});
</script>`;
  const html = path.join(TMP, 'encode.html');
  fs.writeFileSync(html, page);
  const dom = execFileSync(CHROME, ['--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', '--virtual-time-budget=30000', '--dump-dom', html],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  const m = dom.match(/<pre id="o">([^<]*)<\/pre>/);
  if (!m || m[1] === 'pending') throw new Error('encoder did not finish');
  const out = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  let bytes = 0;
  for (const c of cards) {
    if (!out[c.slug] || out[c.slug] === 'ERROR' || !out[c.slug].startsWith('data:image/webp')) throw new Error('no image for ' + c.name);
    const buf = Buffer.from(out[c.slug].split(',')[1], 'base64');
    fs.writeFileSync(path.join(OUT, c.slug + '.webp'), buf); bytes += buf.length;
  }
  console.log(`wrote ${cards.length} card images to assets/cards/ (${(bytes / 1024 / 1024).toFixed(1)} MB total)`);
}
main().catch(e => { console.error(e); process.exit(1); });
