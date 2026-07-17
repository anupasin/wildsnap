import AsyncStorage from "@react-native-async-storage/async-storage";
import type { FieldGuideEntry, FieldGuideStore } from "@wildsnap/core";

const KEY = "wildsnap.fieldguide.v1";

async function readAll(): Promise<FieldGuideEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FieldGuideEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(entries: FieldGuideEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(entries));
}

/**
 * AsyncStorage-backed {@link FieldGuideStore} for the mobile app. Same
 * contract as the web app's localStorage implementation — entries newest
 * first — so `packages/ui` never needs to know which platform it's on.
 */
export const mobileStorage: FieldGuideStore = {
  async list() {
    return readAll();
  },
  async get(id) {
    return (await readAll()).find((e) => e.id === id);
  },
  async add(entry) {
    const all = await readAll();
    await writeAll([entry, ...all]);
  },
  async remove(id) {
    const all = await readAll();
    await writeAll(all.filter((e) => e.id !== id));
  },
};
