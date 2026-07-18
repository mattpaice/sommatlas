# Somm Atlas

An interactive learning atlas for people who want to understand wine through
place, organic chemistry, sensory structure, and appellation law.

Somm Atlas connects the maps wine learners usually encounter separately:

- appellations and their legal production rules;
- geology, soils, altitude, and exposure;
- aroma compounds such as methoxypyrazines, thiols, terpenes, norisoprenoids,
  rotundone, and sotolon;
- phenolic architecture, including tannins and anthocyanin profiles; and
- palate architecture: acidity, alcohol, body, texture, and finish.

## Live prototype

[Open Somm Atlas](https://sommatlas.vercel.app)

The hackathon version focuses on four high-contrast studies in France and Italy:

- Barolo
- Chianti Classico
- Jura
- Collio

The core experience combines a switchable evidence atlas, a Barolo/Chianti
Classico comparison sheet, cited region profiles, and appellation-law
challenges. A guided synthesis route uses GPT-5.6 Sol for cross-domain analysis
and GPT-5.6 Terra for fast teaching explanations. Both are bounded by tools
that expose only the local verified corpus; deterministic answers preserve the
demo if model access is unavailable.

The atlas uses Natural Earth country boundaries and includes context-only
anchors for Burgundy, Bordeaux and the Rhône. Barolo's chemistry and phenolics
layers expose an interactive, primary-research-backed molecular fingerprint:
named aroma precursors, volatiles, anthocyanins and proanthocyanidin units.

## Adding map locations

Map markers are geographic data, not screen positions. Add a representative
WGS84 longitude/latitude and a named locality to `src/data/regions.ts` or
`src/data/map-context.ts`; `src/lib/map-projection.ts` applies the exact
Mercator transform used to generate each Natural Earth country SVG. This keeps
locations stable across viewport sizes and avoids hand-tuned percentages.

Context labels are shown one family at a time. Their lanes are sorted in the
same north-to-south order as their markers, so leader lines cannot cross; the
shared France-side rail also stays clear of Italy's interactive region labels.

## Evidence principles

- Never imply that soil directly creates an aroma compound.
- Separate grape-derived, fermentation-derived, maturation-derived, and
  environmental effects.
- Treat winemaking choices as dated and scoped practices, not timeless regional
  facts.
- Link appellation requirements to the current official specification and retain
  the original-language clause.
- Label measured facts, published associations, regional consensus, and
  interpretation differently.

## Status

Five-hour hackathon prototype, deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

The static atlas and curated synthesis work without a database. Live Sol/Terra
calls use Vercel AI Gateway through the linked project's OIDC credentials.
