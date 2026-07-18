import type { MapContextPoint } from "@/data/map-context";

/**
 * Research-only profiles for the context points already visible on the atlas.
 *
 * This module is deliberately not connected to the application yet. It gives
 * future UI work a stable, cited data source without expanding RegionId or
 * changing any components while the design pass is in progress.
 */

export type ContextRegionId = MapContextPoint["id"];

export type ContextRegionSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  sourceType: "official_trade_body" | "official_appellation" | "official_specification";
  retrievedAt: string;
  language: "en" | "fr";
};

export type AppellationFamily = {
  id: string;
  name: string;
  category: string;
  dominantStyles: readonly string[];
  keyGrapes: readonly string[];
  note: string;
  sourceIds: readonly string[];
};

export type RegionalGrapeProfile = {
  id: string;
  name: string;
  colour: "black" | "white";
  prominence: "defining" | "major" | "supporting" | "minor";
  ripening: string;
  structuralRole: string;
  aromaticRole: string;
  regionalUse: string;
  caveat?: string;
  sourceIds: readonly string[];
};

export type RepresentativeExpression = {
  id: string;
  label: string;
  style: string;
  principalGrapes: readonly string[];
  whyItMatters: string;
  comparisonPrompt: string;
  sourceIds: readonly string[];
};

export type ContextRegionProfile = {
  id: ContextRegionId;
  name: string;
  systemSummary: string;
  teachingFocus: string;
  geography: {
    scope: string;
    soils: string;
    climate: string;
  };
  appellationFamilies: readonly AppellationFamily[];
  grapes: readonly RegionalGrapeProfile[];
  expressions: readonly RepresentativeExpression[];
  pitfalls: readonly string[];
  sourceIds: readonly string[];
};

