# Tokens — Game Concept (v0.3)

*Tokens: the unplugged collectible card game for middle grades AI literacy.*

## Sources — what grounds which part

This project draws on more than one reference document, each doing a different job. Worth keeping straight, since it's easy to conflate "the report" with "the whole design":

- **CSTA/AI4K12 "AI Learning Priorities for All K-12 Students" report** — grounds the *learning content*: the five categories, the grade-band outcomes, the vocabulary. This is what keeps the card set research-based rather than just "AI trivia we thought was neat." It is **not** expected to cover everything on every card — real-world companies and products (OpenAI, Claude, ChatGPT...) are grounded in general accuracy instead, since a vendor-neutral standards document doesn't name them.
- **Disney Lorcana Quickstart Rules** — grounds the *game mechanics*: the ink/Training-Set resource system, turn structure, combat, the Trainable marker convention. Purely a mechanical reference, unrelated to AI content.
- **Into Film's GAMERS resource** — grounded the early *card format* thinking (core card + expansion cards, a discussion question printed on every card) before the design settled into its current shape.
- **[AI Pedagogy Project](https://aipedagogy.org/)** (Harvard metaLAB / Berkman Klein Center) — a second *learning content* grounding source, alongside the AI4K12 report. Its **Key Terms glossary** (`aipedagogy.org/guide/key-terms/`) will matter most as new cards get designed: it's a clean, citable, plain-language definition source for exactly the kind of vocabulary this game turns into cards. Cross-checked against the current 55-card pool already — the glossary's 12 terms are Algorithm, Artificial Intelligence, Chatbot, Foundation Model, Generative AI, Hallucination, Large Language Model, Machine Learning, Neural Network, Prompt, Reinforcement Learning from Human Feedback (RLHF), and Training Data. Chatbot, LLM, Neural Network, and Training Data are already cards; Machine Learning and Reinforcement Learning are already covered (as a suit name and an existing card, respectively — RLHF is a more specific technique than our current Reinforcement Learning card and could become its own card later). **Not yet cards, and good candidates**: Algorithm, Foundation Model, Generative AI, Hallucination, Prompt.

Other references may get added as the project continues — this section exists so it's clear which claims should hold up to report scrutiny (content) versus which are creative/mechanical choices borrowed from elsewhere (format and rules).

## Brand assets

- **Logo**: both v1 and v2 have been deleted — not happy with either, a redesign is in progress. The landing page currently has no logo at all: just the "Tokens" title and tagline in large centered type, on the same cream/navy/blue palette the v2 logo had introduced. Once a new logo exists, the page can bring it back in.
- **Card back**: `assets/tokens_card_back.png` — a blue network-sphere-on-black image, for the eventual back of every physical card once printing begins. Visually close to the Representation & Reasoning suit's own full-art background (same network-sphere family) — treated as a deliberate shared visual signature across the game rather than a conflict, since front and back are never seen at the same time on a physical card. Doubling as the landing page's background image (with a vignette overlay for text contrast) until the new logo is ready.

## Elevator pitch

Students collect and trade cards representing real AI concepts — sensors, classifiers, training data, model cards, deepfakes — organized into the five official AI4K12 learning categories. Each player builds their own small deck, feeds cards into a **Training Set** to fuel their plays (Lorcana's inkwell, reskinned), deploys **Systems** that complete **Tasks** for Tokens, and can send a Running System into an **Audit** against an opponent's. First to a target Token count wins — the game's name doubles as its scoring currency, the same way Lorcana's name ties to "lore." A printed discussion question on every card lets a teacher pause play at any point and run it like a classroom activity, independent of any match in progress.

## What changed from v0.1

The original battle mechanic (compare Capability+Trust totals, with Boost/Audit/Reframe/Ripple/Human-in-the-Loop abilities) is gone. In its place: a resource-based deckbuilding system adapted directly from Disney Lorcana — ink → **Data**, characters → **Systems**, challenges → **Audits**, lore → **Tokens**. This keeps the Capability/Trust stat pair (now used the way Lorcana uses Strength/Willpower: a straightforward damage exchange) but drops the old comparison-and-counter mechanic entirely.

Card fronts no longer show a source citation — that mapping back to the report moves to a separate teacher's guide (future phase), keeping the student-facing card focused on the concept itself.

## Standards alignment

Most cards trace to a specific row in the report's Grades 6-8 tables (or, for a few "reach" cards, 9-12) — see the Teacher reference appendix in pilot-deck-55-cards.md for the mapping, including the handful of cards (real companies and products) that are grounded in general accuracy rather than the report itself. The five suits *are* the AI4K12 categories. The palette, though, no longer follows the report's own color wheel — it's now a classic five-color TCG identity (à la Magic: The Gathering), with each color picked for what it *means*, not just to look distinct:

| Suit ("Data Type") | Color | Why this color | What it covers | Report source |
|---|---|---|---|---|
| Humans and AI | **Green** | Human, natural, community-minded | How humans and AI differ, who builds AI, when to use it | Table 2 |
| Representation & Reasoning | **Blue** | Knowledge and logic | How AI encodes the world and reasons about it | Table 3 |
| Machine Learning | **Black** | Raw power and ambition, at a cost | Sensors, data, training, models | Table 4 |
| Ethical AI System Design | **White** | Order, fairness, protection | Fairness, bias mitigation, model cards, accountability | Table 5 |
| Societal Impacts of AI | **Red** | Chaos, real-world consequence, disruption | Individual/societal/environmental effects | Table 6 |

A deck draws from 1-2 Data Types, same as Lorcana restricts a deck to 1-2 inks — which doubles as a teaching constraint: a deck built only from Machine Learning (Black) and Societal Impacts (Red), say, plays very differently than one built from Ethical AI Design (White) and Humans and AI (Green), and picking a combination is itself a small lesson in how these categories relate.

## Card types

- **Systems** (≈ Characters): the AI concepts that do the work. Have Cost, Capability, Trust, and Tokens. Deployed face-up; can Run a Task or Run an Audit starting the turn *after* they're deployed (they need a turn to "finish training") unless they have the **Fast-Tracked** keyword.
- **Tools** (≈ Items): stay in play once deployed and usable immediately. No combat stats — just an ability, often a repeatable one paid for by exerting the Tool itself. E.g., a Model Card tool, a Bias Audit tool.
- **Actions**: a one-time effect, then discarded. Quick disruptive or helpful events — a regulation passing, a data breach, a viral deepfake.
- **Datasets** (≈ Songs, a subtype of Action): can be paid for normally with Data, *or* "processed for free" by exerting an already-deployed System with Cost 3 or higher instead. This rewards having a big System in play — mechanically, only a sufficiently large model can ingest a big dataset without extra cost.

## Card anatomy (student-facing)

- **Data Type band** (color + icon)
- **Cost** (top-left flap, how much Data to deploy)
- **Tokens** (top-right flap, mirrored — Systems only; shown as a pip count — one dot per Token scored on a Task — rather than a numeral, so it never reads as a second Cost). **Hard rule: no System's Tokens stat may exceed 4** — this is what makes the pip display work at all, and it's a permanent card-design constraint, not just true of the current pilot pool. Keep it in mind for every future card.
- **Name**, centered at the top between the two flaps, and **card type** (System / Tool / Action / Dataset)
- **Classification tags** (small category words referenced by some abilities, e.g. "Model," "Human Role," "Consequence")
- **Rarity gem**: Common / Uncommon / Rare / Chase
- **Stats** (Systems only): Capability and Trust sit in a stat row over the art; Tokens moved up to the top-right flap so it reads at a glance, the same way Cost does at top-left
- **Art**: full-bleed per-suit watermark art fills the whole card (no separate illustration panel) — Ability/Definition and the card-type bar sit in frosted translucent panels over it so they stay legible
- **Ability text** (keyword and/or plain-English rules text)
- **Definition** (1 sentence, plain-language)
- **Discussion question** (usable independent of any match)

No source citation on the card — that lives only in the (future) teacher's guide, alongside the report table/page each card maps to.

## The resource: your Training Set

Once per turn, a player may take a card from their hand — only cards marked **Trainable** — and put it face-down into their own **Training Set** instead of playing it. Every card in the Training Set is worth 1 Data, regardless of what it was; once it's in there, its front no longer matters. To deploy a card from hand, exert (pay) that many cards from your Training Set. This is Lorcana's inkwell mechanic, reskinned: you're literally spending old data to train new systems.

**The Trainable marker**: a diamond drawn directly around the Cost number itself — the same convention Lorcana uses (a hexagon around an inkable card's ink cost), just swapped for a diamond around ours. No diamond means the card can never be put into a Training Set, full stop. This needed no new space on the card; it just annotates the Cost flap that's already there.

**Resolved for now, coarsely**: every card's ring is set by a blanket rarity rule — Common and Uncommon are Trainable, Rare and the Chase card are not. That's Lorcana's own convention at its simplest (inkable cards skew toward Commons/lower cost so a deck always has fuel; a deck's best Rares and its Chase card are held back, so playing a prized card competes with burning it for Data). A real pass would vary this card-by-card rather than a flat rarity cutoff — worth revisiting once the pilot has actually been played.

## Game setup

Each player draws a **5-card opening hand**. Before the first turn, each player may take a **free mulligan**: shuffle your opening hand back into your deck and draw a fresh 5 — no cost, no card-count penalty, once only. (Confirmed via Round 7's real shuffled-deck playtest, which had been running on this as an untested assumption.)

## Turn structure

**Beginning phase:**
1. **Reboot** — untap (ready) all your exerted Systems/Tools *and* every exerted card in your Training Set. Like Lorcana's inkwell, Data is a reusable resource: your Training Set's total size is your Data ceiling each turn, not a one-time spend.
2. **Sync** — resolve any start-of-turn effects.
3. **Fetch** — draw a card (skip on the very first turn of the game).

**Main phase** — any of the following, any number of times, in any order:
- Once per turn: train a card into your Training Set.
- Deploy a card (System, Tool, Action, or Dataset) by paying its Data cost.
- With a System that's been in play since your last Reboot: **Run a Task** or **Run an Audit** (see below).
- Activate a Tool's ability.

### Escalating deploy costs

Your 1st and 2nd **System** deploy at printed Cost. Starting with your 3rd, each one costs 1 additional Data for every System you control beyond your 2nd — Tools, Actions, and Datasets are unaffected. So your 3rd System costs +1, your 4th costs +2, your 5th costs +3, and so on. This is the fix for the board-snowball problem found in playtesting (see below): a deck built to flood the board with many cheap Systems pays an increasing tax once it's past a small starting core, while a deck built around a few sturdier Systems barely notices it. Deprecated Systems no longer count once they leave play, so the tax can go back down over the course of a game, not just up.

## Scoring: Run a Task

Exert a System to gain Tokens equal to its Tokens stat. This is the primary way to score points — same role as Lorcana's "quest."

## Combat: Run an Audit

Exert one of your Systems to Audit an opponent's **exerted** System (you can't Audit one that's still idle/offline — same restriction as Lorcana's "can't challenge a ready character"). Both Systems simultaneously apply Flags (damage) to each other equal to their Capability. Any System whose accumulated Flags reach or exceed its Trust is **Deprecated** — discarded, the AI-flavored word for "banished." Flags stay on a System until removed by an effect or until it's Deprecated.

This is a straightforward damage exchange, not a stat-total comparison — a low-Capability, high-Trust card (like an Ethics-suit Tool-adjacent System) survives Audits it has no business winning on paper, simply because it's hard to knock out, while a high-Capability, low-Trust card (like a flashy Machine Learning System) trades hard but folds if Audited back.

## Win condition

First player to reach a target Token count wins. Suggested target for the pilot's smaller deck size: **15 Tokens** (Lorcana uses 20 lore, but that assumes 60-card decks with more turns to build up to it — 15 keeps a classroom match inside a reasonable period).

**Component note:** a player's running Token total is tracked externally, the same way Lorcana ships a lore tracker — it is never printed on a card. Each card only ever shows its own per-Task value (capped at 4, shown as pips), not anyone's cumulative score. Resolved as **bring-your-own-tracker**: a student can use a D20 (or any other counter they have) to track their own running total 0-15+, and the teacher will also have trackers on hand for students without one. This note belongs in the future Teacher's Guide (see the classroom distribution note above for the same pattern) — not something the card set itself needs to solve.

## Keyword abilities (starter set — more will emerge as we design more cards)

- **Fast-Tracked** — this System can Run a Task or Run an Audit the same turn it's deployed. (Machine Learning flavor: an agent that acts autonomously from the start.)
- **Audited** — this System can't be Audited by a System with lower Trust than its own. (Ethical AI Design flavor: a well-vetted system is hard to challenge unfairly.)
- **Transparent** — when this System would be Deprecated, its controller may first look at the top card of their deck and draw it if it's a Tool. (Societal Impacts flavor: openness about failure still has value.)

## Rarity & trading

- **Common** (grade 6-8 core concept, ~60% of pool)
- **Uncommon** (grade 3-5 or 9-12 crossover concept, ~25%)
- **Rare** (one "big idea" per suit, ~12%): higher stats or stronger text, meant to be the cards students most want to trade for.
- **Chase** (1 in the pilot pool): **"AI Isn't Magic"** — an Action playable regardless of your deck's Data Types: "Choose target System. It can't use abilities until your controller's next turn." Ties to the report's most-repeated refrain (p. 7, p. 36). Chase cards carry strong effects and are meant to be significantly harder to get than a Rare — see the classroom distribution note below.

(Lorcana uses a 5th tier, Legendary, above Rare — Chase already fills that slot for us, one tier up from Rare, so no additional tier is needed for now.)

### Classroom distribution (note for the future Teacher's Guide)

Every student gets the same **base set** — every Common, Uncommon, and Rare in the pilot pool — directly from the teacher, so no one starts behind on the content itself. **Chase cards are not part of the base set.** How a Chase card is earned is left entirely up to the teacher (a class challenge, a quiz, a raffle, finishing an assignment, whatever fits their classroom) — the game doesn't prescribe a method. This keeps trading meaningful (everyone already owns the fundamentals, so trades are about completing rarer holdings or favorites, not filling gaps in required content) while giving the teacher a lever to make the Chase card feel genuinely earned. This note exists here only to not get lost — it belongs in the Teacher's Guide once that document exists.

## Deckbuilding (scaled down for the pilot)

Lorcana requires 60+ cards, max 4 copies of any card, from 1-2 inks. With only 55 unique cards in the pilot pool, that ratio doesn't work yet — so for now:
- **Deck size:** 20 cards minimum, built from your own collection plus trades.
- **Copy limit:** max 2 copies of any single card.
- **Data Types:** cards from 1-2 suits only.

Revisit these numbers once the full card pool (multiple grade bands, both Common variety and enough Rares) is large enough to support something closer to Lorcana's real ratios.

## Classroom use modes

1. **Quick Play** (10-20 min): the full mechanic above, playable in one class period once a few turns are demoed.
2. **Discussion Mode** (GAMERS-style, 15-30 min): teacher pulls cards by suit, reads the definition and discussion question aloud, no deck or match involved at all.
3. **Launch Day** (co-op, teaches AI alignment, 2 players or 2 teams, ~25-30 min): the players are the safety team at an AI company that's launching new AI as fast as it can. They win together by making AI **useful to people** (earning Tokens) before it **drifts out of control** or the launch happens without them. Students feel the AI alignment problem — capability racing ahead of oversight — instead of hearing it explained.

   **Setup**
   - **AI deck:** shuffle every Black (Machine Learning) and Red (Societal Impacts) card together, then deal **8 cards face-down** as the **Launch pile**. The rest go back in the box. The game plays this pile by itself.
   - **Player decks:** each player builds a deck from White, Green, and Blue cards (1-2 suits, normal deckbuilding rules), draws 5, and may take the usual free mulligan.
   - **Drift meter:** a d6 starting at 1. If Drift would push it past 6, the team loses.
   - **Team Tokens:** each player tracks their own Tokens as usual. The team wins when the two totals **add up to 40**.
   - **Groups of 3-4:** play as 2 pairs, each pair sharing one deck and deciding its moves together. The numbers were tuned for 2 players; larger teams made the game an "always Audit" puzzle with no real dilemma.

   **Each round**
   1. **Players' phase.** Each player takes a normal turn: Reboot, Fetch, train, deploy, Run a Task, Run an Audit. Players go first; the AI doesn't flip anything until the players have had a turn. Changes from a normal turn:
      - **You can Audit any AI System at any time**, because AI Systems always count as exerted. Damage works as usual: the AI System hits back with its Capability. A Deprecated AI System stops drifting.
      - **Your own Systems drift too.** If a player's System with **Capability higher than its Trust** (ChatGPT, OpenAI, Predictor, Recommender...) Runs a Task, the meter goes up 1. Taking shortcuts with powerful tools costs the whole team.
      - **Cards that targeted an opponent now target the AI:**
        - Manual Override, Compliance Review, Ambiguous Input: one AI System doesn't drift in the next AI phase.
        - Mandatory Recall: no AI System drifts in the next AI phase.
        - Human-in-the-Loop: exert to lower the meter by 2.
        - Model Card: once per round, lower the meter by 1.
   2. **AI phase.** Flip the top card of the Launch pile.
      - **If it's a System**, it joins the AI zone and stays. Then **every AI System with Capability higher than its Trust drifts: +1 on the meter.** Aligned AI Systems (Sensor, Neuron, Supervised Learning, AI in Daily Life, Digital Divide) never drift. AI Systems ignore their ability text, except GAN (hits back +1 when Audited) and Reinforcement Learning (+1 on the meter when it's Deprecated — even shutting it down has a cost, a ready-made example of reward hacking).
      - **If it's an Action or Tool**, it happens right away, aimed at the team:

        | AI card | What it does to the team |
        |---|---|
        | Bias in Data | +1 Flag on the team's highest-Token System |
        | Retraining Pause, Job Disruption | The team's highest-Token System can't Run a Task next turn |
        | Environmental Footprint | Each player discards 1 card from their Training Set |
        | Cognitive Offload | Each player discards 1 card from hand |
        | Training Data, ImageNet | The AI speeds up: flip another card now (which also brings launch closer) |
        | CUDA | All AI Systems get +1 Capability for the rest of the game |
        | Regulation Debate | Good news: each player may train an extra card next turn |
        | Tensor | Nothing |
   3. **Check.** Team Tokens reach 40 → everyone wins. The meter goes past 6 → everyone loses. **The Launch pile is empty at the start of an AI phase → launch day arrived and the team wasn't ready: everyone loses.**

   **Why it's interesting to play:** every turn is a choice between scoring and safety. Should your Claude Run a Task for 2 Tokens, or Audit the Neural Network that's adding +1 to the meter every round? The launch deadline makes over-caution lose too, so "just Audit everything" isn't safe either. Students argue about it out loud — that argument is the lesson.

   **Teacher debrief (2-3 min):** "When did you choose safety over scoring? Was it worth it?" / "Which AI card was the hardest to handle, and why?" / "Did anyone take a shortcut that hurt the team?"

   **Optional card tweak:** a small warning triangle beside the stats on any System where Capability > Trust, so students spot drifting Systems at a glance. Ignored in the other modes.

   **Playtest (Round 9, simulated):** a scripted co-op simulator compared three team strategies — **greedy** (always score, ignore the AI), **safety-first** (Audit whenever possible), and **balanced** (score, but deal with the AI when the meter gets dangerous). A good tuning makes balanced clearly beat both extremes.
   - First draft (meter 10, targets 20-30, no deadline) was far too easy: balanced won 92-96%, and safety-first won just as often, so caution had no cost.
   - Adding a deadline fixed the dilemma. A fixed round limit worked, but the **Launch pile** does the same job with no extra counter, and Datasets flipping an extra card makes training data literally speed up the launch.
   - 9% of games were lost by round 4, before players could really act. Letting **players go first** cut that to 1%.
   - **Final numbers (8-card pile, d6 meter, target 40), 5,000 games per strategy:** balanced wins **68%**, safety-first **59%**, greedy **23%**; about 7.5 rounds.
   - **3-4 players as individuals didn't work:** the AI had to flip 2 cards a round to keep up, and at that pressure always Auditing was best (safety ≈ balanced) — hence the "play as 2 pairs" rule.
   - **Caveats:** bot players, not students; the balanced bot is simple, so a thoughtful team may beat 68%. That's about right for a classroom co-op (winnable, not guaranteed), but the gap between balanced and safety-first (9 points) is smaller than ideal and worth watching in a real playtest.

   *History:* before Launch Day, an alignment mode was tried as a competitive Quick Play game with a Drift rule (Round 8, simulated): Systems with Capability > Trust gained a Flag each Task. It worked mechanically but didn't bring in the human side of alignment, so it was replaced by this co-op version. The Drift idea carries over. Round 8 also found that Black decks were the weakest in the *base* game in simulation (31-36%), unlike Round 7's hand-played result — still worth a closer look. *(Build-a-System mode, the earlier cooperative stretch-goal idea, was dropped in favor of Launch Day.)*

## Pilot scope (this phase)

- 55 cards across the 5 suits (1 of which is the Chase card), mostly Systems with a handful of Tools/Actions/a Dataset woven in (see pilot-deck-55-cards.md for the full, type-tagged list).
- Print-and-play: card fronts only, standard poker-card size, designed for a home/office color printer.
- One class, one unit, playtested and iterated before any larger print run.

## Open questions / next steps

1. ~~Playtest the new Audit math~~ — three rounds of playtesting so far:
   - **Round 1**: Black+Red "capability" deck beat White+Green "trust wall" 12-1 by turn 9. Diagnosis: only Red had a tempo-denial effect.
   - **Round 2**: added one single-target tempo-denial Action per suit. Result: A still won at turn 9 (now 15-2) — the denial worked exactly as written (it stopped one System for one turn, and even created a nice moment where a denied System pivoted to Auditing instead), but a single-target effect can't keep up once an opponent has 3-4 Systems online tasking simultaneously. Diagnosis: the real gap is board width, not the absence of removal.
   - **Round 3**: added **Mandatory Recall** (White, Rare, Cost 4) — a true board-wide "none of your opponent's Systems can Run a Task next turn." Result: it bought B exactly one extra turn cycle (A's win moved from turn 9 to turn 11) but didn't change the outcome, because it only pauses scoring for a turn rather than removing anything — A's board comes right back online the turn after and immediately dumps 11 Tokens at once. It's a Time Walk, not a Wrath.
   - **Round 4**: escalating deploy cost at +1 Data per *every* System already controlled (uncapped). A's curve collapsed hard (Deepfake 3, Neural Network 5, Reinforcement Learning 7, LLM 9) and B — fewer, sturdier Systems plus untaxed Tools — actually won first, at turn 14 vs. A's projected turn 15. Real fix, but flipped the advantage, suggesting the rate was a bit hot.
   - **Round 5**: softened to +1 Data per *2* Systems already controlled (Deepfake 2, Neural Network 4, Reinforcement Learning 5, LLM 7). Result: A's plan barely felt taxed at all through its first four Systems and won again at turn 11 — B was only at 12 Tokens on its last turn before that. This essentially reverts most of round 4's correction; +1-per-2 sits too close to the original no-tax pacing to matter much.
   - **Round 6**: tax starts at the 3rd System instead of scaling from the 1st (3rd System +1, 4th +2, 5th +3...). Result: the closest race yet — A crosses 15 Tokens at turn 13, B crosses 15 at turn 12, a **one-turn margin** instead of the multi-turn swings in rounds 4-5. Both decks land in the low-to-mid teens on a similar schedule; B still edges A out, but narrowly rather than decisively.
   - **Reading across all four rates tested**: no tax → A wins turn 9 (blowout). +1-per-System from the start → B wins turn 14 (overcorrected). +1-per-2-Systems → A wins turn 11 (undercorrected, nearly reverts the fix). Tax starting at the 3rd System → B wins turn 12, A turn 13 (tightest race). This last rate is the best result of the four, but it's still one hand-simulated sequence each time, and the outcome has visibly moved by 1-5 turns based on small sequencing choices I made while playing both sides — that's real signal the mechanic matters, but not a substitute for actual randomized games.
   - **Round 7 — first real shuffled-deck game** (tax-from-3rd-System rate): built actual 24-card (Black+Red) and 22-card (White+Green, Chase excluded) decks, shuffled both with real OS randomness (not hand-picked order), 5-card opening hands, played turn-by-turn with decisions made only on information revealed so far. Result: the tightest race yet — B actually led 13–12 after turn 10 (the tax genuinely stranded two of B's Systems at an unaffordable cost on turn 8), before A's Large Language Model (dead in hand turns 1-8, too expensive) landed with Fast-Tracked on turn 9 and combined with a second Fast-Tracked play from B on turn 10 to produce a photo finish — A won turn 11, 18–13, off one explosive double-task turn rather than a rounds-long lead. This is real evidence (not hand-curated) that "tax from the 3rd System" is a good rate: close race, resolved by a dramatic swing turn, not a blowout.
   - **A rules gap surfaced by actually trying to play a game**: there was no documented starting hand size or mulligan rule anywhere in this doc — Round 7 ran on an untested assumption (5 cards, no mulligan). Now formalized as the real rule (see Game Setup, above): 5-card opening hand, one free mulligan.
   - Still true: this is one game. The next real step is more of these — ideally with two actual people playing, not one person simulating both sides — before trusting the rate further.
2. ~~Art direction~~ — settled, now rarity-differentiated:
   - **Common/Uncommon**: a small windowed art box near the top (like a traditional trading card), the rest of the card a solid suit-colored body.
   - **Rare/Chase**: true full-art — the background photo fills the entire card edge to edge, and even the Discuss banner turns translucent so the art shows through it too. The rarity itself is part of what makes a card feel special, not just its stats.
   - The small per-card watermark icon that used to sit on every card is gone entirely — real photography replaced it rather than layering on top of it.
   - Backgrounds are real provided imagery, color-matched per suit: a green/blue/purple network-sphere motif for Humans and AI, Representation & Reasoning, and Chase; a dark network texture for Machine Learning; a pale cream blur for Ethical AI Design; vivid red circles for Societal Impacts. Source images live in design/backgrounds/ (254 provided), with the 6 chosen ones cropped to card aspect and compressed in design/backgrounds/selected/.
3. Physical production: home-print for the pilot; if it works, a print-on-demand card service (e.g. MakePlayingCards/MPC) for a real box set with an actual custom card back.
4. Teacher playtest partner and available class time.
5. Teacher's guide (future phase): a parallel document restoring the source citation for each card (report or otherwise, per the Sources section above), for the educator's own reference — not shown to students.

See [pilot-deck-55-cards.md](pilot-deck-55-cards.md) for the full card list with types, stats, and abilities.
