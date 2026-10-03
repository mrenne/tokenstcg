# Tokens — Beta Set Plan (draft)

**Status:** early draft, started 2026-10-03 while the Alpha Set is being playtested. Concepts first;
stats and abilities wait for playtest results, so new cards are built on rules that work with real
students.

The Alpha Set (70 cards) is described in [pilot-deck-60-cards.md](pilot-deck-60-cards.md) and the
rules in [GAME_CONCEPT.md](GAME_CONCEPT.md).

---

## Decisions to make first

| Question | Suggestion | Decided? |
|---|---|---|
| How big is the Beta Set? | About **35–40 new cards**, for a pool of roughly 105–110. Enough to feel new without doubling the art workload. | ☐ |
| Do Alpha cards stay legal? | **Yes.** Beta adds to Alpha instead of replacing it, so printed Alpha sets stay useful. | ☐ |
| Deck rules | The 20-card minimum and 2-copy limit were set for a small pool. With ~110 cards, consider a **30-card** minimum. Decide after playtesting. | ☐ |
| Set theme | **Generative AI and how people use it**: prompts, hallucinations, creative tools. It's what students actually meet, and Alpha covers it lightly. | ☐ |
| New keyword | **Transparent** is already in the rules (GAME_CONCEPT.md, Keyword abilities) but no card uses it. Beta could introduce it. | ☐ |
| Chase cards | 1–2 new Chase cards, earned the same way as Alpha's. | ☐ |

## Gaps in the Alpha Set

- **Uneven colors.** Blue has 9 cards against Black's 23. Red has no Tools; only Black has Datasets.

  | Color | Cards | Systems | Tools | Actions | Datasets |
  |---|---|---|---|---|---|
  | Green (Humans and AI) | 14 | 9 | 2 | 3 | 0 |
  | Blue (Representation & Reasoning) | 9 | 6 | 1 | 2 | 0 |
  | Black (Machine Learning) | 23 | 13 | 5 | 3 | 2 |
  | White (Ethical AI Design) | 12 | 6 | 3 | 3 | 0 |
  | Red (Societal Impacts) | 10 | 5 | 0 | 5 | 0 |
  | Chase (any color) | 2 | 1 | 0 | 1 | 0 |

- **Glossary terms with no card.** The AI Pedagogy Project Key Terms glossary (a listed content
  source) has six terms the game doesn't cover: **Algorithm, Generative AI, Foundation Model,
  Hallucination, Prompt, RLHF**.
- **Perception and natural interaction** (how AI sees, hears, and talks) are barely covered.

## Candidate concepts

Pick about 35. Type is a first guess; it can change once abilities are designed.

### Green: Humans and AI

| Concept | Likely type | Notes |
|---|---|---|
| Prompt | Action | Glossary term. How people ask generative AI for things. |
| Prompt Engineer | System | A newer AI job; pairs with AI Career Path. |
| Turing Test | Tool or Chase | Can you tell a person from a machine? Was a Chase idea for Alpha. |
| AI Tutor | System | AI that helps people learn; good classroom discussion. |
| Fact-Check | Action | Checking what an AI says before trusting it. |
| Hallucination | Action | Glossary term. AI confidently making things up. Could be Black instead. |
| AI Literacy | Tool | Knowing how AI works and when to trust it; the point of the whole game. |

### Blue: Representation & Reasoning (needs the most cards)

| Concept | Likely type | Notes |
|---|---|---|
| Algorithm | System | Glossary term. A step-by-step set of instructions. |
| Knowledge Graph | System | Facts stored as connected ideas. |
| Rule-Based System | System | "If this, then that" AI, the opposite of learned AI. |
| Heuristic | Tool | A rule of thumb that's fast but not always right. |
| Planning | Action | Choosing a sequence of steps toward a goal. |
| Probability | Tool | AI reasons with likelihoods, not certainties. |
| Pattern Recognition | System | Spotting regularities in data. |
| Encyclopedia (or Knowledge Base) | Dataset | Blue's first Dataset. |

### Black: Machine Learning

| Concept | Likely type | Notes |
|---|---|---|
| Generative AI | System | Glossary term. AI that makes new text, images, or sound. |
| Foundation Model | System | Glossary term. One big model adapted to many tasks. |
| RLHF | System or Action | Glossary term. Training AI with human feedback. |
| Overfitting | Action | Memorizing the training data instead of learning; good "gotcha" effect. |
| Test Set | Dataset | Data held back to check a model honestly. |
| Clustering | System | Grouping similar things without labels. |
| Synthetic Data | Dataset | Data made by AI to train AI. |
| Computer Vision | System | Perception: AI that sees. |
| Speech Recognition | System | Perception / natural interaction: AI that hears. |

### White: Ethical AI Design

| Concept | Likely type | Notes |
|---|---|---|
| Transparency | System | A natural home for the Transparent keyword. |
| Watermarking | Tool | Marking AI-made content so people can tell. |
| Data Minimization | Tool | Collecting only the data you need. |
| Content Moderation | Action | Deciding what AI should and shouldn't produce. |
| Opt-Out | Action | Letting people say no to their data being used. |
| Audit Trail | Tool | Keeping a record of what an AI decided and why. |

### Red: Societal Impacts (needs Tools)

| Concept | Likely type | Notes |
|---|---|---|
| Misinformation | Action | False information spread at scale. |
| Filter Bubble | System | Recommendations that only show you what you already like. |
| Facial Recognition | System | Useful and controversial; strong discussion card. |
| Accessibility | System | A positive impact: AI that helps people with disabilities. |
| Copyright | Action | Who owns AI-made art and the art it learned from? |
| Automation | System | Machines taking over tasks; pairs with Job Disruption. |
| Open Source | Tool | AI anyone can inspect and use. |
| Fact-Checker | Tool | Red's first Tool. |
| Media Literacy | Tool | Spotting fakes and judging sources. |

### Chase (1–2)

| Concept | Notes |
|---|---|
| Turing Test | If not used as a Green card. |
| Five Big Ideas | Celebrates the AI4K12 framework; rewards two-color decks. |

## After playtesting

- Fold in what students and teachers found: confusing rules, game length, deck balance, which
  Discuss questions worked.
- Then design abilities and stats, and check balance with the simulators (`tools/sim/`), testing
  Beta cards together with Alpha.
- For each chosen card: definition, Discuss question, report/glossary source for the teacher appendix.

## Tooling to set up once

- **Set label:** add a set field to the card data so cards can show "Beta" and number within their
  set (1/40). Today the builders assume one set.
- **Shared tools:** one art folder and checklist across sets (`design/icons/` names are by card name,
  so names must stay unique), and simulators that load both sets together.
