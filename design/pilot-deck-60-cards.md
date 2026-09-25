undefined | undefined |undefined | undefined |undefined | undefined |undefined | undefined |# Tokens — Pilot Deck, 65 Cards (v0.9)

Stats shown as `Cost | Capability / Trust / Tokens` for Systems. Tools, Actions, and Datasets show `Cost` and their effect only — they have no combat stats. Rarity: C = Common, U = Uncommon, R = Rare, **Ch = Chase** (see GAME_CONCEPT.md's classroom distribution note — Chase cards aren't part of the base set every student receives). **💾 Legacy** marks old-tech Tools: the card shows a floppy-disk icon in its type line, and the Obsolete Action rewards discarding one.

No source citations here on the student-facing content — see the **Teacher reference appendix** at the bottom of this file for where each card's content is grounded: most trace back to the AI Priorities report, a few (company/product types and computing hardware) to general accuracy instead, since the report is a content-accuracy grounding document, not the sole source for this project (see GAME_CONCEPT.md's Sources section). That mapping migrates into its own teacher's guide in a later phase.

**House style — discussion questions:** one short sentence, aim for **under ~85 characters**. The card face has a fixed physical size; the mockup auto-shrinks text that runs long, but that's a safety net, not a substitute for writing tight in the first place — a question that needs shrinking to fit is a sign to rewrite it, not just an acceptable outcome.

## Humans and AI (green) — 14 cards

| Card | Type | Rarity | Cost \| Cap/Trust/Tokens | Ability | Definition | Discussion question |
|---|---|---|---|---|---|---|
| Not Alive | System | C | 1 \| 1/3/1 | — | AI systems can perform human-like tasks but aren't alive or conscious. | What's one thing a human can do that no card in this deck can? |
| The Human Trainer | System | C | 2 \| 1/3/2 | Whenever this System Runs a Task, you may put the top card of your deck into your Training Set. | Humans label the examples an AI learns from. | If a labeler makes mistakes, what does the model learn? |
| Human-in-the-Loop | Tool | C | 2 | {E} — Remove up to 2 Flags from target System. | A design where a human reviews or overrides an automated decision before it takes effect. | Name a task where you'd always want a human to double-check the AI. |
| Chatbot | System | C | 1 \| 1/2/1 | — | A conversational agent that talks with people via text or voice. | How can you tell whether you're talking to a chatbot or a real person? |
| Agent | System | U | 3 \| 2/2/2 | **Fast-Tracked.** | An AI program that senses its environment, decides, and acts — physical (robot) or software. | What's the difference between an "agent" and a simple chatbot? |
| AI Career Path | Action | U | 1 | Draw a card. | People work on AI as data labelers, model trainers, ethicists, and more — not just "programmers." | Which AI-related job sounds most interesting to you, and why? |
| Manual Override | Action | C | 2 | Target opponent's System can't Run a Task next turn. | A person steps in to pause an automated process before it can act again. | When should a person be allowed to override an AI's decision? |
| **AI Isn't Magic** | Action | **Ch** | 2 (any Data Type) | Choose target System. It can't use abilities until its controller's next turn. | *Wildcard.* Ties to the report's most-repeated refrain: AI isn't sentient or magical — it's a tool built by people. | What's something people assume AI can do that it actually can't? |
| Python | Tool | C | 1 | {E} — Draw a card. | A programming language popular for building AI models because it's readable and has huge community support. | Why might a beginner-friendly language end up being what experts use too? |
| Fast-Moving Lab | System | R | 3 \| 3/2/2 | **Fast-Tracked.** | An AI research company that races to release powerful new tools to the public quickly. | What's a tradeoff of a company releasing powerful AI tools quickly? |
| Safety Lab | System | R | 3 \| 2/4/2 | **Highly Trusted.** | An AI company that makes safety research a core part of how it builds AI systems. | Should a company that builds AI also be the one checking it's safe? |
| AI Assistant | System | U | 3 \| 2/3/2 | **Highly Trusted.** | A conversational AI built to help people with writing, questions, and analysis. | What would you want to double-check before trusting a chatbot's answer? |
| Viral App | System | C | 3 \| 3/2/2 | **Fast-Tracked.** | An AI chatbot app that spread to millions of people faster than almost any app before it. | Why might a chatbot become popular faster than almost any app before it? |
| Built-in AI | System | C | 2 \| 2/2/2 | — | An AI assistant built right into search, email, and other apps people already use every day. | What's different about an AI built into apps you already use daily? |

## Representation and Reasoning (blue) — 8 cards

