/**
 * Non-interactive training anchors for the shared 0–100 atlas canvas.
 *
 * These are representative points, not appellation polygons. Longitude and
 * latitude identify the place used to calibrate each point; `map` is the same
 * whole-atlas coordinate system used by Region.map.
 *
 * Country outlines: Natural Earth Admin 0 Countries, 1:50m, v5.1.1
 * (public domain). The France points were projected with the same Mercator
 * transform as public/maps/france.svg and then translated into the UI canvas.
 */

export type MapContextGroup = "burgundy" | "bordeaux" | "rhone";

export interface MapContextPoint {
  id:
    | "cote-de-nuits"
    | "cote-de-beaune"
    | "beaujolais"
    | "bordeaux-left-bank"
    | "bordeaux-right-bank"
    | "northern-rhone"
    | "southern-rhone";
  label: string;
  group: MapContextGroup;
  country: "FR";
  status: "context-only";
  /** Representative geographic anchor; this is not an appellation centroid. */
  anchor: {
    longitude: number;
    latitude: number;
    locality: string;
  };
  /** Position in the existing whole-atlas 0–100 coordinate system. */
  map: {
    countryX: number;
    countryY: number;
  };
}

export const mapContextPoints = [
  {
    id: "cote-de-nuits",
    label: "Côte de Nuits",
    group: "burgundy",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.95, latitude: 47.15, locality: "Nuits-Saint-Georges" },
    map: { countryX: 36.5, countryY: 39.9 },
  },
  {
    id: "cote-de-beaune",
    label: "Côte de Beaune",
    group: "burgundy",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.78, latitude: 46.98, locality: "Beaune" },
    map: { countryX: 36, countryY: 41.2 },
  },
  {
    id: "beaujolais",
    label: "Beaujolais",
    group: "burgundy",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.7, latitude: 46.15, locality: "Beaujeu" },
    map: { countryX: 35.7, countryY: 47.2 },
  },
  {
    id: "bordeaux-left-bank",
    label: "Bordeaux · Left Bank",
    group: "bordeaux",
    country: "FR",
    status: "context-only",
    anchor: { longitude: -0.75, latitude: 45.2, locality: "Médoc" },
    map: { countryX: 19.8, countryY: 54 },
  },
  {
    id: "bordeaux-right-bank",
    label: "Bordeaux · Right Bank",
    group: "bordeaux",
    country: "FR",
    status: "context-only",
    anchor: { longitude: -0.15, latitude: 44.9, locality: "Saint-Émilion" },
    map: { countryX: 21.5, countryY: 56.1 },
  },
  {
    id: "northern-rhone",
    label: "Northern Rhône",
    group: "rhone",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.84, latitude: 45.07, locality: "Tain-l'Hermitage" },
    map: { countryX: 36.1, countryY: 54.9 },
  },
  {
    id: "southern-rhone",
    label: "Southern Rhône",
    group: "rhone",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.83, latitude: 44.06, locality: "Châteauneuf-du-Pape" },
    map: { countryX: 36.1, countryY: 62 },
  },
] as const satisfies readonly MapContextPoint[];
