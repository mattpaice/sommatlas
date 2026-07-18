/**
 * Non-interactive training anchors for the shared 0–100 atlas canvas.
 *
 * These are representative points, not appellation polygons. Longitude and
 * latitude identify the place used to calibrate each point. The UI projects
 * them through `projectCountryPoint`, just like the hero regions.
 *
 * Country outlines: Natural Earth Admin 0 Countries, 1:50m, v5.1.1
 * (public domain). `src/lib/map-projection.ts` reproduces the exact Mercator
 * transform used by public/maps/france.svg.
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
}

export const mapContextPoints = [
  {
    id: "cote-de-nuits",
    label: "Côte de Nuits",
    group: "burgundy",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.95, latitude: 47.15, locality: "Nuits-Saint-Georges" },
  },
  {
    id: "cote-de-beaune",
    label: "Côte de Beaune",
    group: "burgundy",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.78, latitude: 46.98, locality: "Beaune" },
  },
  {
    id: "beaujolais",
    label: "Beaujolais",
    group: "burgundy",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.7, latitude: 46.15, locality: "Beaujeu" },
  },
  {
    id: "bordeaux-left-bank",
    label: "Bordeaux · Left Bank",
    group: "bordeaux",
    country: "FR",
    status: "context-only",
    anchor: { longitude: -0.75, latitude: 45.2, locality: "Médoc" },
  },
  {
    id: "bordeaux-right-bank",
    label: "Bordeaux · Right Bank",
    group: "bordeaux",
    country: "FR",
    status: "context-only",
    anchor: { longitude: -0.15, latitude: 44.9, locality: "Saint-Émilion" },
  },
  {
    id: "northern-rhone",
    label: "Northern Rhône",
    group: "rhone",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.84, latitude: 45.07, locality: "Tain-l'Hermitage" },
  },
  {
    id: "southern-rhone",
    label: "Southern Rhône",
    group: "rhone",
    country: "FR",
    status: "context-only",
    anchor: { longitude: 4.83, latitude: 44.06, locality: "Châteauneuf-du-Pape" },
  },
] as const satisfies readonly MapContextPoint[];