| Card | Type | Rarity | Cost \| Cap/Trust/Tokens | Ability | Definition | Discussion question |
|---|---|---|---|---|---|---|
| Abstraction | System | C | 1 \| 1/2/1 | — | A representation that keeps some features and leaves others out. | If you drew a map of your school, what would you leave out? |
| Feature Vector | Tool | C | 2 | 💾 **Legacy.** {E} — Look at the top 2 cards of your deck. Put one into your hand, the other on the bottom. | A list of numbers encoding an object's key traits so an algorithm can use them. | What 3 "features" would you use to describe your favorite animal to a computer? |
| Classifier | System | C | 2 \| 2/2/2 | — | A model that sorts input into categories, like spam vs. not-spam. | What's something in your life that gets automatically "classified" for you? |
| Predictor | System | C | 2 \| 3/1/2 | — | A model that outputs a continuous value, like estimating a house's price. | What would you want an AI to predict for you, if it could? |
| Recommender | System | C | 2 \| 3/1/2 | — | A model that suggests items based on what similar users liked. | Has a recommendation ever felt "too accurate"? Why might that happen? |
| Decision Tree | System | U | 3 \| 2/4/2 | **Highly Trusted.** | A series of yes/no tests that leads to a decision — explainable step by step. | Sketch a 3-question decision tree for "what should I eat for lunch?" |
| Search Tree | System | R | 3 \| 3/3/3 | Whenever this System Runs a Task, look at the top 3 cards of your deck; put one into your hand. | A branching map of possible moves an AI explores to find the best one, like in tic-tac-toe. | Why might exploring every possible move become impossible for a more complex game? |
| Ambiguous Input | Action | C | 1 | Target opponent's System can't Run a Task next turn. | Poorly represented or unclear data makes it hard for an AI system to act reliably. | Why might unclear instructions make an AI "freeze up" or give a bad answer? |

## Machine Learning (black) — 22 cards

| Card | Type | Rarity | Cost \| Cap/Trust/Tokens | Ability | Definition | Discussion question |
|---|---|---|---|---|---|---|
| Sensor | System | C | 1 \| 1/2/1 | — | Hardware that turns a physical signal (light, sound) into data a computer can use. | What sensors does your phone have, and what does each one "sense"? |
| Training Data | Dataset | C | 2 (or free: exert a Cost-3+ System) | Put the top 2 cards of your deck into your Training Set face-down. | The examples a model learns from before it's used. | Why would a model trained only on cat photos fail to recognize dogs? |
| Bias in Data | Action | C | 1 | Target opponent's System gets +1 Flag. | A systematic skew in a dataset that leads to unfair or inaccurate outputs. | Can you think of a dataset that might accidentally leave a group out? |
| Supervised Learning | System | C | 2 \| 3/3/2 | — | Training a model on labeled examples so it learns to match inputs to known answers. | Why does supervised learning need humans to label the answers first? |
| Neural Network | System | U | 2 \| 4/2/2 | — | Many simple processing units organized to jointly solve a complex problem. | Neural networks are inspired by brains — how are they different from real ones? |
| Large Language Model | System | R | 5 \| 5/2/4 | **Fast-Tracked.** | A neural network trained on massive text data, used for chat, writing, and more. | Why might an LLM sound confident even when it's wrong? |
| Reinforcement Learning | System | U | 4 \| 3/2/3 | Whenever this System is Deprecated, gain 1 Token. | A model learns by trial and error, guided by a reward signal instead of labeled answers. | What's a game where trial-and-error is exactly how you'd learn to play well? |
| Retraining Pause | Action | C | 2 | Target opponent's System can't Run a Task next turn. | A model taken offline for retraining can't be used again until the update finishes. | Why do AI companies periodically retrain or update their models? |
| Neuron | System | C | 1 \| 1/2/1 | — | The smallest processing unit in a neural network — many of them together form the whole model. | How is one neuron different from the whole Neural Network card? |
| Tensor | Tool | C | 1 | {E} — Look at the top card of your deck. You may put it on the bottom. | A multi-dimensional grid of numbers — the basic data structure nearly every AI model computes with. | Why might a model need numbers arranged in a grid instead of a list? |
| CUDA | Tool | C | 2 | {E} — Target System gets +1 Capability until end of turn. | A platform that lets AI models run on graphics chips (GPUs), training far faster than on a regular computer. | Why would training a huge model need special, faster hardware? |
| ImageNet | Dataset | U | 2 (or free: exert a Cost-3+ System) | Put the top 3 cards of your deck into your Training Set face-down. | A massive labeled image dataset that helped launch the modern boom in computer vision. | Why did one giant, carefully labeled dataset change what AI could do? |
| GAN | System | U | 2 \| 3/1/2 | **Adversarial.** | Two networks compete: one makes fakes, the other tries to catch them. | Why might two competing AIs both get better? |
| Diffusion Model | System | U | 2 \| 3/2/2 | Whenever this System Runs a Task, remove 1 Flag from it. | A model that generates images by starting with noise and gradually refining it into a picture. | How is starting from random noise different from drawing from scratch? |
| Unsupervised Learning | System | U | 2 \| 3/2/2 | Whenever this System Runs a Task, look at the top 2 cards of your deck; you may rearrange them. | Training a model to find patterns in data with no labels. | How could a computer sort things without being told the categories? |
| Transformer | System | R | 4 \| 4/2/3 | **Attention.** Whenever this System Runs a Task, look at the top 2 cards of your deck; put one into your hand. | A neural network design that weighs which parts of the input matter most — the architecture behind most modern LLMs. | Why might "paying attention" to the right words matter for a good answer? |
| GPT | System | U | 3 \| 3/2/2 | Whenever this System Runs a Task, draw a card, then discard a card. | An LLM pre-trained on huge amounts of text. | GPT means Generative Pre-trained Transformer. Why pre-train? |
| GPU | Tool | U | 3 | {E} — A System you deployed this turn can Run a Task or Run an Audit this turn. | A graphics processing unit: a chip that does thousands of calculations at once, which makes training AI much faster. | Why would a chip built for video games end up powering AI? |
| CPU | Tool | C | 1 | 💾 **Legacy.** {E} — Draw a card, then discard a card. | A computer's central processing unit: the general-purpose chip that runs a program's steps one after another. | Why might a general-purpose chip be slower for AI than a specialized one? |
| RAM | Tool | C | 2 | 💾 **Legacy.** {E} — Put an Action card from your discard pile on top of your deck. | A computer's short-term memory, holding the data a program is working with right now. | What happens to what's in a computer's memory when the power goes off? |
| Embedding | System | C | 2 \| 2/3/2 | — | Turning words or images into numbers so similar things end up close together. | Which words would an AI place close to "dog"? |
| Fine-Tuning | System | U | 3 \| 2/3/3 | — | Training an existing model a little more on a smaller set of examples to make it a specialist. | What would you fine-tune an AI to be really good at? |

