import type { FieldGuideEntry, Identification } from "./types";

/**
 * One storage interface the whole app depends on. Web implements it over
 * `localStorage`, mobile over `AsyncStorage`. Callers never care which.
 */
export interface FieldGuideStore {
  /** All saved entries, newest first. */
  list(): Promise<FieldGuideEntry[]>;
  /** A single entry by id, or undefined if it's gone. */
  get(id: string): Promise<FieldGuideEntry | undefined>;
  /** Persist a new entry. */
  add(entry: FieldGuideEntry): Promise<void>;
  /** Remove an entry by id. */
  remove(id: string): Promise<void>;
}

/** Generate a locally-unique id without pulling in a dependency. */
function newId(): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  // Fallback for environments without crypto.randomUUID.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Build a {@link FieldGuideEntry} from a fresh identification + its photo.
 * Centralised so web and mobile create entries identically.
 */
export function buildEntry(
  identification: Identification,
  image: string,
): FieldGuideEntry {
  return {
    id: newId(),
    createdAt: Date.now(),
    image,
    identification,
  };
}
