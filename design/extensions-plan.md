# Tokens — Extensions Plan (draft)

**Status:** idea list, started 2026-10-04 while the Alpha Set is being playtested. Nothing here is
built for release yet. Pick from it after playtesting, alongside the [Beta Set plan](beta-set-plan.md).

**Goal:** give students a way to learn more about the AI ideas on their cards online, without turning
an unplugged game into a screen game. The cards and the conversation stay the main event; the website
is an optional "learn more."

---

## Ground rules for anything online

Students are in grades 6–8, and many are under 13.

- **No accounts, logins, or student names.** Any progress is saved only on the student's own device.
- **No embedded third-party videos or trackers.** Videos bring ads, recommendations, and tracking.
- **Short and phone-friendly.** Each page should extend the conversation, not replace the cards.
- **Kept out of search** (noindex) until the material is ready to share widely.

## Connecting the cards to a website

### 1. "Look up your card" pages ★ top pick

**Status: live 2026-10-06 at tokenstcg.com/learn/, hidden** (not linked from the homepage, noindex). `node tools/build-learn.js` makes `learn/` (a lookup page plus a
page for each card). The "In real life" and "Try it" text for every card is in `design/learn-content.json`.
Link it from the Educator Resources page when that goes live, not from the homepage.

- A page such as `tokenstcg.com/learn` where a student types a card's number (it's printed on every
  card, e.g. 24/70) or its name, and lands on that card's own page.
- Each card page: a plain-language explanation, a real-world example, a 2-minute activity, the Discuss
  question, and (later) a link to the matching mini lab (#2).
- No change to the printed cards: no QR codes, no stickers. The web page is a curious extra.
- With the Beta Set, numbers need the set too ("Beta 12/40"); see the set-label item in the Beta plan.

### 2. Mini AI labs, one per color ★ start here, with #1

Short hands-on activities that run entirely on the page.

| Color | Lab idea | Status |
|---|---|---|
| Green | Spot the chatbot: was this answer written by a person or an AI? | idea |
| Blue | Build a decision tree that sorts animals | idea |
| Black | Train a tiny classifier by sorting examples, then watch it fail on something new | idea |
| White | Find the bias in a lopsided dataset | idea |
| Red | A filter-bubble simulator, or "real or deepfake?" | idea |
| Chase / any | Next-word predictor (AI Isn't Magic): pick each word from the AI's guesses | built, then removed; saved in git (commit a342ace) |
| Chase / any | Give the AI a goal (Alignment): vague goals get gamed | built, then removed; saved in git (commit a342ace) |

The two built pages were first made as NFC "hidden card" pages, taken down on 2026-10-04, and deleted
locally on 2026-10-06 while card scanning is worked out. To bring one back:
`git show a342ace:scan/alignment/index.html`. Once labs exist, add a `"lab"` path to a card in
`design/learn-content.json` and the card page shows a lab button.

### 3. AI Literacy Passport

Each finished lab earns a stamp for its color, saved only in the student's browser (no account).
Collecting all five colors mirrors the card game, and a teacher can check passports in class.

### 4. Searchable glossary page

Turn `teacher/terms-and-definitions.md` (built by `tools/build-terms.js`) into a website page students
can search mid-game.

### On hold: NFC stickers

Tap-to-open NFC stickers hidden on cards (no app needed on most phones). Tried on the two Chase cards,
then put on hold; may come back for all cards. If it does, decide the landing-page links first, since
stickers are written once and locked.

## Extending the game itself

### 5. Design-a-card activity

Students make their own card from a printable template: a name, a definition in their own words, and a
Discuss question. Writing a good definition is AI literacy practice. Strong student cards could be
considered for a future set (with permission).

### 6. Online deck builder

Pick cards from the Alpha Set, check the deck is legal (25+ cards, 1–2 colors, no more than 2 copies),
and print a deck list. It could also run the balance simulator (`tools/sim/`) in the browser:
"Your deck wins 54% against Black+Red."

### 7. Solo puzzles

"Win this turn" setups using real cards, printed or on the website, for students who finish early.

### 8. Class events

A class league, a seasonal event deck, or new Launch Day scenarios (a school AI launch, a city AI
launch) that reuse the same cards.

## For teachers

### 9. Finish Educator Resources

The page is drafted locally (`educator_resources/`, unpublished). Add one lesson plan per color, a
Discussion Mode question bank, and worksheets that pair with the mini labs.

### 10. A curated "try real AI" list

Free, school-friendly tools that match each color. Candidates to review: Google's Teachable Machine,
Quick, Draw!, Code.org's AI lessons, and MIT's Day of AI materials. *Check each against school
policies (accounts, data, age limits) before linking.*

## Suggested order

1. After playtesting: link the live #1 card lookup pages from Educator Resources (#9) when it launches.
2. Then the remaining color labs (#2) and the Passport (#3).
3. With the Beta Set: Beta card pages, the deck builder (#6), and design-a-card (#5).
