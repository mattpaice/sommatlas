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
    answer: "Barolo is legally 100% Nebbiolo and classically combines pale garnet colour with high, drying tannin. Chianti Classico is 80-100% Sangiovese and reads as ruby, sour-cherry-led and acid-driven, with firm, savoury tannin. The contrast begins in pigment and tannin chemistry, then sharpens through Barolo’s marl-and-sandstone hills and Chianti Classico’s varied slopes, exposures and soils.",
    claimIds: ["barolo-nebbiolo-100", "chianti-sangiovese-80", "nebbiolo-pigment-tannin-pattern", "barolo-chianti-astringency-comparison", "barolo-site-before-style"],
  },
  {
    id: "explain-anthocyanins",
    prompts: ["anthocyanins", "acylated vs unacylated", "why is nebbiolo pale"],
    answer: "Anthocyanins are red-grape pigments. Acylation changes their stability and reaction behaviour, while the overall profile governs how colour develops through fermentation and age. In one 2023 simulated-maceration study, Nebbiolo and Sangiovese were both dominated by disubstituted anthocyanins; Nebbiolo also showed small acetylated and cinnamoylated fractions. This gives Nebbiolo its paradoxical starting point: a modest pigment pool alongside formidable tannin.",
    claimIds: ["nebbiolo-anthocyanin-profile", "sangiovese-anthocyanin-profile"],
  },
  {
    id: "explain-jura",
    prompts: ["sous voile vs ouille", "sotolon", "why does vin jaune smell like curry"],
    answer: "Ouillé wines are topped up, preserving a fresher, citrus-led profile; sous-voile wines mature beneath a surface yeast film in a barrel that is not kept full, developing walnut, spice and savoury depth. For Côtes du Jura Vin Jaune, the rule includes at least 60 months under veil. Sotolon is a major part of that unmistakable curry, fenugreek, walnut and maple-like register, formed through the wine’s long film-ageing pathway.",
    claimIds: ["jura-sous-voile-vs-ouille", "jura-vin-jaune-veil-ageing", "jura-sotolon-vin-jaune"],
  },
  {
    id: "explain-ponca",
    prompts: ["what is ponca", "collio geology", "does minerality come from rocks"],
    answer: "Ponca is Collio's local name for flysch: alternating marl and sandstone layers formed from ancient marine sediments. As it weathers, it creates layered hillside soils with distinct drainage, rooting and water-holding behaviour. In the glass, Collio’s white wines combine that hillside setting with grape choice, fermentation and élevage; “minerality” is the tasting word often used for the resulting stony, saline or tense impression.",
    claimIds: ["collio-ponca-flysch", "collio-ponca-age-composition", "collio-no-literal-mineral-flavour", "collio-three-minerals"],
  },
] satisfies DemoFallback[];
