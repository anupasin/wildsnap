import { z } from "zod";
import type { Identification } from "./types";
import { unidentified } from "./mock";

const RawIdentificationSchema = z.object({
  // The model occasionally omits this when it's confident (the field can
  // feel redundant to it once name/description are filled in) — default to
  // true rather than discarding an otherwise-valid identification.
  identified: z.boolean().default(true),
  name: z.string().min(1),
  // "" means "not applicable" — mapped to null below.
  scientificName: z.string(),
  category: z.enum(["tree", "plant", "flower", "bird", "landscape", "other"]),
  description: z.string().min(1),
  funFacts: z.array(z.string().min(1)).max(8),
  confidence: z.enum(["high", "medium", "low"]),
});

/**
 * Validate the model's tool-call input and normalize it into an
 * {@link Identification}. Malformed or missing fields degrade gracefully to
 * the friendly "couldn't identify" state rather than throwing.
 */
export function parseIdentification(raw: unknown): Identification {
  const result = RawIdentificationSchema.safeParse(raw);
  if (!result.success) {
    console.error(
      "[parseIdentification] model returned invalid shape:",
      result.error.flatten(),
    );
    return unidentified();
  }

  const data = result.data;
  const scientificName = data.scientificName.trim();

  return {
    identified: data.identified,
    name: data.name.trim(),
    scientificName: scientificName === "" ? null : scientificName,
    category: data.category,
    description: data.description.trim(),
    // Enforce the contract regardless of what the model returned: no facts
    // when unidentified, at most 4 when identified.
    funFacts: data.identified ? data.funFacts.slice(0, 4) : [],
    confidence: data.confidence,
  };
}
