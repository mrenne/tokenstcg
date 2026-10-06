# Build tools

Scripts that turn the card data into everything published: card images, the website pages, the
teacher terms guide, and the print-and-play PDF, plus the game simulators used to check balance.

They need [Node.js](https://nodejs.org/) and Google Chrome (used headless to render cards and make
the PDF). If Chrome isn't in its usual place, set `CHROME` to its path. Run everything from the
repository root. Temporary renders go in `tools/.cache/`, which isn't committed.

## Where the card data lives

- **`design/design-v1/print-sheet-source.html`**: what the builders read: each card's cost,
  stats, rarity, ability, definition, and Discuss question, in card-number order.
- **`design/pilot-deck-60-cards.md`**: the readable card list, which the simulators read.
- **`design/icons/<card-name>.png`**: the card artwork. Kept local only, never committed.

The two data files must agree. When a card changes, update both.

## After changing cards or art

Run these in order:

```bash
node design/frame-v2/build-card.js --all   # 1. card proofs (design/frame-v2/proof-*.html)
node tools/check-card-fit.js               # 2. confirm every card's text fits
node tools/render-card-images.js           # 3. card images for the site (assets/cards/*.webp)
node tools/build-alpha-set.js              # 4. Alpha Set page (sample_cards/index.html)
node tools/build-how-to-play.js            # 5. How to Play page (how_to_play/index.html)
node tools/build-terms.js                  # 6. teacher/terms-and-definitions.md
node tools/build-print-pdf.js              # 7. design/print/tokens-print-and-play.pdf
node tools/build-learn.js                  # 8. card lookup pages (learn/)
```

Step 7 uses the full-size card renders that step 3 leaves in `tools/.cache/cards/`. Run it only
when the printed cards should change; it rewrites the 12 MB PDF even when nothing visible changed.
`BACKS=1 node tools/build-print-pdf.js` adds card-back pages for double-sided printing (not
published).

Step 8 builds the "Look up your card" pages from the card data plus the "In real life" and "Try it"
text in `design/learn-content.json`. They're live at tokenstcg.com/learn/ but hidden: no link from
the homepage, and every page is tagged noindex so search engines leave them out.

`node tools/make-goldnet.js` redraws the gold network behind White Rare cards
(`design/backgrounds/selected/ethics-goldnet.svg`). It only needs running if the pattern changes.

## Playtest handouts

Printed rules and playtest forms are on hold until the Alpha Set has been playtested, since the rules
are likely to change. Drafts are kept outside the repo for now; their PDF output folder,
`design/print/playtest/`, is ignored by git.

## Balance simulators (`tools/sim/`)

```bash
node tools/sim/quickplay-balance.js    # every two-color deck vs. every other, 500 games per matchup
node tools/sim/launchday-balance.js    # Launch Day win rates by strategy, at the 45-Token target
```

Both read the live card list. The players are simple rule-of-thumb AIs, so the results show broad
balance (which colors and cards are too strong or weak), not how real students play. Results from
each design round are written up in `design/GAME_CONCEPT.md`.

| File | What it is |
|---|---|
| `quickplay.js` | Quick Play rules and player AI for one game |
| `launchday.js` | Launch Day rules and team/AI-deck behavior for one game |
| `load-cards.js` | Reads `design/pilot-deck-60-cards.md` into the simulators (`node tools/sim/load-cards.js` prints a summary) |

Each simulator lists its experiment switches (environment variables) at the top of the file.
When a card gets a new ability, add its effect to `quickplay.js` (and `launchday.js` if it affects
Launch Day), or the simulators will treat it as a card with no ability.
