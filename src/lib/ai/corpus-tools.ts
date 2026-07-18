import { tool } from "ai";
import { z } from "zod";

import {
  corpus,
  getClaimsForRegion,
  getRegion,
  getSourcesForClaims,
} from "@/lib/corpus";
import { RegionIdSchema, type Claim, type RegionId } from "@/lib/schemas";

const regionInputSchema = z
  .object({
    regionId: RegionIdSchema.describe("The curated region to investigate."),
  })
  .strict();

type EvidenceClaim = Pick<
  Claim,
  | "id"
  | "title"
  | "statement"
  | "learnerNote"
  | "claimType"
  | "confidence"
  | "causalStrength"
  | "evidence"
> & {
  sources: Array<{
    id: string;
    title: string;
    publisher: string;
    url: string;
    sourceType: string;
  }>;
};

function evidenceFor(regionId: RegionId, predicate: (claim: Claim) => boolean) {
  const claims = getClaimsForRegion(regionId).filter(predicate);
  const sourcesById = new Map(
    getSourcesForClaims(claims).map((source) => [source.id, source]),
  );

  return claims.map<EvidenceClaim>((claim) => ({
    id: claim.id,
    title: claim.title,
    statement: claim.statement,
    learnerNote: claim.learnerNote,
    claimType: claim.claimType,
    confidence: claim.confidence,
    causalStrength: claim.causalStrength,
    evidence: claim.evidence,
    sources: claim.sourceIds.flatMap((sourceId) => {
      const source = sourcesById.get(sourceId);
      return source
        ? [
            {
              id: source.id,
              title: source.title,
              publisher: source.publisher,
              url: source.url,
              sourceType: source.sourceType,
            },
          ]
        : [];
    }),
  }));
}

function regionSummary(regionId: RegionId) {
  const region = getRegion(regionId);
  if (!region) {
    throw new Error(`Unknown curated region: ${regionId}`);
  }

  return {
    id: region.id,
    name: region.name,
    country: region.country,
    location: region.location,
    grapes: region.grapes,
    summary: region.summary,
  };
}

export const corpusTools = {
  get_appellation_rules: tool({
    description:
      "Retrieve verified legal/appellation rules. Use for permitted grapes, named areas, yields, ageing, labelling, and designation eligibility.",
    inputSchema: regionInputSchema,
    strict: true,
    execute: async ({ regionId }) => ({
      kind: "appellation_rules" as const,
      region: regionSummary(regionId),
      evidence: evidenceFor(regionId, (claim) => claim.claimType === "legal"),
    }),
  }),

  get_place_profile: tool({
    description:
      "Retrieve verified place evidence: geology, site, climate, and geographic context. Use for terroir/place questions only.",
    inputSchema: regionInputSchema,
    strict: true,
    execute: async ({ regionId }) => ({
      kind: "place_profile" as const,
      region: regionSummary(regionId),
      evidence: evidenceFor(regionId, (claim) => claim.claimType === "geology"),
    }),
  }),

  get_chemistry_profile: tool({
    description:
      "Retrieve verified composition, aroma chemistry, pigment, phenolic, and wine-evolution evidence. Do not infer facts beyond these records.",
    inputSchema: regionInputSchema,
    strict: true,
    execute: async ({ regionId }) => ({
      kind: "chemistry_profile" as const,
      region: regionSummary(regionId),
      evidence: evidenceFor(
        regionId,
        (claim) =>
          claim.claimType === "measured" ||
          claim.claimType === "published_association",
      ),
    }),
  }),

  get_training_profile: tool({
    description:
      "Retrieve the curated sensory archetype and verified training context. Use for blind-tasting, structure, or team-training questions.",
    inputSchema: regionInputSchema,
    strict: true,
    execute: async ({ regionId }) => {
      const region = getRegion(regionId);
      if (!region) {
        throw new Error(`Unknown curated region: ${regionId}`);
      }

      return {
        kind: "training_profile" as const,
        region: {
          ...regionSummary(regionId),
          archetype: region.archetype,
          layerHighlights: region.layerHighlights,
        },
        evidence: evidenceFor(
          regionId,
          (claim) =>
            claim.claimType === "common_practice" ||
            claim.claimType === "historical_practice" ||
            claim.claimType === "editorial_interpretation",
        ),
      };
    },
  }),
};

export const curatedRegionIds = corpus.regions.map((region) => region.id);
