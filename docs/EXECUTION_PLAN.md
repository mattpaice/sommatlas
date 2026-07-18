# Somm Atlas detailed execution plan

## Constraint

Ship a reliable, polished public demo within five hours. Hackathon judging value
takes priority over breadth. The architecture should still support a useful team
training product after the event.

## Locked decisions

- One desktop-first page with a responsive fallback.
- Next.js 16 App Router, TypeScript, Tailwind, and Vercel.
- Local Natural Earth SVG boundaries with hand-positioned study and contextual
  wine-region hotspots; no runtime GIS or map API.
- Four deep profiles: Barolo, Chianti Classico, Jura, and Collio.
- Barolo versus Chianti Classico is the flagship comparison.
- Static, version-controlled evidence corpus validated with Zod.
- No Supabase, accounts, or server-side persistence during the hackathon.
- Vercel AI Gateway with explicit Sol/Terra routing.
- A curated fallback response for every judge-visible AI interaction.

Supabase becomes useful after the hackathon for team accounts, saved learning
progress, quiz history, and collaborative evidence curation. It adds no
judge-visible value today.

## Judge journey

The entire demo follows one page and five beats:

1. **Atlas:** France and Italy, four hero regions, and a one-line proposition.
2. **Collio:** select ponca, decode the three meanings of “mineral,” and show
   geology through water, roots and vine response rather than direct flavour transfer.
3. **Jura:** select sotolon and distinguish sous-voile from ouillé styles.
4. **Compare:** Barolo versus Chianti Classico across structure and pigments;
   use Barolo to expose why a formation-to-style shortcut fails before moving
   to blind-tasting discriminators.
5. **Teach:** answer a Chianti Classico legal challenge, run one Sol synthesis,
   and re-explain it quickly with Terra at a chosen learning level.

## Runtime responsibility and model routing

| Interaction | Execution | Reason |
| --- | --- | --- |
| Map, filters, profiles, evidence cards | Deterministic | Instant and reliable |
| Appellation-rule answer | Deterministic | Legal answer must not vary |
| Barolo/Chianti chart | Deterministic | Data is already curated |
| Deep cross-domain comparison | `openai/gpt-5.6-sol` | Judgment, synthesis, and polish |
| WSET-level re-explanation | `openai/gpt-5.6-terra` | Faster bounded teaching task |
| AI outage or timeout | Curated local response | Demo must always complete |

The UI labels the two AI modes explicitly:

- **Deep synthesis · Sol**
- **Quick tutor · Terra**

The browser never supplies a model ID. A server-side allowlist maps `deep` to
Sol and `quick` to Terra.

## Application shape

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    api/synthesis/[mode]/route.ts
  components/
    atlas/
    compare/
    evidence/
    learning/
    synthesis/
  data/
    regions.ts
    claims.ts
    sources.ts
    challenges.ts
    demo-fallback.ts
  lib/
    schemas.ts
    corpus.ts
    map-coordinates.ts
    ai/
      agent.ts
      tools.ts
      models.ts
public/
  maps/
    france.svg
    italy.svg
