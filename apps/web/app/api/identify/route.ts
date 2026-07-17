import { NextResponse } from "next/server";
import { unidentified } from "@wildsnap/core";
import { identify, imageInputFromDataUrl } from "@wildsnap/core/identify";

// The vision call must run on the server (holds the API key). Never static.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server proxy for identification. The browser POSTs `{ image: <data URL> }`;
 * we parse it, run the shared `identify()` seam (mock in M2, real Claude in M3),
 * and return the {@link Identification} JSON. The API key stays server-side.
 */
export async function POST(request: Request) {
  let dataUrl: string;
  try {
    const body = (await request.json()) as { image?: unknown };
    if (typeof body.image !== "string" || !body.image.startsWith("data:")) {
      return NextResponse.json(
        { error: "Expected { image: <base64 data URL> }." },
        { status: 400 },
      );
    }
    dataUrl = body.image;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const image = imageInputFromDataUrl(dataUrl);
    const result = await identify(image);
    return NextResponse.json(result);
  } catch (err) {
    // Never leak internals; degrade to a friendly "couldn't identify" card.
    console.error("[identify] failed:", err);
    return NextResponse.json(unidentified());
  }
}
