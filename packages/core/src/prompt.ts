import type Anthropic from "@anthropic-ai/sdk";

/** Env var the app reads to pick the vision model. See .env.example. */
const MODEL_ENV_VAR = "VISION_MODEL";
const DEFAULT_MODEL = "claude-sonnet-5";

/** Resolve which Claude model to call, defaulting to a balanced choice. */
export function resolveModel(): string {
  return process.env[MODEL_ENV_VAR]?.trim() || DEFAULT_MODEL;
}

export const SYSTEM_PROMPT = `You are the identification engine inside WildSnap, a playful nature app. A user just photographed something outdoors — a tree, plant, flower, bird, or a landscape feature like a waterfall, valley, rock formation, or stream — and wants to know what it is.

Identify the single most prominent natural subject in the photo, then report it with the report_identification tool. Write like a warm, knowledgeable field-guide author — curious and genuinely interesting, never clinical or dry.

Rules:
- If you can identify the subject with reasonable confidence, set identified=true, choose the best-fitting category, and set confidence to reflect how sure you actually are (high/medium/low). Prefer a broader but still useful identification (e.g. "a species of oak") with lower confidence over guessing a specific species you're not sure of.
- description: 1–3 warm sentences a curious person would enjoy reading — not a dry definition.
- funFacts: exactly 2–4 short, genuinely interesting facts. Avoid generic filler ("it needs sunlight and water").
- scientificName: the binomial/scientific name when one applies (plants, fungi, animals). Use an empty string when none applies (e.g. a landscape feature like a waterfall or rock formation).
- If the photo isn't a natural subject at all, is too blurry/distant to tell, or you truly can't identify it: set identified=false, confidence="low", funFacts=[], name to something short and friendly like "Not sure yet", and description to a kind, specific suggestion for a better photo (closer, more light, a different angle).
- Never leave a field blank — always fill every field in the tool call.`;

export const USER_PROMPT =
  "Identify the natural subject in this photo and report it using the report_identification tool.";

const CATEGORY_VALUES = ["tree", "plant", "flower", "bird", "landscape", "other"];

const CONFIDENCE_VALUES = ["high", "medium", "low"];

/**
 * Tool schema Claude must fill in. Using tool-use (rather than asking the
 * model to emit prose JSON) makes the structured response reliable — the SDK
 * hands back already-parsed JSON in `input`, which parse.ts still validates.
 */
export const IDENTIFY_TOOL: Anthropic.Tool = {
  name: "report_identification",
  description:
    "Report the identification of the natural subject in the photo, in WildSnap's structured format.",
  input_schema: {
    type: "object",
    properties: {
      identified: {
        type: "boolean",
        description: "Whether the subject could be identified at all.",
      },
      name: {
        type: "string",
        description: "Common name, e.g. 'Coast Redwood'. Never empty.",
      },
      scientificName: {
        type: "string",
        description:
          "Scientific/binomial name, or an empty string when not applicable.",
      },
      category: {
        type: "string",
        enum: CATEGORY_VALUES,
        description: "Best-fitting category for the subject.",
      },
      description: {
        type: "string",
        description: "1-3 warm, engaging sentences about the subject.",
      },
      funFacts: {
        type: "array",
        items: { type: "string" },
        description:
          "2-4 genuinely interesting facts. Empty array only when identified=false.",
      },
      confidence: {
        type: "string",
        enum: CONFIDENCE_VALUES,
        description: "How sure this identification is.",
      },
    },
    required: [
      "identified",
      "name",
      "scientificName",
      "category",
      "description",
      "funFacts",
      "confidence",
    ],
  },
};
