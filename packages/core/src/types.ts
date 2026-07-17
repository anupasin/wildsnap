/**
 * Shared, platform-agnostic domain types for WildSnap.
 * These are the contract every part of the app (web + mobile) depends on.
 */

/** Broad kind of subject the camera was pointed at. */
export type Category =
  | "tree"
  | "plant"
  | "flower"
  | "bird"
  | "landscape"
  | "other";

/** How sure the model is about the identification. */
export type Confidence = "high" | "medium" | "low";

/**
 * The result of identifying a single photo. This is exactly what
 * `identify(imageBytes)` resolves to. When the subject can't be recognised,
 * `identified` is `false` and the app shows a friendly retry state.
 */
export interface Identification {
  /** false => "couldn't identify this — try another angle" state. */
  identified: boolean;
  /** Common name, e.g. "Coast Redwood". Present even on failure (a friendly title). */
  name: string;
  /** Scientific name, or null when not applicable (e.g. a waterfall). */
  scientificName: string | null;
  category: Category;
  /** A short, warm paragraph shown up front on the card. */
  description: string;
  /** 2–4 genuinely interesting facts — the "richer than Lens" payload. */
  funFacts: string[];
  confidence: Confidence;
}

/**
 * A saved entry in the user's local field guide: an {@link Identification}
 * plus the captured photo and some metadata. Built at save time.
 */
export interface FieldGuideEntry {
  /** Locally-generated unique id. */
  id: string;
  /** Epoch milliseconds when it was collected. */
  createdAt: number;
  /** The captured photo as a data URL (persisted locally). */
  image: string;
  identification: Identification;
}
