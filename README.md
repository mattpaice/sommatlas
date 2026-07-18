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

The interface separates three linked entities rather than treating a region as
one homogeneous wine: the appellation owns place and legal rules; the grape
database owns variety-level chemistry; and a wine expression joins place,
grape and vinification. This lets Collio Ribolla Gialla with extended skin
contact remain distinct from a directly pressed Collio Chardonnay while both
retain the same geographic context.

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

The static atlas and curated synthesis work without a database. Live Sol/Terra
calls use Vercel AI Gateway through the linked project's OIDC credentials.
