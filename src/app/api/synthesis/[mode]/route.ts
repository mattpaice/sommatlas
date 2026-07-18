import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  validateUIMessages,
  type UIMessage,
} from "ai";
import { z } from "zod";

import {
  createSynthesisAgent,
  type SynthesisMode,
  type TutorContext,
} from "@/lib/ai/agent";
import { buildDeterministicTutorAnswer } from "@/lib/ai/deterministic-tutor";

export const runtime = "nodejs";
export const maxDuration = 60;

const contextSchema = z.object({
  regionId: z.string().min(1).max(80),
  regionName: z.string().min(1).max(120),
  expressionId: z.string().min(1).max(100).optional(),
  expressionLabel: z.string().min(1).max(160).optional(),
  expressionGrape: z.string().min(1).max(120).optional(),
  expressionVinification: z.string().min(1).max(160).optional(),
  activeTab: z.enum(["chemistry", "structure", "place", "rules", "producers"]),
});

const requestSchema = z.object({
  messages: z.array(z.unknown()).min(1).max(24),
  context: contextSchema,
  fallbackOnly: z.boolean().optional().default(false),
});

const modeSchema = z.enum(["deep", "quick"]);

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

function safeLiveError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/model|gateway|quota|credit|tier|auth|token|provider|rate/i.test(message)) {
    return "The live tutor model is unavailable for this project, so SommAtlas used its cited local corpus instead.";
  }
  return "The live tutor could not complete this answer, so SommAtlas used its cited local corpus instead.";
}

function answerResponse({
  text,
  sources,
  delivery,
  fallbackReason,
}: {
  text: string;
  sources: Array<{ id: string; title: string; url: string }>;
  delivery: "live" | "local-fallback";
  fallbackReason?: string;
}) {
  const metadata = { delivery, fallbackReason };
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const textId = crypto.randomUUID();
      writer.write({ type: "start", messageMetadata: metadata });
      writer.write({ type: "text-start", id: textId });
      writer.write({ type: "text-delta", id: textId, delta: text });
      writer.write({ type: "text-end", id: textId });
      for (const source of sources) {
        writer.write({
          type: "source-url",
          sourceId: source.id,
          title: source.title,
          url: source.url,
        });
      }
      writer.write({ type: "finish", finishReason: "stop", messageMetadata: metadata });
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ mode: string }> },
) {
  const { mode: rawMode } = await context.params;
  const parsedMode = modeSchema.safeParse(rawMode);
  if (!parsedMode.success) return badRequest("Unknown synthesis mode. Use deep or quick.");

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const parsedBody = requestSchema.safeParse(payload);
  if (!parsedBody.success) {
    return badRequest("Request must include conversation messages and the current atlas context.");
  }

  const mode: SynthesisMode = parsedMode.data;
  const tutorContext: TutorContext = parsedBody.data.context;
  const agent = createSynthesisAgent(mode, tutorContext);
  const hasLiveCredentials = Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );

  let uiMessages: UIMessage[];
  try {
    uiMessages = await validateUIMessages({ messages: parsedBody.data.messages });
  } catch {
    return badRequest("Conversation messages are not valid UI messages.");
  }

  if (!parsedBody.data.fallbackOnly && hasLiveCredentials) {
    try {
      const modelMessages = await convertToModelMessages(uiMessages);
      const result = await agent.generate({
        messages: modelMessages,
        abortSignal: request.signal,
        timeout: { totalMs: 45_000 },
      });
      if (result.text.trim()) {
        return answerResponse({ text: result.text, sources: [], delivery: "live" });
      }
    } catch (error) {
      const fallback = buildDeterministicTutorAnswer(uiMessages, tutorContext, mode);
      return answerResponse({
        ...fallback,
        delivery: "local-fallback",
        fallbackReason: safeLiveError(error),
      });
    }
  }

  const fallback = buildDeterministicTutorAnswer(uiMessages, tutorContext, mode);
  return answerResponse({
    ...fallback,
    delivery: "local-fallback",
    fallbackReason: parsedBody.data.fallbackOnly
      ? "Answered directly from the deterministic local corpus."
      : !hasLiveCredentials
        ? "No live AI credentials are available, so SommAtlas answered from its deterministic cited corpus."
      : "The live tutor returned no answer, so SommAtlas used its cited local corpus instead.",
  });
}
