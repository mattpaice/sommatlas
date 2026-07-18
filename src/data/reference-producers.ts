import type { RegionId } from "@/lib/schemas";

export type ReferenceProducer = {
  regionId: RegionId;
  name: string;
  url: string;
  lens: string;
  editorialNote: string;
};

export const referenceProducers = [
  {
    regionId: "barolo",
    name: "G.B. Burlotto",
    url: "https://www.burlotto.com/en/azienda-vitivinicola/",
    lens: "Verduno · house tradition",
    editorialNote: "Use as a Verduno anchor, then compare site and cellar choices rather than treating perfume as a commune guarantee.",
  },
  {
    regionId: "barolo",
    name: "Vietti",
    url: "https://www.vietti.com/en/wines/barolo",
    lens: "Multi-MGA comparison",
    editorialNote: "A broad Barolo range makes side-by-side MGA study possible; keep the producer’s separate vinification and ageing choices in the frame.",
  },
  {
    regionId: "barolo",
    name: "Ceretto",
    url: "https://www.ceretto.com/en/home",
    lens: "Site and intervention",
    editorialNote: "Useful for testing how a house spanning several Langhe sites articulates reduced intervention without pretending cellar work disappears.",
  },
  {
    regionId: "chianti-classico",
    name: "Fontodi",
    url: "https://www.fontodi.com/en/",
    lens: "Panzano · Conca d’Oro",
    editorialNote: "Compare the DOCG wines with Flaccianello: the same estate can clarify why grape, place and legal denomination must remain separate layers.",
  },
  {
    regionId: "chianti-classico",
    name: "Castello di Ama",
    url: "https://castellodiama.com/en/",
    lens: "Ama · high-elevation sites",
    editorialNote: "A useful lens on parcel identity, blending and élevage within one estate—especially when discussing whether ‘Chianti style’ is too broad a category.",
  },
  {
    regionId: "chianti-classico",
    name: "Monteraponi",
    url: "https://www.monteraponi.it/index.php?lang=en",
    lens: "Radda · Sangiovese-led blends",
    editorialNote: "Use the Radda setting and Sangiovese–Canaiolo blend to interrogate elevation, permitted grapes and the limits of single-variety shorthand.",
  },
  {
    regionId: "jura",
    name: "Domaine de la Pinte",
    url: "https://lapinte.fr/",
    lens: "Arbois · broad style range",
    editorialNote: "A practical route across white, red and Vin Jaune categories; compare topped-up and oxidative pathways without making either ‘the Jura style’.",
  },
  {
    regionId: "jura",
    name: "Domaine Rolet",
    url: "https://domaine-rolet.com/en/pages/notre-histoire",
    lens: "Multiple Jura appellations",
    editorialNote: "Its range across Arbois, Côtes du Jura, L’Étoile and Château-Chalon makes appellation-specific rules unusually easy to teach.",
  },
  {
    regionId: "jura",
    name: "Domaine Berthet-Bondet",
    url: "https://berthet-bondet.com/",
    lens: "Château-Chalon · ouillé / voile",
    editorialNote: "Use the white-wine range to compare ouillé, sous-voile and Vin Jaune as distinct biological and legal trajectories.",
  },
  {
    regionId: "collio",
    name: "Venica & Venica",
    url: "https://venica.it/",
    lens: "Variety and site",
    editorialNote: "A wide varietal range makes it useful for asking what remains of place when grape chemistry changes across neighbouring bottlings.",
  },
  {
    regionId: "collio",
    name: "Schiopetto",
    url: "https://www.schiopetto.it/",
    lens: "Modern Friulian white-wine history",
    editorialNote: "A reference point for clean, temperature-conscious white-wine expression; compare that cellar lens with more extractive alternatives.",
  },
  {
    regionId: "collio",
    name: "Borgo del Tiglio",
    url: "https://www.borgodeltiglio.it/",
    lens: "Parcel, variety and élevage",
    editorialNote: "Useful for separating ponca as a physical site context from the strong effects of grape identity, barrel choices and time.",
  },
] as const satisfies readonly ReferenceProducer[];

