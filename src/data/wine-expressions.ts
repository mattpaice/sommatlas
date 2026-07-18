import type { RegionId } from "@/lib/schemas";

export type WineExpression = {
  id: string;
  regionId: RegionId;
  label: string;
  grape: string;
  vinification: string;
};

export const wineExpressions = [
  { id: "barolo-nebbiolo", regionId: "barolo", label: "Nebbiolo · red", grape: "Nebbiolo", vinification: "Red wine" },
  { id: "chianti-sangiovese", regionId: "chianti-classico", label: "Sangiovese-led · red", grape: "Sangiovese-led", vinification: "Red wine" },
  { id: "jura-savagnin-voile", regionId: "jura", label: "Savagnin · sous voile", grape: "Savagnin", vinification: "Sous voile" },
  { id: "jura-savagnin-ouille", regionId: "jura", label: "Savagnin · ouillé", grape: "Savagnin", vinification: "Ouillé" },
  { id: "jura-chardonnay-ouille", regionId: "jura", label: "Chardonnay · ouillé", grape: "Chardonnay", vinification: "Ouillé" },
  { id: "collio-ribolla-white", regionId: "collio", label: "Ribolla Gialla · white", grape: "Ribolla Gialla", vinification: "Direct-pressed white" },
  { id: "collio-ribolla-skin", regionId: "collio", label: "Ribolla Gialla · skin contact", grape: "Ribolla Gialla", vinification: "Extended skin contact" },
  { id: "collio-chardonnay-white", regionId: "collio", label: "Chardonnay · white", grape: "Chardonnay", vinification: "Direct-pressed white" },
] as const satisfies readonly WineExpression[];
