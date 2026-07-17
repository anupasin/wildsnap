/**
 * Tiny end-to-end sanity check for packages/core (milestone M1).
 * Run with: pnpm core:demo
 */
import { buildEntry } from "../src/index";
import { identify, imageInputFromDataUrl } from "../src/identify";

async function main() {
  // A 1x1 transparent PNG as a stand-in "photo" (bytes are ignored by the mock).
  const tinyPng =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  const image = imageInputFromDataUrl(tinyPng);
  const result = await identify(image);

  console.log("\n=== identify() result ===");
  console.log(JSON.stringify(result, null, 2));

  const entry = buildEntry(result, tinyPng);
  console.log("\n=== field guide entry ===");
  console.log(JSON.stringify({ ...entry, image: "<data-url omitted>" }, null, 2));
  console.log("\nOK — core loop runs end to end against the mock.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
