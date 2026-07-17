import type { Identification } from "@wildsnap/core";

/**
 * Browser-side helper: POST a captured photo (as a data URL) to our own
 * `/api/identify` route, which runs the vision call server-side so the API key
 * never reaches the client. Returns a validated {@link Identification}.
 */
export async function identifyImage(dataUrl: string): Promise<Identification> {
  const res = await fetch("/api/identify", {
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
