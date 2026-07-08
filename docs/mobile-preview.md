# Mobile Preview

> **Status:** The mobile app runs locally via Expo Go or iOS/Android simulator. No App Store or Play Store publish. No EAS build required for demo.

## Strategy

| Priority | Path | When |
| -------- | ---- | ---- |
| **Primary** | Expo Go (local) | Fastest, zero build, works for screenshots and demo video |
| **Fallback** | iOS Simulator / Android Emulator | When Expo Go is unavailable or for screen recording |
| **Optional (V2)** | EAS internal distribution (Android APK) | Only if a shareable installable link is needed later |

### Why Expo Go works

All native dependencies in this project are compatible with Expo Go:

| Dependency | Used in source? | Expo Go compatible? |
| ---------- | --------------- | ------------------- |
| `expo-router` | Yes | Yes (plugin in `app.json`) |
| `expo-splash-screen` | Yes | Yes (plugin in `app.json`) |
| `expo-symbols` | Yes (extensively) | Yes — "Included in Expo Go" per [Expo SDK 57 docs](https://docs.expo.dev/versions/v57.0.0/sdk/symbols/) |
| `expo-image` | Yes | Yes — "Included in Expo Go" |
| `expo-font` | Yes | Yes |
| `expo-status-bar` | Yes | Yes |
| `expo-constants` | Yes | Yes |
| `expo-device` | Yes | Yes |
| `expo-linking` | Yes | Yes |
| `expo-web-browser` | No (not wired yet — only in comments) | Yes |
| `expo-glass-effect` | No (dependency installed, not imported) | Yes, but unused |
| `@expo/ui` | No (dependency installed, not imported) | Yes, but unused |
| `@react-native-async-storage/async-storage` | Yes | Yes — "Included in Expo Go" |
| `react-native-reanimated` | Yes | Yes |
| `react-native-gesture-handler` | Yes | Yes |
| `react-native-safe-area-context` | Yes | Yes |
| `react-native-screens` | Yes | Yes |

**No development build is needed.** The `app.json` plugins are only `expo-router` and `expo-splash-screen` — both Expo Go compatible. No custom native code, no config plugins that require a native build.

### Why EAS is not needed now

EAS Build (development build or internal distribution) is only necessary when:
- A dependency requires custom native code or a config plugin incompatible with Expo Go.
- You need a shareable installable binary (APK/IPA) for reviewers to install on their own devices.

Neither applies. Expo Go + local Strapi is sufficient for screenshots, demo video, and live walkthroughs. EAS internal distribution is documented as an optional V2 path below.

## Prerequisites

- **Node.js 22** (LTS)
- **pnpm 11.8.0** (pinned via `packageManager`)
- **Expo Go** app installed on your physical device (iOS or Android), OR an iOS Simulator / Android Emulator
- **Strapi CMS running** (local or deployed) — the mobile app fetches all content from Strapi

## Environment variables

| Variable | Where | Purpose |
| -------- | ----- | ------- |
| `EXPO_PUBLIC_STRAPI_URL` | `apps/mobile/.env` | Strapi CMS URL, bundled into the app at build time by Expo |

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

### URL configuration by environment

| Environment | `EXPO_PUBLIC_STRAPI_URL` value | Notes |
| ----------- | ------------------------------ | ----- |
| iOS Simulator | `http://localhost:1337` | Simulator maps `localhost` to the host machine |
| Android Emulator | `http://localhost:1337` | Android Emulator (API 30+) also maps `localhost` to the host |
| Physical device (same network) | `http://192.168.x.x:1337` | Use your machine's local network IP (`ifconfig` / `ipconfig getifaddr en0`) |
| Physical device (different network) | `https://your-deployed-cms-url` | Requires a deployed Strapi (see `docs/deployment.md`) or a tunnel (ngrok/Cloudflare Tunnel) |

> **No `localhost` is hardcoded in the source.** The URL comes from `EXPO_PUBLIC_STRAPI_URL` via `apps/mobile/src/lib/env.ts`. The `.env.example` default is `http://localhost:1337` for local dev only.

## Local run commands

All commands run from the repository root.

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the CMS

```bash
pnpm dev:cms          # http://localhost:1337/admin
```

Create an admin account on first launch, then seed content:

```bash
pnpm --filter @pathway/cms seed:pathway
```

### 3. Start the mobile app

```bash
pnpm dev:mobile       # Expo dev server
```

Then choose:

| Action | Command | Notes |
| ------ | ------- | ----- |
| Open in iOS Simulator | `pnpm dev:mobile:ios` | Or press `i` in the Expo dev server |
| Open in Android Emulator | `pnpm dev:mobile:android` | Or press `a` in the Expo dev server |
| Open in Expo Go (physical device) | Scan the QR code | Requires `EXPO_PUBLIC_STRAPI_URL` to point to your machine's LAN IP, not `localhost` |

### 4. Verify content loads

- Home screen should show greeting, featured paths, recommended lessons.
- Explore should list all published learning paths.
- If screens are empty, check that Strapi is running and `EXPO_PUBLIC_STRAPI_URL` is correct.

## iOS Simulator notes

- `localhost` works — the simulator shares the host's network.
- Requires Xcode + iOS Simulator installed.
- `pnpm dev:mobile:ios` opens the simulator automatically.
- Best path for screenshots and demo video (no physical device needed).

## Android Emulator notes

- `localhost` works on Android Emulator API 30+ (maps to host machine).
- On older emulators, use `http://10.0.2.2:1337` instead of `localhost` (Android emulator's alias for the host loopback).
- Requires Android Studio + Android Emulator installed.
- `pnpm dev:mobile:android` opens the emulator automatically.

## Physical device notes

- Install **Expo Go** from the App Store (iOS) or Play Store (Android).
- Scan the QR code from the Expo dev server terminal output.
- `EXPO_PUBLIC_STRAPI_URL` must point to your machine's local network IP (e.g. `http://192.168.1.50:1337`), not `localhost` — the phone cannot reach `localhost` on your dev machine.
- Both device and dev machine must be on the same Wi-Fi network.
- If the app can't load content, check your machine's firewall (allow port 1337).

## Expo Go notes

- Expo Go is the fastest path — no native build, no EAS account, no Xcode/Android Studio required for the dev server itself (only for simulators).
- All dependencies in this project are Expo Go compatible (see table above).
- Limitation: Expo Go uses the Expo Go app shell, not a standalone app. This is fine for a portfolio demo. A standalone build would require EAS Build (optional, see below).

## EAS preview / internal distribution (optional, V2)

Not needed for the current milestone. Documented here for future reference.

### When to use

- You need a shareable installable APK that a reviewer can install on their own Android device without Expo Go.
- You need a standalone iOS build for TestFlight (requires Apple Developer account — out of scope for V1).

### Setup (if needed later)

1. Install EAS CLI: `npm install -g eas-cli`
2. Log in: `eas login` (requires an Expo account)
3. Create `apps/mobile/eas.json` with minimal profiles:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

4. Build a preview APK: `eas build --profile preview --platform android`
5. Share the install link from the EAS dashboard.

> **No `eas.json` is committed now** — it would be created only when EAS is actually used. No EAS build has been executed.

## Troubleshooting

| Problem | Cause | Fix |
| ------- | ----- | --- |
| App loads but screens are empty | Strapi not running, or `EXPO_PUBLIC_STRAPI_URL` is wrong | Start CMS (`pnpm dev:cms`), check `apps/mobile/.env` |
| "Network request failed" on physical device | `localhost` doesn't reach dev machine from a phone | Set `EXPO_PUBLIC_STRAPI_URL` to your LAN IP (e.g. `http://192.168.1.50:1337`) |
| "EXPO_PUBLIC_STRAPI_URL is not set" | `.env` file missing or empty | `cp apps/mobile/.env.example apps/mobile/.env` |
| Expo Go can't connect to dev server | Different Wi-Fi network, or firewall blocking port 8081 | Ensure same network; allow port 8081 in firewall |
| Android Emulator can't reach Strapi | Old emulator (pre-API 30) | Use `http://10.0.2.2:1337` instead of `localhost` |
| `expo-symbols` renders nothing on Android | Expected — SF Symbols are iOS-only; Android uses Material Symbols via the same component | Ensure `name` prop includes `android` and `web` keys (the codebase does this) |

## Demo checklist

Use this to capture screenshots or record a demo video:

- [ ] Start CMS: `pnpm dev:cms` + `pnpm --filter @pathway/cms seed:pathway`
- [ ] Start mobile: `pnpm dev:mobile:ios` (or `:android`, or Expo Go)
- [ ] **Home** — greeting, continue learning card, featured paths, recommended lessons
- [ ] **Explore** — all published paths visible
- [ ] **Search** — type "FlashList" in Explore search — results filter
- [ ] **Learning Path** — tap "React Native Performance" — modules expand, lessons listed
- [ ] **Lesson** — tap "Optimizing Long Lists with FlashList" — body content, key takeaway, media
- [ ] **Save lesson** — tap bookmark icon — lesson saved
- [ ] **Mark complete** — tap "Mark as complete" — completion card appears
- [ ] **Prev/Next** — navigate to adjacent lesson
- [ ] **Saved tab** — saved lesson appears, segmented control switches tabs
- [ ] **Profile tab** — completed lesson and saved item visible
- [ ] **Restart app** — close and reopen — saved items and progress persist (AsyncStorage)
- [ ] **Loading state** — reload a screen while CMS restarts — skeleton appears
- [ ] **Error state** — stop CMS, reload — error state with retry appears
- [ ] **Empty state** — no published content — empty state with message

## What is still "coming soon"

- [ ] EAS preview build (optional, V2 — not needed for current demo)
- [ ] Screenshots (M5.5)
- [ ] Demo video (M5.5)
- [ ] Deployed CMS URL for physical device testing without local Strapi (M5.3)
