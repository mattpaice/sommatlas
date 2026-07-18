/**
 * Geographic projection contract for the country silhouettes in public/maps.
 *
 * Both SVGs derive from Natural Earth Admin 0 Countries, 1:50m, v5.1.1
 * (public domain):
 * https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-countries-2/
 *
 * The scale and translation values come from d3.geoMercator().fitExtent(),
 * fitted with 12px padding to each SVG's exact geometry and viewBox. Keeping
 * them here means markers are projected from longitude/latitude rather than
 * hand-positioned against a particular page layout.
 */

export const countryMapMetadata = {
  FR: {
    label: "Metropolitan France",
    asset: "/maps/france.svg",
    viewBox: { width: 500, height: 500 },
    geographicBounds: {
      west: -4.7625,
      south: 41.384912,
      east: 9.556445,
      north: 51.097119,
    },
    mercator: {
      scale: 1904.6648372646996,
      translateX: 170.31822805381262,
      translateY: 1998.1111880299866,
    },
  },
  IT: {
    label: "Italy",
    asset: "/maps/italy.svg",
    viewBox: { width: 500, height: 620 },
    geographicBounds: {
      west: 6.627734,
      south: 36.687842,
      east: 18.48584,
      north: 47.082129,
    },
    mercator: {
      scale: 2299.9280870172006,
      translateX: -254.04597597626474,
      translateY: 2176.293998670335,
    },
  },
} as const;

export type MapCountry = keyof typeof countryMapMetadata;

export interface GeographicPoint {
  longitude: number;
  latitude: number;
}

export interface ProjectedCountryPoint {
  /** Local SVG user-space coordinate. */
  x: number;
  /** Local SVG user-space coordinate. */
  y: number;
  /** Local position as a percentage of the SVG viewBox. */
  xPercent: number;
  /** Local position as a percentage of the SVG viewBox. */
  yPercent: number;
  /** Whether the projected coordinate lands within the SVG viewBox. */
  insideViewBox: boolean;
}

const degreesToRadians = Math.PI / 180;

/**
 * Project a WGS84 longitude/latitude pair into a country SVG's local space.
 * This implements d3-geo's spherical Mercator raw projection and the exact
 * fitted scale/translation recorded above.
 */
export function projectCountryPoint(
  country: MapCountry,
  point: GeographicPoint,
): ProjectedCountryPoint {
  if (!Number.isFinite(point.longitude) || point.longitude < -180 || point.longitude > 180) {
    throw new RangeError("Longitude must be a finite number from -180 to 180.");
  }
  if (!Number.isFinite(point.latitude) || point.latitude < -90 || point.latitude > 90) {
    throw new RangeError("Latitude must be a finite number from -90 to 90.");
  }

  const metadata = countryMapMetadata[country];
  const longitudeRadians = point.longitude * degreesToRadians;
  // Mercator tends to infinity at the poles; this cap matches d3's safe limit.
  const safeLatitude = Math.max(-89.999999, Math.min(89.999999, point.latitude));
  const latitudeRadians = safeLatitude * degreesToRadians;
  const mercatorY = Math.log(Math.tan((Math.PI / 2 + latitudeRadians) / 2));

  const x = metadata.mercator.translateX + metadata.mercator.scale * longitudeRadians;
  const y = metadata.mercator.translateY - metadata.mercator.scale * mercatorY;
  // CSSOM serializes percentage values at limited precision. Explicitly
  // matching that precision keeps server and client style strings identical.
  const xPercent = Number(((x / metadata.viewBox.width) * 100).toFixed(4));
  const yPercent = Number(((y / metadata.viewBox.height) * 100).toFixed(4));

  return {
    x,
    y,
    xPercent,
    yPercent,
    insideViewBox:
      x >= 0 &&
      x <= metadata.viewBox.width &&
      y >= 0 &&
      y <= metadata.viewBox.height,
  };
}
