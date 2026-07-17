# 🌿 WildSnap

Point your phone (or webcam) at something in nature — a tree, flower, bird, or a
waterfall — and get back a warm, richly-detailed **field-guide card**, then collect
everything you identify into your own personal guide. A validation prototype exploring
whether this can feel more delightful than opening Google Lens.

> **Status:** early prototype. No accounts, no cloud, no analytics — local only.

## What's inside (monorepo)

```
packages/core   Platform-agnostic logic: identify(), the Identification type,
                the prompt, JSON validation, and the field-guide data model.
packages/ui     Shared result card + field-guide list (via react-native-web).   [M2 ✅]
apps/web        Next.js (App Router) web app.                                    [M2 ✅]
apps/mobile     Expo + Expo Router smartphone app.                               [M4 ✅]
```

The vision provider lives behind a **single function**, `identify()` in
`packages/core/src/identify.ts`. Swapping providers later means editing that one file.

## Prerequisites

- **Node** 20+ (tested on 24)
- **pnpm** 9+ (`corepack enable pnpm`, or `npm install -g pnpm`)

## Setup

```bash
pnpm install
```

### Environment / API key

Identification uses **Anthropic Claude** (a vision-capable model). Copy the example
env file and add your key. The key is only ever read **server-side** in the web app's
`/api/identify` route — it never reaches the browser.

```bash
cp .env.example apps/web/.env.local
# then edit apps/web/.env.local and set ANTHROPIC_API_KEY
```

| Variable                   | Where            | Purpose                                                     |
| -------------------------- | ---------------- | ----------------------------------------------------------- |
| `ANTHROPIC_API_KEY`        | `apps/web`       | Your Anthropic key (required for real identification).      |
| `VISION_MODEL`             | `apps/web`       | Optional. Defaults to `claude-sonnet-5`.                    |
| `EXPO_PUBLIC_IDENTIFY_URL` | Expo env  (M4)   | URL of the web `/api/identify` route the mobile app calls.  |

> **M3 is live:** `identify()` now calls real Claude vision. Without a key set, it
> degrades gracefully to a friendly "couldn't identify" card (check the server
> console for the real error) — so the app never crashes, but you do need a key to
> see real identifications.

## Run

```bash
# Verify the shared core loop end-to-end (calls the real Claude vision API —
# needs ANTHROPIC_API_KEY set in your shell, or export it inline for this call)
pnpm core:demo

# Web app — start this first; the mobile app calls its /api/identify route
pnpm dev:web            # http://localhost:3000

# Mobile app
pnpm start:mobile       # starts Expo; open the printed exp://<lan-ip>:8081
                        # URL in Expo Go on your phone (same Wi-Fi network)
```

### Running on your phone

1. Install **Expo Go** (App Store / Play Store).
2. Make sure `pnpm dev:web` is running (mobile identify calls go through it).
3. Set `EXPO_PUBLIC_IDENTIFY_URL` in `apps/mobile/.env.local` to your dev machine's
   LAN address, e.g. `http://192.168.1.20:3000/api/identify` (find your IP with
   `ipconfig`). Not a secret — just needs to match your network.
4. `pnpm start:mobile`, then open the `exp://<your-lan-ip>:8081` URL it prints in
   Expo Go. Your phone and computer must be on the same Wi-Fi network.

## Build milestones

- **M1 ✅** Monorepo scaffold + shared `Identification` type + mocked `identify()`.
- **M2 ✅** Web app: capture/upload → result card → field guide, against the mock.
- **M3 ✅** Swap the mock for the real Claude vision call (needs your API key — see above).
- **M4 ✅** Expo mobile app reusing `packages/core` + `packages/ui` (test on your phone via Expo Go — see above).

## Out of scope (v1)

Bird-call/audio ID, Trail Mode & safety notes, rarity scores, challenges, streaks,
voice readout, accounts, cloud database, payments, push, and store packaging. The
architecture leaves the door open for these without building any of them yet.