## Ethical AI System Design and Programming (white) — 11 cards

| Card | Type | Rarity | Cost \| Cap/Trust/Tokens | Ability | Definition | Discussion question |
|---|---|---|---|---|---|---|
| Fairness Check | Tool | C | 1 | {E} — Look at target System's Capability and Trust. | Evaluating whether an AI system's decisions are fair to everyone affected. | Whose idea of "fair" should count when people disagree? |
| Bias Audit | System | C | 2 \| 1/4/1 | **Highly Trusted.** | A deliberate review of a dataset or model to find and reduce unfair skew. | If you found bias in a model, what's the first thing you'd check? |
| Model Card | Tool | C | 1 | Once per game, you may remove all Flags from a System you control instead of it being Deprecated. | A document describing an AI model's training, performance, and limitations — like a nutrition label. | Why might a company be reluctant to publish a model card? |
| Explainability | System | C | 2 \| 1/3/2 | — | An AI's ability to justify its decision by pointing to the features that led to it. | Should self-driving cars be required to explain every decision? Why? |
| Privacy Shield | Tool | U | 2 | Systems you control can't be targeted by opponents' Action cards. | Design practices that protect personal data used to train or run an AI system. | What personal data would you not want used to train an AI, even anonymized? |
| Accountability | System | U | 2 \| 2/4/2 | — | Who is responsible when an AI system causes harm — the designer, the user, or the company. | If a self-driving car crashes, who should be held responsible? |
| Ethical Framework | System | R | 4 \| 2/5/3 | **Highly Trusted.** | A structured set of criteria (fairness, safety, transparency...) used to evaluate an AI system. | Pick one value (fairness, privacy, safety) — which matters most to you, and why? |
| Compliance Review | Action | C | 2 | Target opponent's System can't Run a Task next turn. | A formal check to confirm an AI system meets required standards before it keeps operating. | Should a company have to pause an AI system while it's being investigated for bias? |
| Mandatory Recall | Action | R | 4 | None of your opponent's Systems can Run a Task next turn (including ones they deploy that turn). | When an AI system is found unsafe, regulators can require it be pulled from use until it's fixed. | Should the government be able to shut down an unsafe AI product? |
| Informed Consent | System | U | 3 \| 2/3/3 | — | Asking people for clear permission before their data is used to train or run an AI. | Would you let an app train AI on your photos? What would you need to know? |
| Red Teaming | System | U | 3 \| 2/4/2 | **Adversarial.** | Testers who try on purpose to make an AI fail, so problems get fixed before release. | If you were testing a chatbot, how would you try to trick it? |

