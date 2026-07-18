import { createAgentUIStreamResponse } from "ai";
import { z } from "zod";

import {
  createSynthesisAgent,
  type SynthesisMode,
} from "@/lib/ai/agent";

export const runtime = "nodejs";
export const maxDuration = 60;

const requestSchema = z
  .object({
    messages: z.array(z.unknown()).min(1).max(12),
  });

const modeSchema = z.enum(["deep", "quick"]);

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ mode: string }> },
) {
  const { mode: rawMode } = await context.params;
  const parsedMode = modeSchema.safeParse(rawMode);
  if (!parsedMode.success) {
    return badRequest("Unknown synthesis mode. Use deep or quick.");
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const parsedBody = requestSchema.safeParse(payload);
  if (!parsedBody.success) {
    return badRequest("Request body must include 1 to 12 UI messages.");
  }

  const mode: SynthesisMode = parsedMode.data;
  return createAgentUIStreamResponse({
    agent: createSynthesisAgent(mode),
    uiMessages: parsedBody.data.messages,
    sendSources: true,
    timeout: { totalMs: 55_000 },
  });
}
