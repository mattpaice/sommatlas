import type { Challenge } from "@/lib/schemas";

export const challenges = [
  {
    id: "chianti-white-grapes",
    regionId: "chianti-classico",
    question: "Can a current red Chianti Classico DOCG contain white grapes?",
    answer: false,
    answerLabel: "No — the complementary varieties must be red-berried.",
    explanation: "Annata and Riserva require 80-100% Sangiovese, and any permitted complementary grapes (up to 20%) must be red-berried. Historical recipes and the separate Vin Santo del Chianti Classico DOC explain why the trap feels plausible.",
    claimIds: ["chianti-sangiovese-80", "chianti-no-white-grapes"],
  },
  {
    id: "barolo-wood-only",
    regionId: "barolo",
    question: "Must all 38 months of Barolo's minimum maturation take place in wood?",
    answer: false,
    answerLabel: "No — at least 18 of the 38 months must be in wood.",
    explanation: "The code fixes a minimum total maturation and a minimum wood component. It does not require 38 months in barrel or mandate a single oak vessel style.",
    claimIds: ["barolo-ageing-38-18"],
  },
  {
    id: "jura-all-vin-jaune",
    regionId: "jura",
    question: "Are all white wines from Jura aged for at least 60 months under a yeast veil?",
    answer: false,
    answerLabel: "No — that is a Vin Jaune rule, not a regional rule.",
    explanation: "Jura is a region with several appellations and white-wine paths. Producers also make topped-up (ouillé) whites; always attach the 60-month rule to Vin Jaune in its named appellation.",
    claimIds: ["jura-is-region", "jura-vin-jaune-veil-ageing", "jura-sous-voile-vs-ouille"],
  },
  {
    id: "collio-rock-flavour",
    regionId: "collio",
    question: "Does ponca prove that vines absorb a literal rock flavour which passes unchanged into Collio wine?",
    answer: false,
    answerLabel: "No — ponca is geological context, not a flavour additive.",
    explanation: "Ponca can shape the physical rooting and water environment. Turning that into a direct rock-to-glass flavour mechanism skips vine physiology, fermentation, élevage and sensory interpretation.",
    claimIds: ["collio-ponca-flysch", "collio-no-literal-mineral-flavour"],
  },
] satisfies Challenge[];
