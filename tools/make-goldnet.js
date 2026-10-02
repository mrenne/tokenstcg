// Draws a faint gold network (nodes joined to their nearest neighbours, plus a few long rays from a
// bright hub) as an SVG, to lay over the pale White background on White Rare full-art cards.
// Output: design/backgrounds/selected/ethics-goldnet.svg (sized to the card body, 722 x 1022).
//   node tools/make-goldnet.js
const fs = require('fs');
const W = 722, H = 1022;
let seed = 20260927;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const hub = { x: W * 0.62, y: H * 0.2 };
const nodes = [hub];
while (nodes.length < 42) {
  const p = { x: rnd() * (W + 80) - 40, y: rnd() * (H + 80) - 40 };
  if (nodes.every(q => Math.hypot(p.x - q.x, p.y - q.y) > 80)) nodes.push(p);
}
const lines = new Set();
nodes.forEach((p, i) => {
  nodes.map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) })).filter(o => o.j !== i)
    .sort((a, b) => a.d - b.d).slice(0, 3).forEach(o => lines.add([Math.min(i, o.j), Math.max(i, o.j)].join('-')));
});
// long rays from the hub to distant nodes, like the other colors' network art
nodes.map((q, j) => ({ j, d: Math.hypot(hub.x - q.x, hub.y - q.y) })).sort((a, b) => b.d - a.d).slice(0, 9)
  .forEach(o => lines.add(`0-${o.j}`));
const f = n => n.toFixed(1);
const path = [...lines].map(k => { const [a, b] = k.split('-').map(Number); return `M${f(nodes[a].x)} ${f(nodes[a].y)}L${f(nodes[b].x)} ${f(nodes[b].y)}`; }).join('');
const dots = nodes.slice(1).map((p, i) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${(3.5 + (i % 4) * 1.2).toFixed(1)}"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="hubglow"><stop offset="0" stop-color="#fff6d6" stop-opacity=".95"/><stop offset=".25" stop-color="#f2cf73" stop-opacity=".55"/><stop offset="1" stop-color="#e2c06a" stop-opacity="0"/></radialGradient>
  <radialGradient id="warm" cx="${f(hub.x / W)}" cy="${f(hub.y / H)}" r=".75"><stop offset="0" stop-color="#f6d98a" stop-opacity=".35"/><stop offset="1" stop-color="#f6d98a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#warm)"/>
<path d="${path}" fill="none" stroke="#a67c22" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>
<path d="${path}" fill="none" stroke="#fff3cf" stroke-opacity=".45" stroke-width="1"/>
<g fill="#b8913a" fill-opacity=".9">${dots}</g>
<circle cx="${f(hub.x)}" cy="${f(hub.y)}" r="70" fill="url(#hubglow)"/>
<circle cx="${f(hub.x)}" cy="${f(hub.y)}" r="7" fill="#fffaf0"/>
</svg>
`;
fs.writeFileSync(require('path').join(require('./common').REPO, 'design/backgrounds/selected/ethics-goldnet.svg'), svg);
console.log(`gold network: ${nodes.length} nodes, ${lines.size} lines, ${(svg.length / 1024).toFixed(1)} KB`);
