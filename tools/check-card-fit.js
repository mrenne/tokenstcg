// Checks that every v2 card's text fits: puts all the proofs on one page, lets each card's
// fit script shrink its text, then reports the final sizes and any overflow.
//   node tools/check-card-fit.js          prints problems only
//   node tools/check-card-fit.js --all    prints every card's name / ability / question size
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { REPO, requireChrome } = require('./common');
const DIR = path.join(REPO, 'design/frame-v2') + '/';
const skip = /the-human-trainer-(repres|ml|ethics|impacts)\.html$/;
const files = fs.readdirSync(DIR).filter(f => /^proof-.*\.html$/.test(f) && !skip.test(f));
let head = '', fit = '', stages = [];
for (const f of files) {
  const h = fs.readFileSync(DIR + f, 'utf8');
  if (!head) { head = h.slice(0, h.indexOf('<body>')); fit = h.slice(h.indexOf('<script>'), h.lastIndexOf('</script>') + 9); }
  const s = h.indexOf('<div class="stage">'), e = h.indexOf('<script>');
  stages.push(h.slice(s, e).replace('<div class="stage">', `<div class="stage" data-file="${f}">`));
}
const probe = `<script>
document.fonts.ready.then(function(){ setTimeout(function(){
  function need(el){ var cs=getComputedStyle(el), gap=parseFloat(cs.rowGap)||0, k=el.children, h=0;
    for (var i=0;i<k.length;i++) h+=k[i].offsetHeight;
    return h + gap*Math.max(0,k.length-1) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom); }
  var rows=[];
  document.querySelectorAll('.stage').forEach(function(st){
    var c=st.querySelector('.v2'), name=c.querySelector('h2'), tp=c.querySelector('.v2-text'), box=c.querySelector('.v2-discuss'), q=box.querySelector('.q');
    var p=tp.querySelector('p');
    var ab=parseFloat(p.style.fontSize)||30, qs=parseFloat(q.style.fontSize)||48, ns=parseFloat(name.style.fontSize)||52;
    var tpBorder=parseFloat(getComputedStyle(tp).borderTopWidth)+parseFloat(getComputedStyle(tp).borderBottomWidth);
    var over=[];
    if (name.scrollWidth > name.clientWidth + 1) over.push('name');
    if (need(tp) > tp.clientHeight + 1) over.push('ability');
    if (need(box) > box.clientHeight + 1) over.push('discuss');
    var body=c.querySelector('.v2-body'); if (box.offsetTop + box.offsetHeight > body.clientHeight) over.push('discuss-off-card');
    rows.push([st.dataset.file, 'name='+ns, 'ability='+ab, 'question='+qs, over.length ? 'OVERFLOW:'+over.join('+') : 'ok'].join(' | '));
  });
  var pre=document.createElement('pre'); pre.id='probe-out'; pre.textContent=rows.join('\\n'); document.body.appendChild(pre);
}, 1500); });
</script>`;
// the page sits next to the proofs so their relative image paths still work; it's removed afterwards
const page = DIR + '_check-all.html';
fs.writeFileSync(page, head + '<body>' + stages.join('\n') + fit + probe + '</body></html>');
let dom;
try {
  dom = execFileSync(requireChrome(), ['--headless', '--no-sandbox', '--disable-gpu', '--allow-file-access-from-files', '--virtual-time-budget=20000', '--dump-dom', page],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
} finally { fs.unlinkSync(page); }
const m = dom.match(/<pre id="probe-out">([^<]*)<\/pre>/);
if (!m) throw new Error('the fit probe did not report (fonts may not have loaded)');
const rows = m[1].split('\n').filter(Boolean);
const bad = rows.filter(r => r.includes('OVERFLOW'));
if (process.argv.includes('--all')) rows.forEach(r => console.log(r));
else bad.forEach(r => console.log(r));
console.log(`${rows.length} cards checked, ${bad.length} with text that doesn't fit`);
process.exitCode = bad.length ? 1 : 0;
