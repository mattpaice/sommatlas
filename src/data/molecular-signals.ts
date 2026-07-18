export type MolecularLayer = "chemistry" | "phenolics";

export interface MolecularSignal {
  id: string;
  name: string;
  family: string;
  stage: string;
  teachingRole: string;
  claimId: string;
  layer: MolecularLayer;
}

export const baroloMolecularSignals = [
  {
    id: "3-hydroxy-beta-damascone",
    name: "3-hydroxy-β-damascone",
    family: "C13-norisoprenoid",
    stage: "Glycosidic grape precursor pool",
    teachingRole: "A latent aglycone identified after hydrolysis—not a one-molecule rose note.",
    claimId: "nebbiolo-norisoprenoid-precursors",
    layer: "chemistry",
  },
  {
    id: "3-oxo-alpha-ionol",
    name: "3-oxo-α-ionol",
    family: "C13-norisoprenoid",
    stage: "Glycosidic grape precursor pool",
    teachingRole: "Part of Nebbiolo's measured bound aroma library before fermentation.",
    claimId: "nebbiolo-norisoprenoid-precursors",
    layer: "chemistry",
  },
  {
    id: "blumenol-c",
    name: "Blumenol C",
    family: "C13-norisoprenoid",
    stage: "Glycosidic grape precursor pool",
    teachingRole: "Shows that precursor composition is richer than a list of familiar tasting descriptors.",
    claimId: "nebbiolo-norisoprenoid-precursors",
    layer: "chemistry",
  },
  {
    id: "vomifoliol",
    name: "Vomifoliol",
    family: "C13-norisoprenoid",
    stage: "Glycosidic grape precursor pool",
    teachingRole: "A measured bound precursor whose sensory contribution depends on later release and transformation.",
    claimId: "nebbiolo-norisoprenoid-precursors",
    layer: "chemistry",
  },
  {
    id: "linalool",
    name: "Linalool",
    family: "Monoterpene alcohol",
    stage: "Measured finished-wine volatile",
    teachingRole: "Often described with floral/citrus language, but concentration, threshold and matrix govern perception.",
    claimId: "nebbiolo-terpenoid-wine-profile",
    layer: "chemistry",
  },
  {
    id: "geraniol",
    name: "Geraniol",
    family: "Monoterpene alcohol",
    stage: "Measured finished-wine volatile",
    teachingRole: "A floral-associated volatile measured comparatively; it is not a unique Nebbiolo marker.",
    claimId: "nebbiolo-terpenoid-wine-profile",
    layer: "chemistry",
  },
  {
    id: "acetaldehyde",
    name: "Acetaldehyde",
    family: "Reactive aldehyde",
    stage: "Oxygen and ageing network",
    teachingRole: "Participates in pigment and tannin reactions; its path was wine-dependent rather than simply linear.",
    claimId: "nebbiolo-oxygen-ageing-network",
    layer: "chemistry",
  },
  {
    id: "methional",
    name: "Methional",
    family: "Sulfur-containing aldehyde",
    stage: "Later storage volatile",
    teachingRole: "Accumulated in the study's ageing network; this does not define every mature Barolo.",
    claimId: "nebbiolo-oxygen-ageing-network",
    layer: "chemistry",
  },
  {
    id: "peonidin-3-o-glucoside",
    name: "Peonidin-3-O-glucoside",
    family: "Anthocyanin pigment",
    stage: "Berry-skin monomer",
    teachingRole: "The leading anthocyanin in one measured Nebbiolo harvest profile.",
    claimId: "nebbiolo-named-anthocyanins",
    layer: "phenolics",
  },
  {
    id: "malvidin-3-o-glucoside",
    name: "Malvidin-3-O-glucoside",
    family: "Anthocyanin pigment",
    stage: "Berry-skin monomer",
    teachingRole: "The second-largest fraction in that sample; profiles vary with site, season and extraction.",
    claimId: "nebbiolo-named-anthocyanins",
    layer: "phenolics",
  },
  {
    id: "catechin",
    name: "Catechin",
    family: "Flavan-3-ol",
    stage: "Proanthocyanidin building block",
    teachingRole: "A monomeric unit within condensed-tannin chains, not a standalone tannin score.",
    claimId: "nebbiolo-proanthocyanidin-building-blocks",
    layer: "phenolics",
  },
  {
    id: "epicatechin",
    name: "Epicatechin",
    family: "Flavan-3-ol",
    stage: "Proanthocyanidin building block",
    teachingRole: "A major extension unit whose chain context helps shape tannin behaviour.",
    claimId: "nebbiolo-proanthocyanidin-building-blocks",
    layer: "phenolics",
  },
  {
    id: "epicatechin-gallate",
    name: "Epicatechin-3-O-gallate",
    family: "Galloylated flavan-3-ol",
    stage: "Seed/skin tannin unit",
    teachingRole: "Galloylation is one structural variable associated with tannin interaction and perception.",
    claimId: "nebbiolo-proanthocyanidin-building-blocks",
    layer: "phenolics",
  },
  {
    id: "epigallocatechin",
    name: "Epigallocatechin",
    family: "Flavan-3-ol",
    stage: "Skin proanthocyanidin unit",
    teachingRole: "A skin-associated unit that helps distinguish skin from seed tannin composition.",
    claimId: "nebbiolo-proanthocyanidin-building-blocks",
    layer: "phenolics",
  },
] as const satisfies readonly MolecularSignal[];
