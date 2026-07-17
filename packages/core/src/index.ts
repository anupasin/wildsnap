// NOTE: `identify()` itself is intentionally NOT re-exported here. It pulls in
// @anthropic-ai/sdk, which imports Node-only builtins (node:fs) — fine for the
// Next.js API route (runs in Node), fatal for Metro bundling the mobile app or
// any browser code. Server-only callers import it from "@wildsnap/core/identify".

export type {
  Category,
  Confidence,
  Identification,
  FieldGuideEntry,
} from "./types";

export { mockIdentify, unidentified } from "./mock";

export type { FieldGuideStore } from "./storage";
export { buildEntry } from "./storage";
