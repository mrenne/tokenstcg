// Shared settings for the Tokens build tools.
//   REPO   the repository root (this file lives in <repo>/tools)
//   CACHE  scratch space for renders and temporary pages (tools/.cache, not committed)
//   CHROME headless Chrome, used to render cards and build the PDF; set CHROME=... to override
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const CACHE = path.join(__dirname, '.cache');
fs.mkdirSync(CACHE, { recursive: true });

const CHROME = process.env.CHROME || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find(p => fs.existsSync(p));

// file:/// URL for a local path (forward slashes, spaces encoded)
const fileUrl = p => 'file:///' + path.resolve(p).replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/').replace(/^([A-Za-z])%3A/, '$1:');

// The card list in print order, from the card source: [{ name, slug, suit, proof }]
const slugOf = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function cardOrder() {
  const src = fs.readFileSync(path.join(REPO, 'design/design-v1/print-sheet-source.html'), 'utf8');
  return src.split('<div class="cutwrap">').slice(1).map(part => {
    const suit = part.match(/<div class="card ([a-z]+)/)[1];
    const name = part.match(/<h2[^>]*>([^<]+)<\/h2>/)[1];
    return { name, slug: slugOf(name), suit, proof: `proof-${slugOf(name)}-${suit}.html` };
  });
}

function requireChrome() {
  if (!CHROME) throw new Error('Google Chrome not found. Install it, or set CHROME to its path.');
  return CHROME;
}

module.exports = { REPO, CACHE, CHROME, requireChrome, fileUrl, slugOf, cardOrder };
