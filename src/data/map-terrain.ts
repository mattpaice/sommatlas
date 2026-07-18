import type { MapCountry } from "@/lib/map-projection";

/**
 * Broad, decorative mountain cues for the national atlas view.
 * Coordinates are representative points along each range, not boundaries.
 */

type GeographicCoordinate = readonly [longitude: number, latitude: number];

export type MapMountainRange = {
  id: string;
  country: MapCountry;
  scale: number;
  points: readonly GeographicCoordinate[];
};

export const mapMountainRanges = [
  {
    id: "pyrenees",
    country: "FR",
    scale: 0.9,
    points: [[-1.45, 43.2], [-0.45, 43.03], [0.55, 42.84], [1.5, 42.68], [2.45, 42.57]],
  },
  {
    id: "french-alps",
    country: "FR",
    scale: 1,
    points: [[5.8, 44.35], [6.35, 44.82], [6.7, 45.35], [6.65, 45.86], [6.3, 46.28]],
  },
  {
    id: "jura",
    country: "FR",
    scale: 0.68,
    points: [[5.65, 46.05], [5.85, 46.42], [6.08, 46.8], [6.3, 47.12]],
  },
  {
    id: "massif-central",
    country: "FR",
    scale: 0.72,
    points: [[2.25, 45.75], [3.05, 45.65], [3.55, 45.1], [3.15, 44.55], [2.35, 44.6]],
  },
  {
    id: "vosges",
    country: "FR",
    scale: 0.6,
    points: [[6.82, 47.85], [6.95, 48.25], [7.05, 48.65]],
  },
  {
    id: "italian-alps",
    country: "IT",
    scale: 1,
    points: [[6.95, 44.95], [7.65, 45.55], [8.65, 45.95], [9.75, 46.22], [10.9, 46.4], [12.1, 46.42], [13.25, 46.18]],
  },
  {
    id: "apennines",
    country: "IT",
    scale: 0.78,
    points: [[8.85, 44.45], [9.75, 44.05], [10.55, 43.62], [11.35, 43.05], [12.25, 42.45], [13.15, 41.85], [14.05, 41.2], [14.95, 40.5], [15.8, 39.7]],
  },
] as const satisfies readonly MapMountainRange[];