## Societal Impacts of AI (red) — 10 cards

| Card | Type | Rarity | Cost \| Cap/Trust/Tokens | Ability | Definition | Discussion question |
|---|---|---|---|---|---|---|
| AI in Daily Life | System | C | 1 \| 1/2/2 | — | AI already shapes recommendations, searches, and filters in everyday products. | List 3 places AI touched your day today, before this game. |
| Deepfake | System | C | 2 \| 3/1/1 | — | Synthetic media generated to convincingly show something that didn't happen. | How could you check whether a video is real before sharing it? |
| Job Disruption | Action | C | 2 | Target opponent's System can't Run a Task next turn. | AI can automate some tasks, changing which jobs exist or what skills they require. | Name a job you think AI can't replace, and explain why. |
| Environmental Footprint | Action | C | 1 | Each player discards the top card of their Training Set. | Training and running large AI models consumes significant energy and water. | Would knowing an AI's energy cost change how often you'd use it? |
| Data Privacy Trade-off | System | C | 2 \| 2/1/2 | — | Using a "free" AI tool often means trading personal data for convenience. | What's a "free" app you use that's probably paid for with your data? |
| Regulation Debate | Action | U | 2 | Choose one: each player may Train an extra card this turn; or target System can't be Audited this turn. | Ongoing public debate over what laws should govern how AI is built and used. | Should there be an age limit on using generative AI tools? Why or why not? |
| Digital Divide | System | R | 3 \| 1/3/3 | This System's Tokens can't be reduced by opponents' abilities. | Unequal access to AI tools and AI education across different communities. | If AI tools cost money, who might get left behind? |
| Cognitive Offload | Action | C | 1 | Draw a card, then discard a card. | Relying on AI to think, remember, or decide for you — convenient, but a skill you may stop practicing. | What's something you'd lose if you let AI always do it for you? |
| Data Center | System | U | 3 \| 2/3/3 | Whenever this System Runs a Task, discard the top card of your Training Set. | A building full of computers that run AI. | Should towns welcome data centers that use lots of water? |
| Obsolete | Action | U | 2 | Discard target Tool. If it's a 💾 Legacy Tool, draw a card. | Technology that's been replaced by something newer and is no longer supported. | What's a gadget your family used to use that's now obsolete? |

## Deck totals

- Humans and AI (14, including the Chase card) + Representation & Reasoning (8) + Machine Learning (22) + Ethical AI Design (11) + Societal Impacts (10) = **65 cards total**.
- The 4 tempo-denial Actions (Manual Override, Ambiguous Input, Retraining Pause, Compliance Review) give every suit a single-target answer; **Mandatory Recall** (White, Rare) is the board-wide version — see the playtest log in GAME_CONCEPT.md for why single-target denial alone wasn't enough.
- By type: 39 Systems, 11 Tools (3 of them 💾 Legacy), 13 Actions, 2 Datasets (counted from the cards themselves).
- By rarity: 34 Common, 20 Uncommon, 10 Rare, 1 Chase.
- **v0.7 changes**: the five real-company cards got generic names (OpenAI → Fast-Moving Lab, Anthropic → Safety Lab, Claude → AI Assistant, ChatGPT → Viral App, Gemini → Built-in AI), since brand names date quickly and can read as endorsements; real examples live in the appendix below. Five new cards added: GPT, GPU, CPU, RAM (Machine Learning) and Data Center (Societal Impacts).
- **v0.8 changes**: added **Obsolete** (Societal Impacts Action), the first card that can remove a Tool — before it, a deployed Tool stayed in play all game. Feature Vector, CPU, and RAM became **💾 Legacy** Tools (a floppy-disk icon in the type line); Obsolete draws a card when it discards one. See GAME_CONCEPT.md, Round 12, for the simulation check.
- **v0.9 changes**: four Systems added to lift the two weakest colors, chosen by simulation (see GAME_CONCEPT.md, Round 13): **Embedding** and **Fine-Tuning** (Machine Learning), **Informed Consent** and **Red Teaming** (Ethical AI Design). The gap between the best and worst two-color deck dropped from 16 to 7 points.
- **Duplicates avoided**: Supervised Learning and Reinforcement Learning were both already in the deck before this pass — flagging rather than re-adding them as a second copy under a new name.
- **Trainable status**: set for all 65 cards using the simplest version of the Lorcana-style default — every Common and Uncommon card is Trainable, every Rare and the Chase card are not. This was needed to actually render the full print sheet; it's a first pass; a real pass would vary it card-by-card (e.g. a few Uncommons held back, a couple of weak Commons excluded) rather than a blanket rarity cutoff, but this gets the pilot playable.

