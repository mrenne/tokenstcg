# Tokens

**Tokens: the unplugged collectible card game for middle grades AI literacy.**

Students collect and trade cards representing real AI concepts, organized into five suits grounded in the CSTA/AI4K12 "AI Learning Priorities for All K-12 Students" report. Mechanics are adapted from Disney Lorcana's quickstart rules. No screens required to play — the "unplugged" part is the point.

- **Website**: [tokenstcg.com](https://tokenstcg.com/) — coming soon
- **Game design**: [design/GAME_CONCEPT.md](design/GAME_CONCEPT.md)
- **Full card list**: [design/pilot-deck-60-cards.md](design/pilot-deck-60-cards.md)
- **How to play** (visual guide for new players): [how_to_play/index.html](how_to_play/index.html) — live at [tokenstcg.com/how_to_play](https://tokenstcg.com/how_to_play/)
- **Terms and definitions** (for teachers to use with students): [teacher/terms-and-definitions.md](teacher/terms-and-definitions.md)
- **New card frame (v2, in progress)**: proofs in `design/frame-v2/`; build any card with `node design/frame-v2/build-card.js "Card Name"` or every card with `--all`. PNG renders are kept local (not committed): open a card's HTML in Chrome, or see the render command at the top of `build-card.js`
- **Print-and-play sheets**: `design/design-v1/tokens-print-page-*.png` (v1 card design, 8 pages, all 65 cards, sized for home printing at true 300 DPI — print at Actual Size / 100%)

## Status

Early design/pilot phase — not yet playtested with real students. See the "Open questions / next steps" section of GAME_CONCEPT.md for what's still unresolved.

## Repo notes

`design/backgrounds/` holds 254 raw source images used to pick card art; it's excluded from this repo for size (~130MB) and kept local-only. The small processed subset actually used by the print sheet (`design/backgrounds/selected/`) is included.
