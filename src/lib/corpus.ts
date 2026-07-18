import { challenges } from "@/data/challenges";
import { claims } from "@/data/claims";
import { regions } from "@/data/regions";
import { sources } from "@/data/sources";
import {
  ChallengesSchema,
  ClaimsSchema,
  RegionsSchema,
  SourcesSchema,
  type Claim,
  type RegionId,
  type Source,
} from "@/lib/schemas";

export const corpus = {
  regions: RegionsSchema.parse(regions),
  claims: ClaimsSchema.parse(claims),
  sources: SourcesSchema.parse(sources),
  challenges: ChallengesSchema.parse(challenges),
};

export function getRegion(regionId: RegionId) {
  return corpus.regions.find((region) => region.id === regionId);
}

export function getClaimsForRegion(regionId: RegionId) {
  return corpus.claims.filter(
    (claim) => claim.subjectId === regionId && claim.status === "verified",
  );
}

export function getSourcesForClaims(regionClaims: Claim[]) {
  const sourceIds = new Set(regionClaims.flatMap((claim) => claim.sourceIds));
  return corpus.sources.filter((source) => sourceIds.has(source.id));
}

export function resolveSources(sourceIds: string[]): Source[] {
  return corpus.sources.filter((source) => sourceIds.includes(source.id));
}