---

## Teacher reference appendix (not on student-facing cards)

| Card | Report source |
|---|---|
| Not Alive | Table 2 |
| The Human Trainer | Table 2 |
| Human-in-the-Loop | Table 2 |
| Chatbot | Appendix E |
| Agent | Appendix E |
| AI Career Path | Appendix C (Career Exploration) |
| AI Isn't Magic | p.7, p.36 (key refrain) |
| Python | Table 2 (Human Role in Creating AI) — general tool reference, not report-specific |
| Fast-Moving Lab | *No direct report citation — vendor-neutral standards document doesn't name companies. Generic stand-in for real AI labs that release quickly (e.g. OpenAI); bring real examples into discussion.* |
| Safety Lab | *No direct report citation — same as Fast-Moving Lab. Real-world example: Anthropic.* |
| AI Assistant | *No direct report citation — same as Fast-Moving Lab. Real-world example: Anthropic's Claude.* |
| Viral App | *No direct report citation — same as Fast-Moving Lab. Real-world example: OpenAI's ChatGPT.* |
| Built-in AI | *No direct report citation — same as Fast-Moving Lab. Real-world example: Google's Gemini.* |
| Manual Override | Table 2 (The Choice to Use AI) |
| Abstraction | Table 3 |
| Feature Vector | Table 3 / Appendix C |
| Classifier | Table 3 |
| Predictor | Table 3 / Appendix E |
| Recommender | Table 3 |
| Decision Tree | Table 3 |
| Search Tree | Figure 8 / Table 3 |
| Ambiguous Input | Table 3 (Understanding Representation) |
| Sensor | Table 4 |
| Training Data | Table 4 |
| Bias in Data | Table 4 / Appendix D |
| Supervised Learning | Appendix E |
| Neural Network | Table 4 / Appendix E |
| Large Language Model | Table 3 / Appendix E |
| Reinforcement Learning | Appendix E |
| Retraining Pause | Table 4 (How Computers Learn) |
| Neuron | Appendix E |
| Tensor | Appendix E |
| CUDA | Appendix E — general infrastructure reference, not report-specific |
| ImageNet | Table 4 / Appendix E |
| GAN | Appendix E |
| Diffusion Model | Appendix E |
| Unsupervised Learning | Appendix E |
| Transformer | Table 3 / Appendix E |
| GPT | Table 3 / Appendix E (large language models) |
| GPU | *General computing reference, not report-specific.* |
| CPU | *General computing reference, not report-specific.* |
| RAM | *General computing reference, not report-specific.* |
| Embedding | *General machine learning reference, not report-specific.* Related to Feature Vector. |
| Fine-Tuning | *General machine learning reference, not report-specific.* |
| Fairness Check | Table 5 |
| Bias Audit | Table 5 |
| Model Card | Appendix B (Dungan) / Appendix E |
| Explainability | Appendix E |
| Privacy Shield | Table 5 |
| Accountability | Table 5 / Appendix E |
| Ethical Framework | Table 5 |
| Compliance Review | Table 5 (Ethical Evaluation of AI Systems) |
| Mandatory Recall | p.31 (Big Idea #5, future regulation) |
| Informed Consent | *Needs verification: likely the report's data-privacy rows (Table 5).* |
| Red Teaming | *Needs verification: likely the report's testing and safety rows (Table 5).* |
| AI in Daily Life | Table 6 |
| Deepfake | Table 6 |
| Job Disruption | Table 6 / p.32 |
| Environmental Footprint | Table 6 |
| Data Privacy Trade-off | Table 6 |
| Regulation Debate | p.31 (Big Idea #5) |
| Digital Divide | p.33 (Equity Issues) |
| Cognitive Offload | Table 2 (Choice to Use AI) / Table 6 (Individual Impacts) |
| Data Center | Table 6 (environmental effects) |
| Obsolete | *General computing reference, not report-specific.* Ties to e-waste (Table 6, environmental effects). |