```

`page.tsx` remains a Server Component. It loads and validates the corpus before
passing it into one interactive client island. Only the atlas, drawers,
comparison sheet, challenge, and synthesis controls require client state.

## AI implementation

Use AI SDK v6 through Vercel AI Gateway. The agent has four deterministic tools:

- `getRegionProfile`
- `compareRegions`
- `getAppellationRules`
- `getEvidence`

Tools use strict input and output schemas and only read the local corpus. There
is no live web search during the demo. Limit the agent to four steps.

The response UI shows tool activity as evidence cards and renders the final
streamed explanation with AI Elements. Do not expose private chain-of-thought;
show sources consulted, claim types, confidence, and the final explanation.

## Package budget

Install only what is required:

```text
ai@^6
@ai-sdk/react@^3
zod
recharts
lucide-react
```

Use AI Elements only for streamed AI prose/tool display. Use hand-built Tailwind
components and CSS transitions elsewhere. Do not add a map library, state
library, database client, ORM, authentication package, or animation framework.

## Parallel ownership

Use the root agent plus three sub-agents after the initial scaffold. File
ownership is exclusive.

| Lane | Owns | Must not edit |
| --- | --- | --- |
| Root/integration | package/config, shared schemas, page composition, builds, Git, Vercel | Agent-owned implementation files without coordination |
| Visual agent | `src/components/**`, `public/maps/**` | schemas, data, API routes |
| Data agent | `src/data/**` | components, schemas, package files |
| AI agent | `src/lib/ai/**`, `src/app/api/**` | components, corpus data, shared schemas |

Agents return questions and integration notes to root. They do not make
competing edits to `page.tsx`, `globals.css`, `schemas.ts`, or `package.json`.
Separate user-visible tasks/worktrees would add merge overhead; tightly scoped
sub-agents in the shared project are faster today.

## Five-hour clock

### T+00–20 — Foundation and highest-risk test

**Root**

- Preserve the existing docs and scaffold Next.js in the repository.
- Install the minimal dependencies and commit the lockfile.
- Create the Zod contracts for regions, claims, sources, rules, and AI tools.
- Link the Vercel project and enable AI Gateway.
- Pull local Vercel OIDC credentials.
- Smoke-test both `openai/gpt-5.6-sol` and `openai/gpt-5.6-terra`.

**Parallel preparation**

- Visual agent prepares the map silhouette and design tokens without touching
  scaffold-owned files.
- Data agent starts the three evidence packets below.
- AI agent finalises tool contracts against the proposed shared schema.

**Hard gate:** by T+20, both model slugs work or the project switches to the
fallback ladder. Do not postpone model-access risk.

### T+20–80 — Three implementation lanes

**Visual agent**

- Build the atlas shell, layer selector, SVG map, hotspots, and region drawer.
- Establish the museum-atlas visual language: ink, limestone, ponca ochre,
  garnet, oxidised gold, and muted sage.
- Build evidence and confidence primitives.

**Data agent**

- Packet A: Barolo and Chianti Classico legal rules.
- Packet B: Nebbiolo/Sangiovese phenolics and Jura sotolon evidence.
- Packet C: Collio ponca plus regional geological context.
- Return atomic sourced claims, never prose research notes.

**AI agent**

- Implement server-side model routing and the four corpus tools.
- Implement the streaming agent route with a four-step limit.
- Add error classification and the curated fallback hook.

**Root**

- Own global layout/tokens, data loading, shared schemas, and integration.
- Run build/type checks after each lane reaches a stable boundary.

**Milestone T+80:** Collio and Jura interactions work locally with verified or
clearly placeholder content; the AI route passes a smoke test.

### T+80–135 — Flagship comparison and legal challenge

- Build the Barolo/Chianti comparison sheet.
- Use six shared ranges: colour intensity, hue tendency, acidity, tannin,
  body, and aromatic character.
- Visually separate pigment from tannin.
- Add the blind-tasting discriminator summary.
- Add one deterministic Chianti Classico legal challenge with official source,
  effective date, original clause, and English interpretation.
- Freeze the visible corpus at T+125; hide anything still unverified.

**Milestone T+135:** the entire deterministic 60-second portion of the demo is
complete.

### T+135–180 — Judge-visible AI

- Connect the fixed Barolo/Chianti deep-comparison prompt to Sol.
- Show source/tool cards as the stream progresses.
- Connect the learning-level control to Terra.
- Add loading, timeout, partial-stream, and curated-fallback states.
- Do not add unrestricted chat until the fixed flow is flawless.

**Milestone T+180:** one Sol and one Terra interaction work end to end.

### T+180–205 — First Vercel preview

- Run lint, type check, tests if present, and production build.
- Deploy a preview to Vercel.
- Test the preview in a clean browser session.
- Test both model calls, one intentional failure, all four hero regions, and the
  Barolo/Chianti comparison.

Deploying at hour three leaves time to recover from environment or function
problems.

### T+205–250 — Polish and resilience

- Fix layout shift, clipping, weak contrast, and chart readability.
- Add designed loading, empty, error, and fallback states.
- Verify every visible claim resolves to a source.
- Confirm Jura is presented as a region containing multiple AOCs/styles, not as
  one appellation.
- Confirm no soil-to-flavour causal language remains.
- Verify desktop first, then provide a usable narrow-screen fallback.

**Code freeze at T+250.** Only submission-blocking fixes after this point.

### T+250–300 — Submission

- Promote the tested preview rather than rebuilding production.
- Capture screenshots and record the 90-second demo.
- Update README with the problem, architecture, evidence policy, model routing,
  and why Sol is necessary.
- Rehearse three times and remove any click that requires explanation.
- Confirm the repository, live URL, demo video, and project description are
  accessible in a logged-out session.

## Data freeze and validation

No more than 6–8 substantive claims per hero region. Every claim must include:

- subject and scope;
- claim type;
- authority/source and URL;
- effective or publication date;
- exact locator or short evidence fragment;
- confidence;
- causal strength; and
- last verification date.

The production UI renders only `verified` claims. For numerical legal rules, one
agent extracts and root verifies against the original clause.

## Hard fallback ladder

1. Vercel Gateway OIDC.
2. AI Gateway key if OIDC setup fails.
3. Terra for the deep prompt if Sol access is unavailable.
4. Curated local synthesis if all live calls fail.

The deterministic atlas, rules, comparison, and citations remain usable at every
fallback level.

## Cut order

If the schedule slips, cut in this order:

1. Four lighter non-hero profiles; retain only their labelled hotspots.
2. Free-text questions; retain preset prompts.
3. Additional quiz questions; retain the single legal challenge.
4. Extra palate/phenolic dimensions; retain the six comparison axes.
5. Radar chart; replace it with CSS bars.
6. Nonessential transitions.
7. Terra free-text mode; retain one fixed re-explanation control.

Never cut:

- the visual map interaction;
- Barolo versus Chianti Classico;
- citations and evidence labels;
- one judge-visible Sol synthesis;
- the curated AI fallback;
- early preview deployment and rehearsal.

## Definition of ready

- The proposition is clear within ten seconds.
- The five-beat demo completes in 90 seconds.
- No legal number lacks an authoritative source and effective date.
- No interpretation is displayed as a measured or legal fact.
- Sol performs a synthesis that deterministic lookup cannot.
- Terra visibly handles the faster bounded teaching task.
- A failed model call does not break the presentation.
- The deployed URL works without login or setup.
