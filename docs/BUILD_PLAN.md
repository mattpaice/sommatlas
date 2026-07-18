# Somm Atlas hackathon build plan

## North star

Build the most convincing 90-second demonstration of GPT-5.6 Sol turning
specialist, cross-disciplinary evidence into an interactive wine-learning tool.

The hackathon objective determines scope. The team-training objective determines
the data model so the prototype can grow after the event.

## What the judges should remember

Somm Atlas connects four bodies of knowledge that wine learners normally study
separately:

1. appellation law;
2. geology and site;
3. organic chemistry;
4. sensory structure and blind-tasting inference.

It does not claim that soil directly creates an aroma. It shows the evidence
chain, identifies uncertainty, and distinguishes legal facts from scientific
associations and interpretation.

## Why Sol is essential

The application should visibly demonstrate:

- open-ended reasoning across legal, scientific, geological, and sensory sources;
- tool use and structured evidence retrieval rather than unsupported prose;
- scientific judgment about causation, association, scope, and uncertainty;
- polished, useful output rather than a raw chat response; and
- end-to-end work: research, comparison, explanation, and teaching.

Do not make “chat with a wine expert” the primary experience. Sol powers the
evidence synthesis behind map interactions and comparison views.

## The 90-second demo

1. Open a striking France/Italy map in the geology layer.
2. Select **ponca** and open Collio; connect the distinctive marl-and-sandstone
   formation to site and wine context without claiming that soil directly creates
   flavour.
3. Switch to aroma chemistry and use **sotolon/Jura** to distinguish compound,
   production pathway, and regional association.
4. Compare **Barolo** with **Chianti Classico**. Show their shared acid-and-tannin
   structure, reject the Tortonian-elegance/Serravallian-power shortcut, then
   reveal their different anthocyanin, aroma, and palate architectures.
5. Switch to **Appellation rules** and answer a “Could this be…?” question about
   whether white grapes may be included in Chianti Classico.
6. Ask Sol one difficult synthesis question. It retrieves the relevant region,
   chemistry, sensory, and legal records and returns a visual evidence chain with
   citations and explicit uncertainty.

## Prototype scope

Show all eight anchor regions on the map, but create deep, verified content for
four hero regions/appellations:

- Barolo;
- Chianti Classico;
- Jura; and
- Collio.

Use Etna, Côte-Rôtie, Sancerre, and Saumur-Champigny as lighter map profiles if
time allows. Breadth is a post-hackathon task.

## Core screens

### 1. Atlas

- Stylised France/Italy map with region hotspots.
- Geographic Natural Earth outlines plus context-only anchors for Côte de Nuits,
  Côte de Beaune, Beaujolais, both Bordeaux banks and both Rhône sectors.
- Layer control: chemistry, geology, phenolics, palate, and legal rules.
- A deliberate editorial visual language rather than a generic dashboard.

### 2. Region profile

- Geological formation and site context.
- A Barolo “site before style” chain: formation, soil physical properties,
  water/root environment, vine response and farming, then a bounded sensory
  hypothesis.
- A Collio “three meanings of mineral” decoder separating geological minerals,
  vine nutrient elements and sensory metaphor.
- Principal grapes and wine archetypes.
- Aroma compound families with evidence strength.
- Palate and phenolic fingerprints.
- A named Nebbiolo molecular fingerprint spanning aroma precursors, finished-wine
  volatiles, anthocyanin pigments and proanthocyanidin building blocks.
- High-value appellation rules linked to their official source.

### 3. Compare: Barolo versus Chianti Classico

- Two regions or wine archetypes side by side.
- Structural radar or compact parallel profile.
- “How to distinguish these blind” synthesis.
- A visible causal/evidence chain, with unsupported causal leaps prevented.

### 4. Could this be…?

- One legal-classification scenario at a time.
- Answer, source clause, and explanation.
- Designed as a reusable team-training interaction.

## Data architecture

Use curated local JSON for the hackathon. Every claim has:

- scope;
- claim type: legal, measured, published association, common practice,
  historical practice, or interpretation;
- source title and URL;
- source/effective date;
- confidence;
- original-language evidence fragment where appropriate; and
- last verification date.

Sol receives relevant records through narrow tools and must return a structured
response. The UI renders that structure as cards, comparisons, confidence labels,
and citations.

## Technical shape

- Next.js and TypeScript web application.
- Tailwind CSS for rapid visual polish.
- A local SVG or lightweight map implementation to avoid map-token and GIS risk.
- Static, version-controlled JSON for the initial corpus.
- A server-side OpenAI Responses API route using GPT-5.6 Sol.
- Structured output for comparisons and evidence chains.
- Vercel deployment.

## Five-hour build order

### 0:00–0:30 — Lock the story

- Finalise the 90-second demo script.
- Define the JSON and structured-response schemas.
- Choose the four hero appellations and one claim per demo beat.

### 0:30–1:30 — Build the visual shell

- Create the atlas page, map, layer control, and region drawer.
- Establish typography, colour, spacing, and responsive layout.
- Use placeholder data until the interaction is convincing.

### 1:30–2:30 — Add the verified corpus

- Seed the four hero profiles.
- Include only the rules and chemistry needed by the demo.
- Attach sources and confidence metadata to every substantive claim.

### 2:30–3:30 — Make Sol visible

- Implement evidence-retrieval tools over the curated corpus.
- Add the difficult synthesis query and structured visual response.
- Add the “Could this be…?” rules interaction.

### 3:30–4:15 — Comparison and teaching value

- Implement Barolo versus Chianti Classico comparison.
- Add blind-tasting discriminators.
- Ensure the same components can later support team lessons.

### 4:15–5:00 — Submission polish

- Verify the complete demo path and graceful loading/error states.
- Deploy.
- Record a concise demo video.
- Improve the README with screenshots, architecture, evidence principles, and a
  clear explanation of why Sol is necessary.

## Cut line

Cut these before compromising the core demo:

- live wine prices;
- producer and vintage coverage;
- national-scale geological GIS ingestion;
- automatic ingestion of every appellation specification;
- user accounts and saved progress;
- a general-purpose chat interface;
- complete coverage of all eight appellations.

## Definition of done

- A judge understands the product within ten seconds.
- The demo contains one memorable map interaction.
- Sol performs one synthesis that a deterministic lookup cannot.
- Every displayed legal rule has an authoritative source.
- Scientific association and causation are visually distinguished.
- The live URL works without explanation or setup.
- The repository explains what Codex built and how Sol powers the product.
