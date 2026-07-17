import type { FieldGuideEntry, FieldGuideStore } from "@wildsnap/core";

const KEY = "wildsnap.fieldguide.v1";

function readAll(): FieldGuideEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FieldGuideEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: FieldGuideEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(entries));
}

/**
 * localStorage-backed {@link FieldGuideStore} for the web app. Entries are kept
 * newest-first. Mobile provides an AsyncStorage implementation of the same
 * interface (M4), so callers never care which platform they're on.
 */
export const webStorage: FieldGuideStore = {
  async list() {
    return readAll();
  },
  async get(id) {
    return readAll().find((e) => e.id === id);
  },
  async add(entry) {
    writeAll([entry, ...readAll()]);
  },
  async remove(id) {
    writeAll(readAll().filter((e) => e.id !== id));
  },
};
