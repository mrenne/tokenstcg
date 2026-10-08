// Builds teacher/terms-and-definitions.md. Card definitions come from the printed card source.
//   node tools/build-terms.js
const fs = require('fs');
const R = require('./common').REPO + '/';
const src = fs.readFileSync(R + 'design/design-v1/print-sheet-source.html', 'utf8');
const decode = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').trim();

const cards = [];
for (const part of src.split('<div class="cutwrap">').slice(1)) {
  const suit = (part.match(/<div class="card ([a-z]+)/) || [])[1];
  const name = decode((part.match(/<h2[^>]*>([^<]+)<\/h2>/) || [])[1] || '');
  const def = decode((part.match(/<b>Definition<\/b>([^<]*)/) || [])[1] || '');
  const type = decode((part.match(/<span class="gem[^"]*"><\/span>([^<·]+)·/) || [])[1] || '');
  if (!name || !def) throw new Error('could not read card: ' + part.slice(0, 120));
  cards.push({ suit, name, def, type });
}
if (cards.length !== 70) throw new Error('expected 70 cards, got ' + cards.length);

const SUITS = [
  ['humans', 'Humans and AI', 'Green', 'How people and AI differ, who builds AI, and when to use it.'],
  ['repres', 'Representation & Reasoning', 'Blue', 'How AI stores information about the world and uses it to make decisions.'],
  ['ml', 'Machine Learning', 'Black', 'How computers learn from data, and the hardware and models that make it work.'],
  ['ethics', 'Ethical AI Design', 'White', 'How people make AI fair, safe, and accountable.'],
  ['impacts', 'Societal Impacts', 'Red', 'How AI changes people\'s lives, communities, and the planet.'],
];

const GAME = [
  // [term, in the game, in real AI (or '')]
  ['Tokens', 'Points. You earn Tokens when your Systems Run a Task. The first player to 15 Tokens wins Quick Play.', 'Language models like chatbots read and write text in small chunks called **tokens** (a word or part of a word).'],
  ['Data', 'What you spend to put cards into play. Each card in your Training Set gives you 1 Data every turn.', 'The information an AI learns from, such as text, images, or numbers.'],
  ['Training Set', 'Your face-down pile of cards that gives you Data. It gets bigger as you train cards into it.', 'The collection of examples used to teach an AI model.'],
  ['Train (a card)', 'Once per turn, put a Trainable card from your hand face-down into your Training Set.', '**Training** is how a model learns: it studies many examples and adjusts itself.'],
  ['Trainable', 'A card with a **diamond around its Cost** can be trained. No diamond means it can\'t.', ''],
  ['Benchmark', 'How to pick who goes first: each player flips the top card of their deck, and the higher Cost goes first.', 'A **benchmark** is a shared test used to compare AI models and see which one scores higher.'],
  ['Deploy', 'Put a card into play by paying its Cost in Data.', 'To **deploy** an AI system is to release it so people can actually use it.'],
  ['Deploy tax', 'Your first two Systems cost their printed Cost. Your 3rd costs +1 Data, your 4th +2, and so on.', ''],
  ['System', 'A card for an AI program, model, or organization. Systems do the work: they Run Tasks and Audits.', 'An **AI system** is any program or product that uses AI to do a job.'],
  ['Tool', 'A card that stays in play and gives you an ability you can use again.', ''],
  ['Action', 'A card with a one-time effect. After you play it, it goes to your discard pile.', ''],
  ['Cost', 'The number in the top-left corner: how much Data it takes to deploy the card.', ''],
  ['Capability', 'How strong a System is in an Audit. It deals this many Flags.', 'What an AI system is able to do, and how well.'],
  ['Trust', 'How many Flags a System can take before it is Deprecated.', 'How much people can rely on an AI system to be accurate, fair, and safe.'],
  ['Run a Task', 'Exert (turn sideways) one of your Systems to earn its Tokens.', ''],
  ['Run an Audit', 'Exert one of your Systems to challenge an opponent\'s exerted System. Both deal Flags to each other.', 'An **AI audit** is a careful check of an AI system for problems like bias, errors, or safety risks.'],
  ['Flag', 'Damage. When a System has as many Flags as its Trust, it is Deprecated.', 'To **flag** something is to mark it as a possible problem.'],
  ['Deprecated', 'Knocked out of the game and put in the discard pile.', 'Software that is **deprecated** is being retired: people are told to stop using it.'],
  ['Exert / Ready', 'Exert means turn a card sideways to show it has been used. Ready means turn it back upright.', ''],
  ['{E}', 'The exert symbol. On a Tool, "{E} —" means "exert this Tool to use this ability."', ''],
  ['Reboot', 'The first step of your turn: ready all your exerted cards.', 'To **reboot** is to restart a computer.'],
  ['Sync', 'The second step of your turn: handle anything that happens "at the start of your turn."', 'To **sync** is to bring devices or data up to date with each other.'],
  ['Fetch', 'The third step of your turn: draw a card.', 'Computers **fetch** data when they go get it from memory or the internet.'],
  ['Opening hand', 'The cards you start with. The player going first draws 5; the player going second draws 6, to make up for going second.', ''],
  ['Mulligan', 'Before the game, you may shuffle your opening hand back into your deck and draw a new hand of the same size, one time.', ''],
  ['Data Type', 'A card\'s color group. Your deck uses 1 or 2 Data Types. Each one is one of the five big ideas of AI.', ''],
  ['Rarity', 'How hard a card is to get, shown by the letter in the small square on the type bar: **C** Common, **U** Uncommon, **R** Rare, **★** Chase.', ''],
  ['Chase card', 'The rarest kind of card. Your teacher decides how you can earn one.', ''],
  ['Fast-Tracked', 'A keyword: this System can Run a Task or an Audit on the same turn it is deployed.', ''],
  ['Highly Trusted', 'A keyword: this System can\'t be Audited by a System with lower Trust than its own.', ''],
  ['Adversarial', 'A keyword: when this System is Audited, it deals 1 extra Flag back to the System that Audited it.', 'In AI, **adversarial** means working against another system, like two networks competing in a GAN.'],
  ['Attention', 'A keyword on the Transformer card. The card explains what it does.', '**Attention** lets a model focus on the most important parts of its input. It is the key idea behind modern chatbots.'],
  ['Legacy', 'A floppy-disk icon (💾) on the type bar of an old-tech Tool. Five cards (Obsolete, Defunct, Discontinued, Outdated, Expired) can discard any Tool, and draw you a card if it was a Legacy Tool.', 'A **legacy** system is older technology that is still in use but no longer the newest way of doing things. The floppy disk is the classic example: it used to be how everyone saved files, and today it survives mostly as the "Save" icon.'],
  ['Big Data', 'A keyword: **Big Data 2** means you may pay for the card by exerting one of your Systems that costs 2 or more, instead of paying Data.', '**Big data** means huge collections of data, too large to handle without powerful computers. A **dataset** is an organized collection of data, like thousands of labeled photos.'],
  ['Out of fresh data', 'If you need a card from your deck and it\'s empty, shuffle your discard pile to make a new deck and lose 1 Token.', 'When AI models are trained again and again on recycled or AI-made data instead of new, real data, they slowly get worse. Researchers call this **model collapse**.'],
  ['Discuss', 'The question at the bottom of every card. Your teacher may pause the game so you can talk about it.', ''],
];
const LAUNCH = [
  ['Launch Day', 'A team game. Players work together to make AI useful before it drifts out of control.', ''],
  ['Drift', 'When an AI System\'s Capability is higher than its Trust, it drifts: the Drift meter goes up 1.', 'In real AI, **drift** usually means a model slowly getting less accurate as the world changes around it. The game uses the word more broadly: an AI moving away from what people intended.'],
  ['Drift meter', 'A die that counts how far the AI has drifted. If it goes past 6, the whole team loses.', ''],
  ['Launch pile', 'The pile of AI cards the game flips each round. If it runs out before the team wins, the team loses.', ''],
  ['Aligned', 'An AI System whose Trust is at least as high as its Capability. It doesn\'t drift.', 'An AI is **aligned** when it does what people actually need and want. Keeping powerful AI aligned is called the **alignment problem**.'],
];
const ACRONYMS = [
  ['AI', 'Artificial Intelligence'],
  ['CPU', 'Central Processing Unit'],
  ['CUDA', 'Compute Unified Device Architecture'],
  ['GAN', 'Generative Adversarial Network'],
  ['GPT', 'Generative Pre-trained Transformer'],
  ['GPU', 'Graphics Processing Unit'],
  ['LLM', 'Large Language Model'],
  ['RAM', 'Random Access Memory'],
];

const cell = s => s.replace(/\|/g, '\\|');
let out = `# Tokens TCG: Terms and Definitions

A vocabulary guide for teachers to use with students. It covers the words used to **play** the game and the **AI terms** printed on the cards.

## How to use this guide

- **Before the first game:** go over the Game Terms. Students pick up the rules faster when they already know words like *Deploy*, *Exert*, and *Audit*.
- **Point out the "In real AI" column.** Many game words are real AI vocabulary. *Tokens*, *Training Set*, *Audit*, *Deprecated*, and *Attention* all mean something in the real world, and the game borrows those meanings on purpose.
- **Word wall:** post the terms from the Data Types your class is playing with.
- **Matching review:** read a definition aloud and have students find the card that matches it.
- **Exit ticket:** have each student pick one card they played and explain its term in their own words.

## Game Terms

| Term | In the game | In real AI |
|---|---|---|
${GAME.map(([t, g, r]) => `| **${cell(t)}** | ${cell(g)} | ${r ? cell(r) : '—'} |`).join('\n')}

### Launch Day terms

These words are used only in the Launch Day team game, which teaches the AI alignment problem.

| Term | In the game | In real AI |
|---|---|---|
${LAUNCH.map(([t, g, r]) => `| **${cell(t)}** | ${cell(g)} | ${r ? cell(r) : '—'} |`).join('\n')}

## AI Terms on the Cards

Every card teaches one AI idea. Cards are grouped by their Data Type (color), and each Data Type is one of the five big ideas about AI. Definitions match the printed cards.
`;
for (const [key, label, color, blurb] of SUITS) {
  const list = cards.filter(c => c.suit === key || (key === 'humans' && c.suit === 'any')).sort((a, b) => a.name.localeCompare(b.name));
  out += `\n### ${label} (${color})\n\n${blurb}\n\n| Term | Card type | Definition |\n|---|---|---|\n`;
  out += list.map(c => `| **${cell(c.name)}**${c.suit === 'any' ? ' (Chase)' : ''} | ${c.type} | ${cell(c.def)} |`).join('\n') + '\n';
}
out += `
## Teacher Resources

Background for teachers, not student-facing. The first two sources are what the card content is checked against; the third is for framing *why* an unplugged game.

| Resource | What it's for |
|---|---|
| [CSTA/AI4K12 "AI Learning Priorities for All K-12 Students"](https://ai4k12.org/) | The five big ideas this game's colors come from, plus grade-band outcomes. Most cards trace to a row in its Grades 6-8 tables. |
| [AI Pedagogy Project — Key Terms](https://aipedagogy.org/guide/key-terms/) (Harvard metaLAB) | Plain-language definitions of AI vocabulary, and a source of candidates for new cards. |
| [MIT: AI and Education](https://aiandeducation.mit.edu/report/) (August 2026) | Principles like "put humanity first" and "augmentation not automation." Note: it covers generative AI in *higher education*, with no K-12 classroom guidance, so use it for rationale rather than lesson content. |

### Materials in this project

| Material | Use it for |
|---|---|
| [How to Play](https://tokenstcg.com/how_to_play/) | A picture-first guide to hand a new player. |
| [Alpha Set](https://tokenstcg.com/sample_cards/) | All 70 cards of the Alpha Set on screen, filterable by color and type. |
| \`design/pilot-deck-60-cards.md\` | Every card's stats, ability, definition, and question, plus the appendix mapping cards to report sources. |
| \`design/GAME_CONCEPT.md\` | Full rules, the three classroom modes, and the playtest history. |
| [Print-and-play PDF](https://tokenstcg.com/design/print/tokens-print-and-play.pdf) | Every Alpha Set card, 9 per US Letter page with cut marks (8 pages, 300 DPI). Print at Actual Size / 100% and slide the cards into standard sleeves. |

### Three ways to run it

- **Quick Play** (10-20 min): the two-player game. Best after students know a few terms.
- **Discussion Mode: Draw the Line** (20-30 min): place cards on a line from Totally Fine to Crosses a Line, compare, and agree on a class line. No decks, no winner.
- **Launch Day** (25-30 min): a co-op game about the AI alignment problem. Players keep AI useful before it drifts out of control.

## Acronyms

| Short form | Stands for |
|---|---|
${ACRONYMS.map(([a, b]) => `| **${a}** | ${b} |`).join('\n')}
`;
fs.mkdirSync(R + 'teacher', { recursive: true });
fs.writeFileSync(R + 'teacher/terms-and-definitions.md', out);
console.log('game terms', GAME.length, '| launch day', LAUNCH.length, '| card terms', cards.length, '| acronyms', ACRONYMS.length);
