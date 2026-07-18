import { z } from "zod";

export const RegionIdSchema = z.enum([
  "barolo",
  "chianti-classico",
  "jura",
  "collio",
]);

export const ClaimTypeSchema = z.enum([
  "legal",
  "measured",
  "published_association",
  "common_practice",
  "historical_practice",
  "editorial_interpretation",
  "geology",
]);

export const ConfidenceSchema = z.enum(["high", "medium", "low"]);
export const CausalStrengthSchema = z.enum([
  "causal",
  "associated",
  "contextual",
  "not_applicable",
]);

export const SourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.url(),
  sourceType: z.enum([
    "official_specification",
    "official_institutional",
    "primary_research",
    "peer_reviewed_review",
  ]),
  publishedAt: z.string().nullable(),
  effectiveAt: z.string().nullable(),
  retrievedAt: z.string(),
  language: z.string().min(2),
});

export const ClaimSchema = z.object({
  id: z.string().min(1),
  subjectId: RegionIdSchema,
  title: z.string().min(1),
  statement: z.string().min(1),
  learnerNote: z.string().min(1),
  claimType: ClaimTypeSchema,
  status: z.enum(["verified", "provisional", "hidden"]),
  confidence: ConfidenceSchema,
  causalStrength: CausalStrengthSchema,
  sourceIds: z.array(z.string()).min(1),
  evidence: z.object({
    locator: z.string().min(1),
    originalLanguage: z.string().nullable(),
    caveat: z.string().nullable(),
  }),
  lastVerifiedAt: z.string(),
});

export const MetricRangeSchema = z.object({
  id: z.enum([
    "colour",
    "hue",
    "acidity",
    "tannin",
    "body",
    "aromatic-intensity",
  ]),
  label: z.string(),
  min: z.number().min(1).max(5),
  max: z.number().min(1).max(5),
  descriptor: z.string(),
});

export const ArchetypeSchema = z.object({
  name: z.string(),
  subtitle: z.string(),
  metrics: z.array(MetricRangeSchema),
  cues: z.array(z.string()).min(2),
  assumptions: z.array(z.string()).min(1),
});

export const RegionSchema = z.object({
  id: RegionIdSchema,
  name: z.string(),
  country: z.enum(["FR", "IT"]),
  entityType: z.enum(["appellation", "wine_region"]),
  location: z.string(),
  eyebrow: z.string(),
  summary: z.string(),
  grapes: z.array(z.string()),
  map: z.object({
    countryX: z.number(),
    countryY: z.number(),
  }),
  layerHighlights: z.object({
    geology: z.string(),
    chemistry: z.string(),
    phenolics: z.string(),
    palate: z.string(),
    rules: z.string(),
  }),
  claimIds: z.array(z.string()),
  archetype: ArchetypeSchema,
});

export const ChallengeSchema = z.object({
  id: z.string(),
  regionId: RegionIdSchema,
  question: z.string(),
  answer: z.boolean(),
  answerLabel: z.string(),
  explanation: z.string(),
  claimIds: z.array(z.string()).min(1),
});

export const SourcesSchema = z.array(SourceSchema);
export const ClaimsSchema = z.array(ClaimSchema);
export const RegionsSchema = z.array(RegionSchema);
export const ChallengesSchema = z.array(ChallengeSchema);

export type RegionId = z.infer<typeof RegionIdSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type Region = z.infer<typeof RegionSchema>;
export type Challenge = z.infer<typeof ChallengeSchema>;
