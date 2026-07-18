import type { MapCountry } from "@/lib/map-projection";

/**
 * Deliberately broad geological context for the national atlas view.
 * These are interpretive teaching shapes, not survey polygons or boundaries.
 * Detailed appellation geology belongs in the regional drill-down.
 *
 * Reference syntheses:
 * - BRGM, Geological map and hydrogeological overview of France:
 *   https://www.brgm.fr/fr/actualite/communique-presse/carte-hydrogeologique-france-nouvelle-edition
 * - ISPRA, Geological and geothematic cartography of Italy:
 *   https://www.isprambiente.gov.it/it/banche-dati/banche-dati-folder/suolo-e-territorio/cartografia-geologica-e-geotematica
 */

export type TerrainKind = "sedimentary-basin" | "ancient-massif" | "fold-belt";

type GeographicCoordinate = readonly [longitude: number, latitude: number];

export type MapTerrainFeature = {
  id: string;
  country: MapCountry;
  label: string;
  kind: TerrainKind;
  geometry: "area" | "ridge";
  points: readonly GeographicCoordinate[];
  labelAnchor: GeographicCoordinate;
  wineContext: string;
};

export const mapTerrainFeatures = [
  {
    id: "aquitaine-basin",
    country: "FR",
    label: "Aquitaine basin",
    kind: "sedimentary-basin",
    geometry: "area",
    points: [[-1.75, 45.7], [-0.2, 46.3], [1.6, 45.7], [2.0, 44.5], [1.25, 43.5], [-0.4, 43.25], [-1.45, 43.75]],
    labelAnchor: [0.45, 44.3],
    wineContext: "Sedimentary basin and river terraces framing Bordeaux and its gravel, clay, limestone and sand mosaics.",
  },
  {
    id: "paris-basin",
    country: "FR",
    label: "Paris basin",
    kind: "sedimentary-basin",
    geometry: "area",
    points: [[-0.4, 49.2], [1.5, 50.1], [4.7, 49.5], [5.4, 47.7], [3.8, 46.7], [1.0, 47.0]],
    labelAnchor: [2.15, 48.45],
    wineContext: "Layered sedimentary basin whose eastern and southern margins help frame Champagne, Chablis and northern Bourgogne.",
  },
  {
    id: "armorican-massif",
    country: "FR",
    label: "Armorican massif",
    kind: "ancient-massif",
    geometry: "area",
    points: [[-4.45, 48.65], [-2.2, 48.9], [-0.3, 47.9], [-0.8, 46.6], [-3.0, 46.75], [-4.6, 47.65]],
    labelAnchor: [-2.5, 47.75],
    wineContext: "Ancient basement massif; useful national context for contrasting crystalline massifs with the adjacent sedimentary basins.",
  },
  {
    id: "massif-central",
    country: "FR",
    label: "Massif Central",
    kind: "ancient-massif",
    geometry: "area",
    points: [[1.35, 46.25], [3.4, 46.65], [4.65, 45.55], [4.15, 43.75], [2.25, 43.35], [1.15, 44.75]],
    labelAnchor: [2.85, 45.1],
    wineContext: "Ancient crystalline and volcanic upland influencing altitude, drainage and the western edge of the Rhône corridor.",
  },
  {
    id: "pyrenees",
    country: "FR",
    label: "Pyrenees",
    kind: "fold-belt",
    geometry: "ridge",
    points: [[-1.6, 43.25], [-0.55, 43.05], [0.7, 42.85], [1.8, 42.65], [2.9, 42.55]],
    labelAnchor: [0.55, 43.15],
    wineContext: "Young fold mountain barrier shaping rainfall, altitude and the southern edge of the Aquitaine basin.",
  },
  {
    id: "french-alps",
    country: "FR",
    label: "Alps",
    kind: "fold-belt",
    geometry: "ridge",
    points: [[5.75, 44.35], [6.5, 44.8], [6.85, 45.45], [6.75, 46.0], [6.25, 46.45]],
    labelAnchor: [6.18, 45.25],
    wineContext: "Young fold belt controlling elevation and the eastern wall of the Rhône–Saône wine corridor.",
  },
  {
    id: "jura-arc",
    country: "FR",
    label: "Jura",
    kind: "fold-belt",
    geometry: "ridge",
    points: [[5.55, 45.95], [5.8, 46.35], [6.1, 46.75], [6.35, 47.15]],
    labelAnchor: [5.82, 46.65],
    wineContext: "Folded limestone-and-marl arc immediately east of the Jura vineyards.",
  },
  {
    id: "vosges",
    country: "FR",
    label: "Vosges",
    kind: "ancient-massif",
    geometry: "ridge",
    points: [[6.75, 47.7], [6.9, 48.15], [7.05, 48.65], [7.15, 49.0]],
    labelAnchor: [6.55, 48.35],
    wineContext: "Uplifted massif creating the rain-shadowed eastern margin important to Alsace.",
  },
  {
    id: "po-basin",
    country: "IT",
    label: "Po basin",
    kind: "sedimentary-basin",
    geometry: "area",
    points: [[7.1, 44.65], [8.0, 45.25], [10.1, 45.55], [12.6, 45.55], [13.05, 44.9], [11.4, 44.55], [9.1, 44.45]],
    labelAnchor: [10.15, 45.05],
    wineContext: "Deep sedimentary foreland basin between the Alps and Apennines; Barolo sits on its hilly southwestern margin.",
  },
  {
    id: "italian-alps",
    country: "IT",
    label: "Alps",
    kind: "fold-belt",
    geometry: "ridge",
    points: [[6.85, 44.9], [7.65, 45.65], [9.3, 46.15], [11.2, 46.55], [13.55, 46.25]],
    labelAnchor: [9.8, 46.45],
    wineContext: "Alpine arc framing Piedmont and the northern Italian vineyards, including Collio near its eastern continuation.",
  },
  {
    id: "apennines",
    country: "IT",
    label: "Apennines",
    kind: "fold-belt",
    geometry: "ridge",
    points: [[8.9, 44.45], [10.1, 44.0], [11.0, 43.3], [12.6, 42.35], [13.7, 41.5], [15.1, 40.45], [16.15, 39.35]],
    labelAnchor: [12.25, 42.15],
    wineContext: "The peninsula's mountain spine, strongly influencing Tuscan elevation, exposure, rainfall and basin structure.",
  },
] as const satisfies readonly MapTerrainFeature[];

export const terrainLegend = [
  { kind: "sedimentary-basin", label: "Sedimentary basin" },
  { kind: "ancient-massif", label: "Ancient massif" },
  { kind: "fold-belt", label: "Fold mountain belt" },
] as const satisfies readonly { kind: TerrainKind; label: string }[];
