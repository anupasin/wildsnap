import type { Identification } from "@wildsnap/core";

/**
 * URL of the web app's `/api/identify` route. Expo inlines `EXPO_PUBLIC_*`
 * vars at build time — set this to your dev machine's LAN address when
 * testing on a physical phone (see .env.example at the repo root).
 */
function resolveIdentifyUrl(): string {
  const url = process.env.EXPO_PUBLIC_IDENTIFY_URL;
  if (!url) {
    throw new Error(
      "EXPO_PUBLIC_IDENTIFY_URL is not set. Point it at your web app's /api/identify route (see .env.example).",
    );
  }
  return url;
}

/**
 * POST a captured photo (as a data URL) to the web app's identify route,
 * which runs the vision call server-side so the Anthropic key never ships
 * inside the mobile bundle. Mirrors apps/web/lib/identifyClient.ts.
 */
export async function identifyImage(dataUrl: string): Promise<Identification> {
  const res = await fetch(resolveIdentifyUrl(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ image: dataUrl }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Identification failed (${res.status}). ${detail}`.trim());
  }

  return (await res.json()) as Identification;
}
