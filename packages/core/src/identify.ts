import Anthropic from "@anthropic-ai/sdk";
import { IDENTIFY_TOOL, SYSTEM_PROMPT, USER_PROMPT, resolveModel } from "./prompt";
import { parseIdentification } from "./parse";
import { unidentified } from "./mock";
import type { Identification } from "./types";

/**
 * Image payload passed to {@link identify}. Kept provider-agnostic: raw base64
 * plus its media type, which is what every vision API ultimately wants.
 */
export interface ImageInput {
  /** base64-encoded image bytes, WITHOUT any `data:...;base64,` prefix. */
  base64: string;
  /** MIME type, e.g. "image/jpeg" or "image/png". */
  mediaType: string;
}

/** Split a `data:` URL into the pieces {@link identify} needs. */
export function imageInputFromDataUrl(dataUrl: string): ImageInput {
  const match = /^data:([^;]+);base64,(.*)$/s.exec(dataUrl);
  if (!match) {
    throw new Error("Expected a base64 data URL (data:<mime>;base64,<data>).");
  }
  return { mediaType: match[1]!, base64: match[2]! };
}

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;
type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

function assertSupportedImageType(
  mediaType: string,
): asserts mediaType is SupportedImageType {
  if (!(SUPPORTED_IMAGE_TYPES as readonly string[]).includes(mediaType)) {
    throw new Error(
      `Unsupported image type "${mediaType}". Use JPEG, PNG, GIF, or WebP.`,
    );
  }
}

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to apps/web/.env.local (see .env.example).",
    );
  }
  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}

/**
 * Identify the subject of a photo using Claude's vision.
 *
 * This is the ONE seam the rest of the app calls. Swapping the vision
 * provider later means editing only this file — the signature stays the same.
 *
 * Never throws for "the model couldn't tell": malformed tool output or a
 * missing tool_use block both degrade to the friendly `unidentified()` card.
 * Network/auth errors (bad key, rate limit, etc.) do throw, so callers (the
 * web API route) can log them and still show a friendly fallback.
 */
export async function identify(image: ImageInput): Promise<Identification> {
  assertSupportedImageType(image.mediaType);

  const response = await getClient().messages.create({
    model: resolveModel(),
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [IDENTIFY_TOOL],
    tool_choice: { type: "tool", name: IDENTIFY_TOOL.name },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: image.mediaType,
              data: image.base64,
            },
          },
          { type: "text", text: USER_PROMPT },
        ],
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUse) {
    console.error(
      "[identify] no tool_use block in response (stop_reason:",
      response.stop_reason,
      ")",
    );
    return unidentified();
  }

  return parseIdentification(toolUse.input);
}