export const contextRegionSources = [
  {
    id: "bourgogne-cote-de-nuits",
    title: "Côte de Nuits and Hautes-Côtes de Nuits: purple and gold",
    publisher: "Bourgogne Wine Board",
    url: "https://www.bourgogne-wines.com/wine-and-terroir/our-vineyards/cote-de-nuits-and-hautes-cotes-de-nuits/cote-de-nuits-and-hautes-cotes-de-nuits-purple-and-gold%2C2470%2C9313.html",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bourgogne-cote-de-beaune",
    title: "Côte de Beaune and the Hautes-Côtes de Beaune",
    publisher: "Bourgogne Wine Board",
    url: "https://www.bourgogne-wines.com/wine-and-terroir/our-vineyards/cote-de-beaune-and-hautes-cotes-de-beaune/cote-de-beaune-and-the-hautes-cotes-de-beaune-a-winegrowing-region-renowned-for-its-legendary-wines%2C2471%2C9314.html",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bourgogne-grapes",
    title: "Pinot Noir and Chardonnay: Bourgogne's two noble grape varietals",
    publisher: "Bourgogne Wine Board",
    url: "https://www.bourgogne-wines.com/wine-and-terroir/our-grape-varietals-our-colors/pinot-noir-and-chardonnay-the-bourgogne-region-s-two-noble-grape-varietals%2C2475%2C9265.html",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bourgogne-cdn-villages",
    title: "Côte de Nuits-Villages",
    publisher: "Bourgogne Wine Board",
    url: "https://www.bourgogne-wines.com/wine-and-terroir/bourgogne-and-its-appellations/cote-de-nuits-villages%2C2458%2C9253.html",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "beaujolais-discover",
    title: "Discover Beaujolais",
    publisher: "Inter Beaujolais",
    url: "https://www.beaujolais.com/en/discover/",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "beaujolais-aoc",
    title: "Beaujolais appellation",
    publisher: "Inter Beaujolais",
    url: "https://www.beaujolais.com/en/appellation/beaujolais/",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "beaujolais-villages",
    title: "Beaujolais-Villages appellation",
    publisher: "Inter Beaujolais",
    url: "https://www.beaujolais.com/appellation/beaujolais-villages/",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "fr",
  },
  {
    id: "beaujolais-chardonnay",
    title: "Chardonnay",
    publisher: "Inter Beaujolais",
    url: "https://www.beaujolais.com/en/cepage/chardonnay/",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-grapes",
    title: "Bordeaux grape varieties",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/grape-varieties/",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-cabernet-sauvignon",
    title: "Cabernet Sauvignon",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/grape-varieties/cabernet-sauvignon/",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-merlot",
    title: "Merlot",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/grape-varieties/merlot/",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-cabernet-franc",
    title: "Cabernet Franc",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/grape-varieties/cabernet-franc/",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-petit-verdot",
    title: "Petit Verdot",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/grape-varieties/petit-verdot/",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-medoc",
    title: "Médoc appellation",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/appellations/medoc/medoc/",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-pessac-leognan",
    title: "Pessac-Léognan appellation",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/designations/graves-sauternes/pessac-leognan/",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-saint-emilion",
    title: "Saint-Émilion appellation",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/designations/saint-emilion-pomerol-fronsac/saint-emilion/",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "bordeaux-pomerol",
    title: "Pomerol appellation",
    publisher: "Bordeaux Wine Council",
    url: "https://www.bordeaux.com/en/designations/saint-emilion-pomerol-fronsac/pomerol/",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-grapes",
    title: "Rhône Valley grape varieties",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/rhone-valley-vineyards/grape-varieties",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-cote-rotie",
    title: "Côte-Rôtie AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cotes-du-rhone-cru-aoc-cote-rotie",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-hermitage",
    title: "Hermitage AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cotes-du-rhone-cru-aoc-hermitage",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-cornas",
    title: "Cornas AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cotes-du-rhone-cru-aoc-cornas",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-condrieu",
    title: "Condrieu AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cotes-du-rhone-cru-aoc-condrieu",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-crozes-hermitage",
    title: "Crozes-Hermitage AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cotes-du-rhone-cru-aoc-crozes-hermitage",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-cotes-du-rhone",
    title: "Côtes du Rhône AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/rhone-valley-vineyards/appellations/aoc-cotes-du-rhone",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-chateauneuf",
    title: "Châteauneuf-du-Pape AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cotes-du-rhone-cru-aoc-chateauneuf-du-pape",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-gigondas",
    title: "Gigondas AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cotes-du-rhone-cru-aoc-gigondas",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-tavel",
    title: "Tavel AOC",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cotes-du-rhone-cru-aoc-tavel",
    sourceType: "official_appellation",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-mourvedre",
    title: "Mourvèdre",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/mourvedre-grape-variety",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
  {
    id: "rhone-cinsault",
    title: "Cinsault",
    publisher: "Inter Rhône",
    url: "https://www.vins-rhone.com/en/cinsault-or-cinsaut-grape-variety",
    sourceType: "official_trade_body",
    retrievedAt: "2026-07-18",
    language: "en",
  },
] as const satisfies readonly ContextRegionSource[];

export const contextRegionProfiles = [
  {
    id: "cote-de-nuits",
    name: "Côte de Nuits",
    systemSummary: "A predominantly red-wine strip of northern Côte d'Or in which Pinot Noir is read through village, Premier Cru and Grand Cru origin more often than through varietal blending.",
    teachingFocus: "Keep the grape constant and compare place: the useful drill-down is Gevrey-Chambertin versus Chambolle-Musigny versus Vosne-Romanée versus Nuits-Saint-Georges.",
    geography: {
      scope: "The northern Côte d'Or from the Dijon area toward Corgoloin, including the lower-slope Côte de Nuits-Villages and the higher Hautes-Côtes de Nuits.",
      soils: "A broken limestone-and-marl slope system with local changes in bedrock, scree, clay content, altitude and exposure; village names are more reliable teaching units than a single regional soil slogan.",
      climate: "Continental conditions with meaningful vintage risk and slope/exposure effects; the official regional material presents this as the heartland of red Bourgogne and most of its red Grands Crus.",
    },
    appellationFamilies: [
      { id: "cdn-regional", name: "Regional and Côte de Nuits-Villages", category: "regional / village", dominantStyles: ["red", "small amount of white"], keyGrapes: ["Pinot Noir", "Chardonnay"], note: "Côte de Nuits-Villages is almost entirely Pinot Noir red, with a small Chardonnay white category; broader regional wines form the entry point.", sourceIds: ["bourgogne-cdn-villages", "bourgogne-cote-de-nuits"] },
      { id: "cdn-north", name: "Gevrey-Chambertin and Morey-Saint-Denis", category: "village / Premier Cru / Grand Cru", dominantStyles: ["red"], keyGrapes: ["Pinot Noir"], note: "The northern core contains a dense run of Pinot Noir climats and Grands Crus; compare sites rather than assuming every wine shares one sensory template.", sourceIds: ["bourgogne-cote-de-nuits"] },
      { id: "cdn-central", name: "Chambolle-Musigny, Vougeot and Vosne-Romanée", category: "village / Premier Cru / Grand Cru", dominantStyles: ["red", "rare white at Vougeot"], keyGrapes: ["Pinot Noir", "Chardonnay"], note: "This central run includes many of the Côte's most famous named climats. Pinot Noir remains the organising principle, with limited white exceptions.", sourceIds: ["bourgogne-cote-de-nuits", "bourgogne-grapes"] },
      { id: "cdn-south", name: "Nuits-Saint-Georges and southern villages", category: "village / Premier Cru", dominantStyles: ["red", "small amount of white"], keyGrapes: ["Pinot Noir", "Chardonnay"], note: "Nuits-Saint-Georges anchors the southern sector; the Côte de Nuits-Villages appellation continues through several neighbouring communes.", sourceIds: ["bourgogne-cote-de-nuits", "bourgogne-cdn-villages"] },
    ],
    grapes: [
      { id: "cdn-pinot-noir", name: "Pinot Noir", colour: "black", prominence: "defining", ripening: "Early-budding and relatively early-ripening; highly sensitive to site and vintage conditions.", structuralRole: "The sole or overwhelmingly dominant red-wine variety, carrying the whole balance of colour, acidity, tannin and texture rather than filling one component of a blend.", aromaticRole: "Red and dark fruit, floral, spice and earth registers vary with maturity, site and élevage; village stereotypes should be treated as comparison hypotheses, not guarantees.", regionalUse: "Nearly all Côte de Nuits reds and every red Grand Cru here are Pinot Noir-led single-variety wines.", sourceIds: ["bourgogne-cote-de-nuits", "bourgogne-grapes"] },
      { id: "cdn-chardonnay", name: "Chardonnay", colour: "white", prominence: "minor", ripening: "Early-budding and adaptable, but much less planted here than in the Côte de Beaune.", structuralRole: "Provides the small white-wine counterpoint to the region's Pinot Noir identity.", aromaticRole: "Expression depends strongly on site and élevage; do not transfer a generic Côte de Beaune white profile wholesale.", regionalUse: "Permitted in limited white production such as Côte de Nuits-Villages and some village exceptions.", sourceIds: ["bourgogne-cote-de-nuits", "bourgogne-cdn-villages"] },
      { id: "cdn-aligote", name: "Aligoté", colour: "white", prominence: "minor", ripening: "Earlier-ripening traditional Bourgogne variety.", structuralRole: "A fresh, acid-driven regional white alternative, outside the Côte's prestige hierarchy.", aromaticRole: "Typically restrained and citrus/herbal rather than oak-led, though producer choices matter.", regionalUse: "Present in the wider regional vineyard rather than as the defining grape of Côte de Nuits village appellations.", caveat: "Included for regional literacy, not because it defines the Côte de Nuits map point.", sourceIds: ["bourgogne-cote-de-nuits", "bourgogne-grapes"] },
    ],
    expressions: [
      { id: "cdn-geography-flight", label: "Four-village Pinot Noir flight", style: "dry red", principalGrapes: ["Pinot Noir"], whyItMatters: "It isolates geographic framing while holding grape and broad climate constant.", comparisonPrompt: "Compare structure, perfume and fruit register across Gevrey, Chambolle, Vosne and Nuits without treating the village name as a guaranteed flavour.", sourceIds: ["bourgogne-cote-de-nuits"] },
      { id: "cdn-white-exception", label: "Côte de Nuits white exception", style: "dry white", principalGrapes: ["Chardonnay"], whyItMatters: "It corrects the shorthand that the Côte de Nuits produces only red wine.", comparisonPrompt: "Ask whether geography or cellar choices explain more of the contrast with a Côte de Beaune Chardonnay.", sourceIds: ["bourgogne-cdn-villages"] },
    ],
    pitfalls: ["Do not teach village character as deterministic flavour law.", "Do not describe all Côte de Nuits wine as Grand Cru; regional, village and Premier Cru levels matter.", "Do not imply that soil minerals pass directly into wine flavour."],
    sourceIds: ["bourgogne-cote-de-nuits", "bourgogne-grapes", "bourgogne-cdn-villages"],
  },
  {
    id: "cote-de-beaune",
    name: "Côte de Beaune",
    systemSummary: "A mixed red-and-white Côte d'Or system: Pinot Noir is prominent around Beaune and in Pommard/Volnay, while Chardonnay increasingly dominates from Meursault southward and defines the great Montrachet family of Grands Crus.",
    teachingFocus: "Use a north-to-south transition: red-and-white Corton and Beaune, Pinot Noir benchmarks Pommard/Volnay, then Chardonnay benchmarks Meursault/Puligny/Chassagne.",
    geography: {
      scope: "The southern Côte d'Or around Beaune, continuing through the renowned white-wine villages toward Santenay and Maranges, plus the higher Hautes-Côtes de Beaune.",
      soils: "Jurassic limestone and marl recur, but local strata, slope position, clay, altitude and exposure change over short distances.",
      climate: "Continental, with mesoclimate differences along the escarpment; south and east-facing slopes are central but cannot be reduced to one exposure rule.",
    },
    appellationFamilies: [
      { id: "cdb-corton", name: "Corton hill", category: "village / Premier Cru / Grand Cru", dominantStyles: ["red", "white"], keyGrapes: ["Pinot Noir", "Chardonnay"], note: "Corton is the key exception that joins red Corton with white Corton-Charlemagne on one hill system.", sourceIds: ["bourgogne-cote-de-beaune"] },
      { id: "cdb-beaune", name: "Beaune, Savigny and neighbouring communes", category: "village / Premier Cru", dominantStyles: ["red", "white"], keyGrapes: ["Pinot Noir", "Chardonnay"], note: "Mixed production makes this sector useful for separating grape from place.", sourceIds: ["bourgogne-cote-de-beaune"] },
      { id: "cdb-pommard-volnay", name: "Pommard and Volnay", category: "village / Premier Cru", dominantStyles: ["red"], keyGrapes: ["Pinot Noir"], note: "Two adjacent Pinot Noir references suited to disciplined side-by-side comparison rather than fixed muscular-versus-delicate clichés.", sourceIds: ["bourgogne-cote-de-beaune"] },
      { id: "cdb-white-core", name: "Meursault, Puligny-Montrachet and Chassagne-Montrachet", category: "village / Premier Cru / Grand Cru", dominantStyles: ["white", "some red"], keyGrapes: ["Chardonnay", "Pinot Noir"], note: "Chardonnay dominates the celebrated white-wine core; the Montrachet family of Grands Crus sits around Puligny and Chassagne.", sourceIds: ["bourgogne-cote-de-beaune"] },
      { id: "cdb-south-hautes", name: "Santenay, Maranges and Hautes-Côtes", category: "regional / village / Premier Cru", dominantStyles: ["red", "white", "rosé"], keyGrapes: ["Pinot Noir", "Chardonnay"], note: "The southern and higher-altitude edges broaden the Côte's style and price picture beyond its prestige villages.", sourceIds: ["bourgogne-cote-de-beaune", "bourgogne-grapes"] },
    ],
    grapes: [
      { id: "cdb-chardonnay", name: "Chardonnay", colour: "white", prominence: "defining", ripening: "Early-budding and early-ripening, making frost and harvest timing important.", structuralRole: "Carries acidity, alcohol and texture as a single-variety white; lees, vessel and malolactic choices can materially reshape its expression.", aromaticRole: "Fruit, floral, nutty and reductive registers depend on site, maturity and élevage rather than on appellation name alone.", regionalUse: "Dominant from Meursault southward and the basis of Corton-Charlemagne and the Montrachet Grand Crus.", sourceIds: ["bourgogne-cote-de-beaune", "bourgogne-grapes"] },
      { id: "cdb-pinot-noir", name: "Pinot Noir", colour: "black", prominence: "major", ripening: "Early-budding and relatively early-ripening.", structuralRole: "Carries the entire red-wine structure, most importantly around Beaune, Pommard, Volnay and red Corton.", aromaticRole: "Site and maturity modulate red/dark fruit, floral, spice and savoury notes; extraction and whole-bunch use can also be conspicuous.", regionalUse: "Major in the northern Côte de Beaune and present farther south alongside Chardonnay.", sourceIds: ["bourgogne-cote-de-beaune", "bourgogne-grapes"] },
    ],
    expressions: [
      { id: "cdb-red-pair", label: "Pommard versus Volnay", style: "dry red", principalGrapes: ["Pinot Noir"], whyItMatters: "A close geographic comparison tests whether site differences survive vintage and producer variation.", comparisonPrompt: "Compare tannin shape, perfume and fruit while recording producer and vintage before reaching for village stereotypes.", sourceIds: ["bourgogne-cote-de-beaune"] },
      { id: "cdb-white-triad", label: "Meursault–Puligny–Chassagne Chardonnay", style: "dry white", principalGrapes: ["Chardonnay"], whyItMatters: "It is the canonical place-over-grape comparison for white Bourgogne.", comparisonPrompt: "Separate acidity and texture from oak, reduction, lees and bottle age before assigning differences to village.", sourceIds: ["bourgogne-cote-de-beaune", "bourgogne-grapes"] },
      { id: "cdb-corton-pair", label: "Corton red and Corton-Charlemagne white", style: "dry red / dry white", principalGrapes: ["Pinot Noir", "Chardonnay"], whyItMatters: "One hill makes the grape contrast explicit while preserving a shared geographic frame.", comparisonPrompt: "Which differences are clearly grape-driven, and which might reflect position around the hill or winemaking?", sourceIds: ["bourgogne-cote-de-beaune"] },
    ],
    pitfalls: ["Do not reduce the whole Côte de Beaune to white wine.", "Do not make oak a required property of Chardonnay.", "Do not treat the village hierarchy as a sensory quality score independent of producer and vintage."],
    sourceIds: ["bourgogne-cote-de-beaune", "bourgogne-grapes"],
  },
  {
    id: "beaujolais",
    name: "Beaujolais",
    systemSummary: "A predominantly Gamay red-wine region organised as Beaujolais, Beaujolais-Villages and ten northern crus, with a small but important Chardonnay white category at regional and Villages level.",
    teachingFocus: "Move from appellation tier to cru identity, then contrast vinification choices; keep Chardonnay as a distinct minority branch rather than an afterthought.",
    geography: {
      scope: "A long north-south vineyard between Mâconnais and Lyon: the ten crus lie in the north, while broader Beaujolais extends farther south.",
      soils: "A documented mosaic of more than 300 soil variants, with granitic and metamorphic terrains prominent in the north and more clay-limestone sectors farther south.",
      climate: "Temperate with continental, oceanic and Mediterranean influences; altitude, slope and exposure diversify ripening conditions.",
    },
    appellationFamilies: [
      { id: "beaujolais-regional", name: "Beaujolais", category: "regional", dominantStyles: ["red", "rosé", "white", "nouveau"], keyGrapes: ["Gamay", "Chardonnay"], note: "Gamay makes red and rosé; Chardonnay makes white. Nouveau is a release category, not a separate grape or place.", sourceIds: ["beaujolais-aoc", "beaujolais-discover"] },
      { id: "beaujolais-villages-family", name: "Beaujolais-Villages", category: "regional-villages", dominantStyles: ["red", "rosé", "white", "nouveau"], keyGrapes: ["Gamay", "Chardonnay"], note: "Thirty-eight communes on hillier terrain may use the Villages designation; the geology remains diverse rather than uniformly granite.", sourceIds: ["beaujolais-villages"] },
      { id: "beaujolais-crus-west", name: "Brouilly, Côte de Brouilly, Régnié, Morgon and Chiroubles", category: "cru", dominantStyles: ["red"], keyGrapes: ["Gamay"], note: "Named crus are geographic appellations, not formal quality ranks. Each should be learned as a place with internal variation.", sourceIds: ["beaujolais-discover"] },
      { id: "beaujolais-crus-north", name: "Fleurie, Moulin-à-Vent, Chénas, Juliénas and Saint-Amour", category: "cru", dominantStyles: ["red"], keyGrapes: ["Gamay"], note: "The northern crus complete the ten-cru system and permit only red wine under the cru name.", sourceIds: ["beaujolais-discover"] },
    ],
    grapes: [
      { id: "beaujolais-gamay", name: "Gamay noir à jus blanc", colour: "black", prominence: "defining", ripening: "Early-budding and early-ripening, well suited to the region's northern latitude and slopes.", structuralRole: "Usually moderate in tannin and capable of a wide structural range depending on site, yield, maceration and extraction; it is not inherently limited to light nouveau.", aromaticRole: "Red and dark fruit, floral and spice expressions vary with cru and vinification; semi-carbonic or carbonic techniques can emphasise vivid fruit.", regionalUse: "The basis of all red and rosé Beaujolais, including every cru.", sourceIds: ["beaujolais-discover", "beaujolais-aoc", "beaujolais-villages"] },
      { id: "beaujolais-chardonnay", name: "Chardonnay", colour: "white", prominence: "minor", ripening: "Early-budding and early-ripening.", structuralRole: "Makes the region's dry whites, often with lees ageing; acidity and texture vary with site and cellar choices.", aromaticRole: "Official material highlights floral and citrus-to-stone-fruit profiles, but expression is not uniform.", regionalUse: "About two percent of the vineyard, used for Beaujolais and Beaujolais-Villages white rather than cru-labelled wine.", sourceIds: ["beaujolais-chardonnay", "beaujolais-aoc", "beaujolais-villages"] },
    ],
    expressions: [
      { id: "beaujolais-tier-flight", label: "Beaujolais–Villages–Cru Gamay", style: "dry red", principalGrapes: ["Gamay"], whyItMatters: "It demonstrates that appellation scope and vinification, not a grape change, drive the comparison.", comparisonPrompt: "Track concentration, tannin and fruit character while checking whether fermentation method or élevage explains the apparent tier difference.", sourceIds: ["beaujolais-discover", "beaujolais-aoc", "beaujolais-villages"] },
      { id: "beaujolais-cru-contrast", label: "Morgon versus Fleurie versus Moulin-à-Vent", style: "dry red", principalGrapes: ["Gamay"], whyItMatters: "Three cru names provide a memorable but falsifiable place comparison.", comparisonPrompt: "Can you distinguish site-linked structure from producer extraction and bottle age?", sourceIds: ["beaujolais-discover"] },
      { id: "beaujolais-white", label: "Beaujolais Blanc", style: "dry white", principalGrapes: ["Chardonnay"], whyItMatters: "It prevents the region being represented as red-only and creates a direct nearby comparison with Mâconnais and Côte d'Or Chardonnay.", comparisonPrompt: "Compare acidity, lees texture and oak signature before reaching for regional conclusions.", sourceIds: ["beaujolais-chardonnay"] },
    ],
    pitfalls: ["Do not equate all Beaujolais with nouveau.", "Do not describe the ten crus as a formal ladder from lowest to highest.", "Do not claim every northern site is pure granite or every southern site is limestone."],
    sourceIds: ["beaujolais-discover", "beaujolais-aoc", "beaujolais-villages", "beaujolais-chardonnay"],
  },
  {
    id: "bordeaux-left-bank",
    name: "Bordeaux · Left Bank",
    systemSummary: "A useful teaching umbrella for the Médoc peninsula and Graves/Pessac-Léognan, where gravel-friendly Cabernet Sauvignon is often the red blend's structural spine, tempered by Merlot and detailed by Cabernet Franc, Petit Verdot and other permitted varieties.",
    teachingFocus: "Drill into each red grape's role, then compare Cabernet-led Médoc with Graves/Pessac-Léognan, including the latter's major dry-white tradition.",
    geography: {
      scope: "Vineyards west and south of the Gironde/Garonne, especially Médoc and Haut-Médoc in the north and Graves/Pessac-Léognan south of Bordeaux city.",
      soils: "Gravel terraces are central to the Left Bank model because they drain and warm readily, but clay, sand and limestone components vary by estate and appellation.",
      climate: "Maritime and vintage-sensitive, with the estuary and Atlantic moderating temperatures while rain and autumn conditions affect late-ripening Cabernet Sauvignon and Petit Verdot.",
    },
    appellationFamilies: [
      { id: "left-medoc", name: "Médoc and Haut-Médoc", category: "regional / subregional", dominantStyles: ["red"], keyGrapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot"], note: "Cabernet Sauvignon commonly leads; Merlot adds roundness and red fruit, while Cabernet Franc and Petit Verdot can add structure and complexity.", sourceIds: ["bordeaux-medoc", "bordeaux-cabernet-sauvignon", "bordeaux-merlot"] },
      { id: "left-communes", name: "Margaux, Saint-Julien, Pauillac, Saint-Estèphe, Moulis and Listrac", category: "communal", dominantStyles: ["red"], keyGrapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot"], note: "Communal appellations make better drill-down units than a single Left Bank flavour profile; blend proportions remain estate- and vintage-specific.", sourceIds: ["bordeaux-medoc"] },
      { id: "left-graves-red", name: "Graves and Pessac-Léognan red", category: "subregional / communal", dominantStyles: ["red"], keyGrapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot", "Carménère", "Malbec"], note: "Cabernet Sauvignon and Merlot lead, with the other authorised black varieties in smaller roles.", sourceIds: ["bordeaux-pessac-leognan", "bordeaux-grapes"] },
      { id: "left-graves-white", name: "Graves and Pessac-Léognan white", category: "subregional / communal", dominantStyles: ["dry white"], keyGrapes: ["Sauvignon Blanc", "Sémillon", "Sauvignon Gris", "Muscadelle"], note: "The Left Bank is not only red: Pessac-Léognan and Graves produce important dry white blends alongside reds.", sourceIds: ["bordeaux-pessac-leognan"] },
    ],
    grapes: [
      { id: "left-cab-sauv", name: "Cabernet Sauvignon", colour: "black", prominence: "defining", ripening: "Late; Bordeaux's official material places harvest roughly seven to twelve days after Merlot.", structuralRole: "Adds firm tannin, acidity, colour, depth and ageing structure; it often forms the spine of gravel-grown Médoc blends.", aromaticRole: "Black fruit and spice are common reference points, with maturity and élevage strongly affecting expression.", regionalUse: "Especially associated with the Médoc and Graves gravel terraces and frequently the largest component of classified Left Bank reds.", caveat: "Cabernet-led is a regional tendency, not a legal recipe; Merlot can lead particular estates, soils or vintages.", sourceIds: ["bordeaux-cabernet-sauvignon", "bordeaux-medoc"] },
      { id: "left-merlot", name: "Merlot", colour: "black", prominence: "major", ripening: "Early relative to the Cabernets.", structuralRole: "Adds alcohol, mid-palate volume, roundness and softer texture, balancing Cabernet Sauvignon's firmer frame.", aromaticRole: "Often brings ripe red-to-dark fruit and a plush fruit register.", regionalUse: "A major blending partner throughout the Left Bank and potentially dominant on cooler or more clay-influenced parcels.", sourceIds: ["bordeaux-merlot", "bordeaux-medoc"] },
      { id: "left-cab-franc", name: "Cabernet Franc", colour: "black", prominence: "supporting", ripening: "Intermediate between Merlot and Cabernet Sauvignon.", structuralRole: "Can add freshness, fine-grained tannin and lift without simply duplicating Cabernet Sauvignon's structure.", aromaticRole: "Raspberry, violet and floral freshness are highlighted by Bordeaux's official grape profile.", regionalUse: "Usually a supporting component on the Left Bank, less prominent than on the Right Bank.", sourceIds: ["bordeaux-cabernet-franc", "bordeaux-grapes"] },
      { id: "left-petit-verdot", name: "Petit Verdot", colour: "black", prominence: "supporting", ripening: "Very late, making full maturity vintage- and site-sensitive.", structuralRole: "A small proportion can intensify colour, tannin, texture and power.", aromaticRole: "Adds spicy and dark-fruit aromatic depth when ripe.", regionalUse: "Most closely associated with Left Bank and Graves blends, generally at low percentages.", caveat: "Its strong contribution does not mean it appears in every blend or at a standard percentage.", sourceIds: ["bordeaux-petit-verdot", "bordeaux-medoc"] },
      { id: "left-malbec-carmenere", name: "Malbec and Carménère", colour: "black", prominence: "minor", ripening: "Distinct varieties with different cycles; grouped here only because both are minor in contemporary Left Bank plantings.", structuralRole: "May add colour, fruit, spice or body depending on variety and ripeness.", aromaticRole: "Their effect is producer-specific and should be described from the actual blend rather than inferred from the appellation.", regionalUse: "Authorised auxiliary Bordeaux varieties, encountered far less often than Cabernet Sauvignon, Merlot or Cabernet Franc.", caveat: "Do not present them as interchangeable; a later data pass should separate them if individual bottlings warrant it.", sourceIds: ["bordeaux-grapes", "bordeaux-pessac-leognan"] },
      { id: "left-sauvignon", name: "Sauvignon Blanc / Sauvignon Gris", colour: "white", prominence: "major", ripening: "Earlier than Cabernet Sauvignon; picking date strongly affects freshness and aroma.", structuralRole: "Typically supplies acidity, freshness and linear drive to dry white blends.", aromaticRole: "Citrus, herbal and tropical registers vary with ripeness, skin contact and fermentation.", regionalUse: "A principal partner with Sémillon in Graves and Pessac-Léognan dry whites.", sourceIds: ["bordeaux-pessac-leognan"] },
      { id: "left-semillon", name: "Sémillon", colour: "white", prominence: "major", ripening: "Mid-ripening and susceptible to noble rot in suitable conditions, though the focus here is dry wine.", structuralRole: "Adds body, texture and ageing capacity to dry white blends, often softening Sauvignon's sharper line.", aromaticRole: "Can contribute waxy, citrus and stone-fruit notes as it develops.", regionalUse: "A principal dry-white variety in Graves and Pessac-Léognan, with Muscadelle in a smaller aromatic role.", sourceIds: ["bordeaux-pessac-leognan"] },
    ],
    expressions: [
      { id: "left-medoc-blend", label: "Cabernet-led Médoc blend", style: "dry red blend", principalGrapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot"], whyItMatters: "It makes the complementary functions of the main red varieties visible.", comparisonPrompt: "Identify tannin frame, mid-palate roundness and aromatic lift, then check the published blend rather than guessing percentages.", sourceIds: ["bordeaux-medoc", "bordeaux-cabernet-sauvignon", "bordeaux-merlot", "bordeaux-cabernet-franc", "bordeaux-petit-verdot"] },
      { id: "left-communal-flight", label: "Margaux–Pauillac–Saint-Estèphe comparison", style: "dry red blends", principalGrapes: ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Petit Verdot"], whyItMatters: "It introduces communal geography while keeping the broad blend family constant.", comparisonPrompt: "Separate blend percentage, vintage and producer extraction from any conclusion about commune.", sourceIds: ["bordeaux-medoc"] },
      { id: "left-pessac-pair", label: "Pessac-Léognan red and white", style: "dry red / dry white", principalGrapes: ["Cabernet Sauvignon", "Merlot", "Sauvignon Blanc", "Sémillon"], whyItMatters: "It prevents the Left Bank from being taught as a red-only Cabernet system.", comparisonPrompt: "Compare how blending solves structural balance in two colours using entirely different grape sets.", sourceIds: ["bordeaux-pessac-leognan"] },
    ],
    pitfalls: ["Left Bank does not mean 100% Cabernet Sauvignon.", "Blend percentages change by estate and vintage; they are not appellation recipes.", "Petit Verdot is potent but usually minor, and full ripeness is not assured every year.", "Graves and Pessac-Léognan require a white-wine branch in any complete model."],
    sourceIds: ["bordeaux-grapes", "bordeaux-cabernet-sauvignon", "bordeaux-merlot", "bordeaux-cabernet-franc", "bordeaux-petit-verdot", "bordeaux-medoc", "bordeaux-pessac-leognan"],
  },
  {
    id: "bordeaux-right-bank",
    name: "Bordeaux · Right Bank",
    systemSummary: "A Merlot-centred red-wine system east of the Dordogne/Gironde, with Cabernet Franc especially important in Saint-Émilion and a smaller supporting role for Cabernet Sauvignon and other authorised Bordeaux varieties.",
    teachingFocus: "Compare Merlot's volume and earlier ripening with Cabernet Franc's aromatic lift and tannic line, then distinguish Saint-Émilion's varied limestone/clay/sand settings from Pomerol's small plateau and surrounding soils.",
    geography: {
      scope: "Saint-Émilion and its satellites, Pomerol and Lalande-de-Pomerol, Fronsac/Canon-Fronsac and the wider Côtes on the eastern side of the Dordogne/Gironde system.",
      soils: "Clay-limestone plateaus and slopes, gravel sectors and sandier foothills recur in different proportions; Pomerol and Saint-Émilion should not be flattened into one 'clay soil' story.",
      climate: "Maritime Bordeaux conditions, with Merlot's earlier cycle reducing some late-season risk while Cabernet Franc and Cabernet Sauvignon retain site- and vintage-sensitive roles.",
    },
    appellationFamilies: [
      { id: "right-saint-emilion", name: "Saint-Émilion and Saint-Émilion Grand Cru", category: "communal", dominantStyles: ["red"], keyGrapes: ["Merlot", "Cabernet Franc", "Cabernet Sauvignon"], note: "Merlot normally leads, Cabernet Franc is often substantial, and Cabernet Sauvignon is smaller; Malbec, Petit Verdot and Carménère are minor authorised contributors.", sourceIds: ["bordeaux-saint-emilion", "bordeaux-grapes"] },
      { id: "right-satellites", name: "Saint-Émilion satellites", category: "communal", dominantStyles: ["red"], keyGrapes: ["Merlot", "Cabernet Franc", "Cabernet Sauvignon"], note: "Montagne, Lussac, Puisseguin and Saint-Georges extend the Merlot/Cabernet Franc model but remain distinct appellations and terroirs.", sourceIds: ["bordeaux-saint-emilion"] },
      { id: "right-pomerol", name: "Pomerol and Lalande-de-Pomerol", category: "communal", dominantStyles: ["red"], keyGrapes: ["Merlot", "Cabernet Franc", "Cabernet Sauvignon"], note: "Pomerol plantings are presented officially at about 80% Merlot, 15% Cabernet Franc and 5% Cabernet Sauvignon; that is vineyard composition, not a mandatory bottle formula.", sourceIds: ["bordeaux-pomerol"] },
      { id: "right-fronsac", name: "Fronsac, Canon-Fronsac and the Côtes", category: "communal / subregional", dominantStyles: ["red"], keyGrapes: ["Merlot", "Cabernet Franc", "Cabernet Sauvignon", "Malbec"], note: "These areas broaden the Right Bank beyond its two most famous names and deserve their own geographic layer in a later UI pass.", sourceIds: ["bordeaux-grapes", "bordeaux-saint-emilion"] },
    ],
    grapes: [
      { id: "right-merlot", name: "Merlot", colour: "black", prominence: "defining", ripening: "Earlier than both Cabernets.", structuralRole: "Supplies alcohol, roundness, volume and comparatively supple tannin, often forming the majority of the blend.", aromaticRole: "Ripe red and dark fruit commonly anchor the aromatic profile.", regionalUse: "Dominant in Pomerol and widely dominant across Saint-Émilion, Fronsac and the Côtes.", caveat: "Merlot-led does not mean soft, simple or early-drinking; site, extraction, Cabernet partners and élevage can produce substantial structure and longevity.", sourceIds: ["bordeaux-merlot", "bordeaux-pomerol", "bordeaux-saint-emilion"] },
      { id: "right-cab-franc", name: "Cabernet Franc", colour: "black", prominence: "major", ripening: "Intermediate: later than Merlot and earlier than Cabernet Sauvignon.", structuralRole: "Adds freshness, defined tannin and length while retaining a comparatively silky profile when ripe.", aromaticRole: "Bordeaux's official profile highlights raspberry, violet, freshness and finesse.", regionalUse: "A major partner in Saint-Émilion and Pomerol; its regional stronghold is the Right Bank, and it can lead individual estates or parcels.", sourceIds: ["bordeaux-cabernet-franc", "bordeaux-saint-emilion", "bordeaux-pomerol"] },
      { id: "right-cab-sauv", name: "Cabernet Sauvignon", colour: "black", prominence: "supporting", ripening: "Late, so warm and well-drained Right Bank sites are most suitable.", structuralRole: "Adds firm tannin, acidity and ageing structure in smaller proportions.", aromaticRole: "Can add black fruit and spice to a Merlot/Cabernet Franc base.", regionalUse: "A minority variety across the Right Bank; Pomerol's official vineyard figures give it about five percent.", sourceIds: ["bordeaux-cabernet-sauvignon", "bordeaux-pomerol", "bordeaux-saint-emilion"] },
      { id: "right-minor-reds", name: "Malbec, Petit Verdot and Carménère", colour: "black", prominence: "minor", ripening: "Variety-specific; Petit Verdot is notably late.", structuralRole: "Small additions may affect colour, spice, tannin or body, but contribution depends on the exact variety and ripeness.", aromaticRole: "Best taught from a disclosed estate blend rather than assigned a generic Right Bank signature.", regionalUse: "Authorised in Bordeaux and present only as minor contributors in this regional system.", caveat: "These are three distinct grapes grouped only for navigation; the drill-down should preserve their individual identities.", sourceIds: ["bordeaux-grapes", "bordeaux-petit-verdot", "bordeaux-saint-emilion"] },
    ],
    expressions: [
      { id: "right-se-blend", label: "Saint-Émilion Merlot–Cabernet Franc blend", style: "dry red blend", principalGrapes: ["Merlot", "Cabernet Franc", "Cabernet Sauvignon"], whyItMatters: "It shows that Right Bank identity is a partnership, not a synonym for varietal Merlot.", comparisonPrompt: "Use the actual blend to ask what Cabernet Franc changes in aroma, tannin and freshness relative to a more Merlot-dominant wine.", sourceIds: ["bordeaux-saint-emilion", "bordeaux-merlot", "bordeaux-cabernet-franc"] },
      { id: "right-pomerol", label: "Merlot-dominant Pomerol", style: "dry red blend", principalGrapes: ["Merlot", "Cabernet Franc", "Cabernet Sauvignon"], whyItMatters: "It provides the clearest contrast with Cabernet-led Médoc while retaining Bordeaux's blend logic.", comparisonPrompt: "Compare tannin shape and mid-palate volume, controlling for vintage and élevage before attributing every difference to bank.", sourceIds: ["bordeaux-pomerol"] },
      { id: "right-geography", label: "Saint-Émilion plateau–slope–foot comparison", style: "dry red blends", principalGrapes: ["Merlot", "Cabernet Franc"], whyItMatters: "It replaces a single Right Bank soil story with internal geographic variation.", comparisonPrompt: "Record soil setting and blend percentage together; which variable best explains the observed difference?", sourceIds: ["bordeaux-saint-emilion"] },
    ],
    pitfalls: ["Right Bank does not mean 100% Merlot.", "Pomerol's 80/15/5 figures describe vineyard plantings, not a compulsory blend.", "Cabernet Franc is a major identity grape here, not merely seasoning.", "Do not generalise Saint-Émilion and Pomerol into one soil or classification system."],
    sourceIds: ["bordeaux-grapes", "bordeaux-merlot", "bordeaux-cabernet-franc", "bordeaux-cabernet-sauvignon", "bordeaux-petit-verdot", "bordeaux-saint-emilion", "bordeaux-pomerol"],
  },
  {
    id: "northern-rhone",
    name: "Northern Rhône",
    systemSummary: "A narrow, steep, predominantly granitic and metamorphic Rhône corridor where Syrah defines reds and Viognier, Marsanne and Roussanne define whites; appellation rules determine when co-fermentation or blending is possible.",
    teachingFocus: "Start with four grapes, then map them to appellations: Syrah red; Viognier at Condrieu/Château-Grillet; Marsanne–Roussanne at Hermitage, Crozes-Hermitage, Saint-Joseph and Saint-Péray.",
    geography: {
      scope: "The river corridor from Côte-Rôtie/Condrieu in the north through Hermitage/Crozes-Hermitage to Cornas and Saint-Péray in the south.",
      soils: "Steep granite and metamorphic slopes dominate the mental model, but Hermitage and Crozes-Hermitage include important clay, limestone, loess, sand and alluvial variation.",
      climate: "A temperate-to-continental northern sector with strong slope, exposure and wind effects, transitioning toward greater Mediterranean influence southward.",
    },
    appellationFamilies: [
      { id: "north-cote-rotie", name: "Côte-Rôtie", category: "cru", dominantStyles: ["red"], keyGrapes: ["Syrah", "Viognier"], note: "Syrah is the red base; Viognier may be planted and co-vinified with it, contributing aromatic and textural lift rather than making the wine white-like.", sourceIds: ["rhone-cote-rotie"] },
      { id: "north-condrieu", name: "Condrieu and Château-Grillet", category: "cru", dominantStyles: ["white"], keyGrapes: ["Viognier"], note: "These are the Northern Rhône's Viognier-only white reference points on steep granitic terraces.", sourceIds: ["rhone-condrieu", "rhone-grapes"] },
      { id: "north-hermitage", name: "Hermitage and Crozes-Hermitage", category: "cru", dominantStyles: ["red", "white"], keyGrapes: ["Syrah", "Marsanne", "Roussanne"], note: "Red Hermitage is Syrah and may include up to 15% Marsanne/Roussanne; whites use Marsanne and Roussanne. Crozes-Hermitage produces both Syrah red and Marsanne/Roussanne white.", sourceIds: ["rhone-hermitage", "rhone-crozes-hermitage"] },
      { id: "north-st-joseph", name: "Saint-Joseph", category: "cru", dominantStyles: ["red", "white"], keyGrapes: ["Syrah", "Marsanne", "Roussanne"], note: "A long appellation whose scale and site diversity make it unsuited to a single style shorthand.", sourceIds: ["rhone-grapes"] },
      { id: "north-cornas-st-peray", name: "Cornas and Saint-Péray", category: "cru", dominantStyles: ["red", "still white", "sparkling white"], keyGrapes: ["Syrah", "Marsanne", "Roussanne"], note: "Cornas is 100% Syrah red; neighbouring Saint-Péray is white, still or sparkling, from Marsanne and Roussanne.", sourceIds: ["rhone-cornas", "rhone-grapes"] },
    ],
    grapes: [
      { id: "north-syrah", name: "Syrah", colour: "black", prominence: "defining", ripening: "Mid-ripening, later than early varieties but earlier than grapes such as Mourvèdre.", structuralRole: "Carries colour, acidity, tannin and body as the sole or dominant red grape; extraction, stems and élevage can shift its shape substantially.", aromaticRole: "Dark fruit, violet, pepper, olive, smoke and savoury registers are common reference points, not guaranteed markers.", regionalUse: "The defining red variety of every Northern Rhône cru; Cornas is 100% Syrah, while certain other appellations permit white-grape additions.", sourceIds: ["rhone-grapes", "rhone-cornas", "rhone-cote-rotie", "rhone-hermitage"] },
      { id: "north-viognier", name: "Viognier", colour: "white", prominence: "major", ripening: "Early-to-mid ripening and capable of accumulating sugar while acidity falls, so picking balance is critical.", structuralRole: "Produces full-bodied, relatively low-acid whites; in Côte-Rôtie, a permitted small co-fermented component can soften and perfume Syrah.", aromaticRole: "Floral and stone-fruit aromas are central to its identity, modulated by ripeness and fermentation.", regionalUse: "Sole variety in Condrieu and Château-Grillet; permitted partner to Syrah in Côte-Rôtie.", caveat: "Not every Côte-Rôtie contains Viognier, and a permitted maximum is not a typical recipe.", sourceIds: ["rhone-condrieu", "rhone-cote-rotie", "rhone-grapes"] },
      { id: "north-marsanne", name: "Marsanne", colour: "white", prominence: "major", ripening: "Mid-ripening.", structuralRole: "Brings body, breadth and ageing capacity to still whites and forms the principal white-grape base in several appellations.", aromaticRole: "Subtle orchard, floral, nutty and waxy development is more typical than overt perfume.", regionalUse: "Used with Roussanne in Hermitage, Crozes-Hermitage, Saint-Joseph and Saint-Péray; may be included in red Hermitage within appellation limits.", sourceIds: ["rhone-hermitage", "rhone-crozes-hermitage", "rhone-grapes"] },
      { id: "north-roussanne", name: "Roussanne", colour: "white", prominence: "supporting", ripening: "Later and less reliably productive than Marsanne.", structuralRole: "Often contributes acidity and precision to Marsanne's broader texture.", aromaticRole: "Can add floral, herbal and stone-fruit complexity.", regionalUse: "A partner to Marsanne in the central and southern Northern Rhône white appellations and a possible minor component of red Hermitage.", sourceIds: ["rhone-hermitage", "rhone-crozes-hermitage", "rhone-grapes"] },
    ],
    expressions: [
      { id: "north-syrah-flight", label: "Côte-Rôtie–Hermitage–Cornas Syrah", style: "dry red", principalGrapes: ["Syrah", "possible permitted white co-ferments"], whyItMatters: "It holds the defining black grape constant while comparing latitude, geology, exposure and appellation rules.", comparisonPrompt: "Check for Viognier or Marsanne/Roussanne additions before attributing all aromatic and textural differences to site.", sourceIds: ["rhone-cote-rotie", "rhone-hermitage", "rhone-cornas"] },
      { id: "north-white-pair", label: "Condrieu versus Hermitage Blanc", style: "dry white", principalGrapes: ["Viognier", "Marsanne", "Roussanne"], whyItMatters: "It cleanly contrasts the region's perfumed Viognier branch with its Marsanne/Roussanne branch.", comparisonPrompt: "Compare aroma intensity, acidity and texture while noting alcohol, oak and bottle age.", sourceIds: ["rhone-condrieu", "rhone-hermitage"] },
      { id: "north-crozes", label: "Crozes-Hermitage red and white", style: "dry red / dry white", principalGrapes: ["Syrah", "Marsanne", "Roussanne"], whyItMatters: "One broad appellation exposes both grape families and substantial internal site diversity.", comparisonPrompt: "Use subzone, soil and producer data rather than treating Crozes-Hermitage as a single uniform style.", sourceIds: ["rhone-crozes-hermitage"] },
    ],
    pitfalls: ["Do not describe all Northern Rhône red as legally 100% Syrah.", "Do not imply that every Côte-Rôtie includes Viognier.", "Do not teach Crozes-Hermitage or Saint-Joseph as geologically uniform.", "Keep Marsanne and Roussanne distinct rather than labelling both simply 'white Rhône grapes'."],
    sourceIds: ["rhone-grapes", "rhone-cote-rotie", "rhone-hermitage", "rhone-cornas", "rhone-condrieu", "rhone-crozes-hermitage"],
  },
  {
    id: "southern-rhone",
    name: "Southern Rhône",
    systemSummary: "A Mediterranean, blend-oriented system in which Grenache Noir commonly leads reds and rosés, with Syrah and Mourvèdre as principal partners and Cinsault, Carignan, Counoise and many other grapes serving appellation-specific roles; white blends are similarly multi-varietal.",
    teachingFocus: "Teach blend function rather than the loose acronym GSM: Grenache's fruit/body, Syrah's colour/structure, Mourvèdre's late-ripening tannic depth, Cinsault's suppleness and rosé utility, then the distinct white-grape family.",
    geography: {
      scope: "The broad Rhône basin south of Montélimar, including Côtes du Rhône and Villages plus crus such as Châteauneuf-du-Pape, Gigondas, Vacqueyras, Rasteau, Lirac and Tavel.",
      soils: "Clay, limestone, marl, sand, gravel and rounded-stone terraces recur in complex combinations; galets roulés are iconic at Châteauneuf but not the whole Southern Rhône story.",
      climate: "Mediterranean warmth, sunshine and drought pressure shaped by the Mistral, with altitude and north-facing sites providing important variation.",
    },
    appellationFamilies: [
      { id: "south-cdr", name: "Côtes du Rhône", category: "regional", dominantStyles: ["red", "rosé", "white"], keyGrapes: ["Grenache Noir", "Syrah", "Mourvèdre", "Grenache Blanc", "Clairette", "Marsanne", "Roussanne", "Viognier"], note: "Red and rosé require at least two of Grenache, Syrah and Mourvèdre under current general rules, with other authorised grapes available within limits; northern-zone exceptions apply.", sourceIds: ["rhone-cotes-du-rhone", "rhone-grapes"] },
      { id: "south-villages", name: "Côtes du Rhône Villages", category: "subregional / named village", dominantStyles: ["red", "rosé", "white"], keyGrapes: ["Grenache Noir", "Syrah", "Mourvèdre", "Cinsault", "white Rhône varieties"], note: "Village and named-village tiers narrow geography and rules, but they do not impose one universal blend.", sourceIds: ["rhone-cotes-du-rhone", "rhone-grapes"] },
      { id: "south-cdp", name: "Châteauneuf-du-Pape", category: "cru", dominantStyles: ["red", "white"], keyGrapes: ["Grenache Noir", "Syrah", "Mourvèdre", "Cinsault", "Counoise", "Grenache Blanc", "Clairette", "Roussanne", "Bourboulenc"], note: "A broad authorised palette supports both red and white blends. Grenache is dominant in practice, but sandy, limestone, clay and stony sectors and producer choices create substantial variation.", sourceIds: ["rhone-chateauneuf", "rhone-grapes"] },
      { id: "south-gigondas", name: "Gigondas", category: "cru", dominantStyles: ["red", "rosé", "white"], keyGrapes: ["Grenache Noir", "Syrah", "Mourvèdre", "Cinsault", "Clairette"], note: "Grenache leads reds and rosés with Syrah, Mourvèdre and Cinsault adding complexity; white Gigondas, introduced from the 2023 vintage, must be at least 70% Clairette.", sourceIds: ["rhone-gigondas"] },
      { id: "south-rose", name: "Tavel", category: "cru", dominantStyles: ["rosé"], keyGrapes: ["Grenache Noir", "Cinsault", "Mourvèdre", "Syrah", "Clairette", "Bourboulenc", "Picpoul"], note: "Tavel is rosé-only and Grenache-based, with multiple black and white partners; its full-bodied style is a distinct branch, not a pale Provence template.", sourceIds: ["rhone-tavel"] },
    ],
    grapes: [
      { id: "south-grenache-noir", name: "Grenache Noir", colour: "black", prominence: "defining", ripening: "Late-ripening and well adapted to warm, dry, windy conditions.", structuralRole: "Commonly provides alcohol, body and broad fruit, with tannin and colour varying by yield, site and extraction.", aromaticRole: "Red fruit, dark fruit, dried herbs and spice can dominate the blend's core.", regionalUse: "The principal southern red grape across Côtes du Rhône and many crus, and the base of Tavel rosé.", caveat: "Grenache-led does not mean every wine is high-alcohol, pale or soft; site, harvest date and winemaking materially alter the result.", sourceIds: ["rhone-grapes", "rhone-cotes-du-rhone", "rhone-chateauneuf", "rhone-tavel"] },
      { id: "south-syrah", name: "Syrah", colour: "black", prominence: "major", ripening: "Mid-ripening, generally earlier than Mourvèdre.", structuralRole: "Adds colour, tannin, acidity and a firmer line to Grenache-led blends.", aromaticRole: "Dark fruit, violet, pepper and savoury notes can deepen the blend.", regionalUse: "One of the three principal Côtes du Rhône red varieties and a common component of southern crus.", sourceIds: ["rhone-grapes", "rhone-cotes-du-rhone", "rhone-chateauneuf", "rhone-gigondas"] },
      { id: "south-mourvedre", name: "Mourvèdre", colour: "black", prominence: "major", ripening: "Very late; needs sustained heat and light plus adequate water reserve to ripen fully.", structuralRole: "Adds deep colour, full body, tight tannin and ageing potential.", aromaticRole: "Black fruit, pepper, garrigue and bay can develop toward leather, game and truffle with age.", regionalUse: "A principal Côtes du Rhône variety and important partner in Châteauneuf-du-Pape, Gigondas, Vacqueyras and other warm southern sites.", caveat: "Its role expands in suitably warm sites and vintages; 'GSM' does not specify equal or fixed proportions.", sourceIds: ["rhone-mourvedre", "rhone-cotes-du-rhone", "rhone-gigondas"] },
      { id: "south-cinsault", name: "Cinsault", colour: "black", prominence: "supporting", ripening: "Mid-ripening and adapted to hot, dry, windy conditions.", structuralRole: "Brings supple tannin, moderate acidity and a lighter structural touch; especially useful in rosé.", aromaticRole: "Adds fragrant, fresh fruit and floral lift rather than deep colour.", regionalUse: "A common secondary grape in reds and rosés including Châteauneuf-du-Pape, Gigondas and Tavel.", sourceIds: ["rhone-cinsault", "rhone-gigondas", "rhone-tavel"] },
      { id: "south-carignan-counoise", name: "Carignan and Counoise", colour: "black", prominence: "supporting", ripening: "Both are warm-climate grapes, but their cycles and behaviour differ.", structuralRole: "Carignan can contribute acidity, tannin and savoury structure; Counoise is often used for freshness and a lighter spicy line.", aromaticRole: "They broaden the herb, spice and red-fruit range of complex blends.", regionalUse: "Appellation-specific secondary varieties; Counoise is particularly associated with Châteauneuf-du-Pape, while Carignan appears widely in the south.", caveat: "Grouped for navigation only; they should remain separate selectable grapes in a detailed UI.", sourceIds: ["rhone-grapes", "rhone-chateauneuf"] },
      { id: "south-white-core", name: "Grenache Blanc and Clairette", colour: "white", prominence: "major", ripening: "Warm-climate white varieties with appellation- and site-dependent harvest windows.", structuralRole: "Grenache Blanc commonly adds body and breadth; Clairette can provide freshness and is now the required majority in white Gigondas.", aromaticRole: "Orchard, citrus, floral and herbal registers are generally subtler than Viognier's overt perfume.", regionalUse: "Core components of Côtes du Rhône and cru white blends; Clairette must comprise at least 70% of white Gigondas.", sourceIds: ["rhone-grapes", "rhone-cotes-du-rhone", "rhone-gigondas"] },
      { id: "south-white-support", name: "Roussanne, Marsanne, Viognier and Bourboulenc", colour: "white", prominence: "supporting", ripening: "Variety-specific; Roussanne is relatively late and Viognier can lose acidity quickly as sugar rises.", structuralRole: "Together they can add acidity, volume, texture and ageing capacity, but no single role applies to every blend.", aromaticRole: "Roussanne and Viognier can add floral/stone-fruit lift, Marsanne breadth and nutty development, and Bourboulenc freshness.", regionalUse: "Used in varying combinations across Côtes du Rhône and southern white crus, subject to each appellation's rules.", sourceIds: ["rhone-grapes", "rhone-cotes-du-rhone", "rhone-chateauneuf", "rhone-gigondas"] },
    ],
    expressions: [
      { id: "south-cdr-blend", label: "Grenache-led Côtes du Rhône red", style: "dry red blend", principalGrapes: ["Grenache Noir", "Syrah", "Mourvèdre", "possible secondary varieties"], whyItMatters: "It is the clearest entry point for complementary grape roles without implying a fixed GSM formula.", comparisonPrompt: "Use the disclosed blend to locate Grenache's core, Syrah's firmer line and Mourvèdre's tannic depth; note when Cinsault or Carignan changes the picture.", sourceIds: ["rhone-cotes-du-rhone", "rhone-grapes", "rhone-mourvedre", "rhone-cinsault"] },
      { id: "south-cdp-red", label: "Châteauneuf-du-Pape red", style: "dry red blend", principalGrapes: ["Grenache Noir", "Syrah", "Mourvèdre", "Cinsault", "Counoise and other authorised varieties"], whyItMatters: "It demonstrates the Southern Rhône's widest blend vocabulary and major internal soil variation.", comparisonPrompt: "Compare a Grenache-dominant sandy-site wine with a Mourvèdre-heavier or more clay/stone-influenced example, controlling for producer style.", sourceIds: ["rhone-chateauneuf"] },
      { id: "south-white", label: "Southern Rhône white blend", style: "dry white blend", principalGrapes: ["Grenache Blanc", "Clairette", "Roussanne", "Marsanne", "Viognier", "Bourboulenc"], whyItMatters: "It gives white grapes their own functional comparison instead of treating them as a footnote to reds.", comparisonPrompt: "Which grapes appear to supply breadth, freshness and perfume, and how much is actually vessel, lees or malolactic handling?", sourceIds: ["rhone-grapes", "rhone-cotes-du-rhone", "rhone-chateauneuf"] },
      { id: "south-tavel", label: "Tavel rosé", style: "dry rosé blend", principalGrapes: ["Grenache Noir", "Cinsault", "Mourvèdre", "Syrah", "permitted white varieties"], whyItMatters: "It represents an ageworthy, full-bodied rosé tradition that does not fit the default pale-rosé model.", comparisonPrompt: "Compare colour, phenolic structure and food-weight with a direct-pressed pale rosé; relate the result to blend and maceration rather than colour alone.", sourceIds: ["rhone-tavel", "rhone-cinsault", "rhone-mourvedre"] },
    ],
    pitfalls: ["GSM is a teaching shorthand, not an appellation or a fixed recipe.", "Do not reduce Châteauneuf-du-Pape to galets roulés; sand, limestone and clay matter too.", "Do not omit Southern Rhône whites or Tavel's rosé-only identity.", "Authorised varieties and proportions differ by appellation and can change; validate rules before presenting legal limits in the UI."],
    sourceIds: ["rhone-grapes", "rhone-cotes-du-rhone", "rhone-chateauneuf", "rhone-gigondas", "rhone-tavel", "rhone-mourvedre", "rhone-cinsault"],
  },
] as const satisfies readonly ContextRegionProfile[];

export const contextRegionProfileById = Object.fromEntries(
  contextRegionProfiles.map((profile) => [profile.id, profile]),
) as Record<ContextRegionId, (typeof contextRegionProfiles)[number]>;

