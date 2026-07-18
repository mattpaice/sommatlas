export type DemoFallback = {
  id: string;
  prompts: string[];
  answer: string;
  claimIds: string[];
};

/** Deterministic answers keep the core demo useful when live model access is absent. */
export const demoFallbacks = [
  {
    id: "compare-barolo-chianti",
    prompts: ["compare barolo and chianti", "barolo vs chianti classico", "head to head"],
    answer: "Barolo is legally 100% Nebbiolo and the training archetype pairs relatively pale, garnet colour with high, drying tannin. Chianti Classico is 80-100% Sangiovese and typically reads as ruby, sour-cherry-led and acid-driven, with firm but less massive tannin in our editorial range. Chemistry supports the paradox, not a rigid score: both cultivars can show highly polymerised proanthocyanins, while their pigment profiles vary by sample and vinification.",
    claimIds: ["barolo-nebbiolo-100", "chianti-sangiovese-80", "nebbiolo-pigment-tannin-pattern", "barolo-chianti-astringency-comparison"],
  },
  {
    id: "explain-anthocyanins",
    prompts: ["anthocyanins", "acylated vs unacylated", "why is nebbiolo pale"],
    answer: "Anthocyanins are red-grape pigments. Acylation changes pigment stability and reaction behaviour, but varieties should be taught as profiles rather than placed into a binary box. In one 2023 simulated-maceration study, both Nebbiolo and Sangiovese were dominated by disubstituted anthocyanins; Nebbiolo still showed some acylated forms, while none were detected in that Sangiovese sample. The result is evidence, not a universal rule across vintages and cellars.",
    claimIds: ["nebbiolo-anthocyanin-profile", "sangiovese-anthocyanin-profile"],
  },
  {
    id: "explain-jura",
    prompts: ["sous voile vs ouille", "sotolon", "why does vin jaune smell like curry"],
    answer: "Ouillé wines are topped up to limit oxygen exposure and veil formation; sous-voile wines develop beneath a surface yeast film in a barrel not kept full. For Côtes du Jura Vin Jaune, the rule includes at least 60 months under veil. Sotolon is one key aroma compound produced during this film-ageing chemistry and can evoke curry, fenugreek, walnut or maple-like notes—but it is neither unique to Jura nor the whole aroma story.",
    claimIds: ["jura-sous-voile-vs-ouille", "jura-vin-jaune-veil-ageing", "jura-sotolon-vin-jaune"],
  },
  {
    id: "explain-ponca",
    prompts: ["what is ponca", "collio geology", "does minerality come from rocks"],
    answer: "Ponca is Collio's local name for flysch: alternating marl and sandstone layers formed from ancient marine sediments. It matters as physical growing context—weathering, rooting and water relations—not as a flavour additive. A mineral sensory impression may be real, but the evidence does not support literal rock flavour passing unchanged through roots into wine.",
    claimIds: ["collio-ponca-flysch", "collio-ponca-age-composition", "collio-no-literal-mineral-flavour"],
  },
] satisfies DemoFallback[];
