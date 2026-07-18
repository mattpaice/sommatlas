import type { UIMessage } from "ai";

import {
  contextRegionProfileById,
  contextRegionSources,
  type ContextRegionId,
} from "@/data/context-region-profiles";
import {
  getClaimsForRegion,
  getRegion,
  getSourcesForClaims,
} from "@/lib/corpus";
import type { Claim, RegionId, Source } from "@/lib/schemas";
import type { SynthesisMode, TutorContext } from "@/lib/ai/agent";

export type TutorSource = { id: string; title: string; url: string };

export type DeterministicTutorAnswer = {
  text: string;
  sources: TutorSource[];
};

const contextRegionIds = new Set<ContextRegionId>([
  "cote-de-nuits",
  "cote-de-beaune",
  "beaujolais",
  "bordeaux-left-bank",
  "bordeaux-right-bank",
  "northern-rhone",
  "southern-rhone",
]);

function latestQuestion(messages: UIMessage[]) {
  const message = [...messages].reverse().find((item) => item.role === "user");
  return message?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim() ?? "Give me a useful overview.";
}

function markdownSource(source: TutorSource) {
  return `[${source.title}](${source.url})`;
}

function inferIntent(question: string, tab: TutorContext["activeTab"]) {
  const normalized = question.toLowerCase();
  if (/compar|versus|\bvs\b|grape|blend/.test(normalized)) return "grapes";
  if (/geolog|soil|rock|place|terroir|mineral/.test(normalized)) return "place";
  if (/taste|glass|palate|aroma|smell|blind|structure/.test(normalized)) return "taste";
  if (/rule|legal|permit|minimum|maximum|appellation/.test(normalized)) return "rules";
  if (tab === "place") return "place";
  if (tab === "rules") return "rules";
  if (tab === "structure") return "taste";
  return "overview";
}

function pickClaims(claims: Claim[], intent: ReturnType<typeof inferIntent>) {
  const predicate = (claim: Claim) => {
    if (intent === "place") return claim.claimType === "geology";
    if (intent === "rules") return claim.claimType === "legal";
    if (intent === "taste") {
      return ["measured", "published_association", "common_practice", "historical_practice", "editorial_interpretation"].includes(claim.claimType);
    }
    if (intent === "grapes") {
      return claim.claimType !== "geology";
    }
    return true;
  };
  const matched = claims.filter(predicate);
  return (matched.length > 0 ? matched : claims).slice(0, 3);
}

function coreRegionAnswer(
  context: TutorContext,
  question: string,
  mode: SynthesisMode,
): DeterministicTutorAnswer {
  const region = getRegion(context.regionId as RegionId);
  if (!region) return { text: "The selected atlas region is not available in the local corpus.", sources: [] };
  const intent = inferIntent(question, context.activeTab);
  const selectedClaims = pickClaims(getClaimsForRegion(region.id), intent);
  const claimSources = getSourcesForClaims(selectedClaims);
  const sourcesById = new Map(claimSources.map((source) => [source.id, source]));
  const sources = selectedClaims.flatMap((claim) =>
    claim.sourceIds.flatMap((sourceId) => {
      const source = sourcesById.get(sourceId);
      return source ? [{ id: source.id, title: source.title, url: source.url }] : [];
    }),
  ).filter((source, index, all) => all.findIndex((item) => item.id === source.id) === index);

  const expression = context.expressionLabel
    ? `You selected **${context.expressionLabel}**${context.expressionVinification ? ` (${context.expressionVinification})` : ""}. `
    : "";
  const lead = intent === "place"
    ? `Use geology as an indirect chain—not literal rock flavour: formation and soil properties shape water and root conditions, which interact with farming and cellar choices.`
    : intent === "taste"
      ? `Taste structure before chasing a single aroma: calibrate acidity, tannin, body and aromatic intensity, then test whether the wine fits the regional hypothesis.`
      : intent === "rules"
        ? `Keep legal requirements separate from common practice and stylistic convention.`
        : intent === "grapes"
          ? `Start with the grape frame: **${region.grapes.join(", ")}**. Then separate variety-driven structure from place, vintage and vinification.`
          : region.summary;

  const evidence = selectedClaims.map((claim) => {
    const source = claim.sourceIds.map((id) => sourcesById.get(id)).find(Boolean) as Source | undefined;
    return `- **${claim.title}:** ${claim.learnerNote} ${source ? markdownSource({ id: source.id, title: source.title, url: source.url }) : ""}`;
  }).join("\n");
  const nextMove = context.activeTab === "producers"
    ? "The local corpus does not treat producer reputation as proof; use a producer example only after checking the appellation, vintage and élevage."
    : `Your active **${context.activeTab}** tab is the best lens for the next comparison. Ask what observation would falsify the easy regional stereotype.`;

  return {
    text: `### ${region.name}: a bounded answer\n\n${expression}${lead}\n\n${evidence}\n\n**In the glass:** ${nextMove}${mode === "deep" ? " Keep grape chemistry, site, legal category and winemaking as separate layers before combining them." : ""}`,
    sources,
  };
}

function contextRegionAnswer(
  context: TutorContext,
  question: string,
  mode: SynthesisMode,
): DeterministicTutorAnswer {
  const profile = contextRegionProfileById[context.regionId as ContextRegionId];
  const intent = inferIntent(question, context.activeTab);
  const sourceIds = new Set(profile.sourceIds);
  const sources = contextRegionSources
    .filter((source) => sourceIds.has(source.id))
    .slice(0, mode === "deep" ? 5 : 3)
    .map(({ id, title, url }) => ({ id, title, url }));
  const citation = sources[0] ? markdownSource(sources[0]) : "the local regional profile";

  let focus: string;
  if (intent === "place") {
    focus = `**Place:** ${profile.geography.soils} ${profile.geography.climate}`;
  } else if (intent === "taste") {
    focus = `**Tasting drill:** ${profile.expressions[0]?.comparisonPrompt ?? profile.teachingFocus}`;
  } else if (intent === "rules") {
    focus = `**Appellation frame:** ${profile.appellationFamilies.slice(0, 3).map((family) => `${family.name} (${family.category})`).join("; ")}. Rules vary by appellation, so the tutor will not turn a regional pattern into a universal legal limit.`;
  } else {
    const grapes = profile.grapes.slice(0, mode === "deep" ? 4 : 3);
    focus = `**Grape comparison:**\n${grapes.map((grape) => `- **${grape.name}:** ${grape.structuralRole} ${grape.aromaticRole}`).join("\n")}`;
  }

  const pitfalls = profile.pitfalls.slice(0, mode === "deep" ? 3 : 2).map((pitfall) => `- ${pitfall}`).join("\n");
  return {
    text: `### ${profile.name}: contextual tutor\n\n${profile.systemSummary} ${citation}\n\n${focus}\n\n**Keep yourself honest**\n${pitfalls}\n\n**Next tasting move:** ${profile.teachingFocus}`,
    sources,
  };
}

export function buildDeterministicTutorAnswer(
  messages: UIMessage[],
  context: TutorContext,
  mode: SynthesisMode,
) {
  const question = latestQuestion(messages);
  return contextRegionIds.has(context.regionId as ContextRegionId)
    ? contextRegionAnswer(context, question, mode)
    : coreRegionAnswer(context, question, mode);
}
