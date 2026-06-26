# iFit — The 5-Day Training Bible

A premium, offline-first workout tracker for **iOS and Android**, built from a complete 5-day push/pull/legs training program. Browse the program, run a guided workout, log every set, and watch your strength, volume, and PRs build over time — with animated exercise demos for every lift.

All data lives **on-device** (no account, no network required after first use).

---

## Features

- **Home dashboard** — greeting + name, animated streak ring, today's workout hero with one-tap start, weekly progress (sessions + volume), and your most recent PR.
- **Guided workout flow** — one exercise in focus at a time, large `+/−` steppers for weight & reps, set-by-set logging with a "last time" reference, progress dots across the session, an auto rest timer, and haptics throughout.
- **Workout-completion celebration** — volume, duration, exercises, sets, and any **new PRs** detected, with motion + a success haptic.
- **Progress analytics** — stat tiles (streak, weekly volume, bodyweight, PRs) and switchable charts: **Volume · Sessions · Bodyweight · per-exercise Strength** (estimated 1RM trend).
- **Exercise library** — searchable, filterable by muscle, with recently-used up top and compact rows tagged Compound / equipment / difficulty.
- **Exercise detail** — animated GIF demo, primary/secondary muscles, equipment, difficulty, "why it's programmed", step-by-step instructions, and your progress chart.
- **Profile** — name, bodyweight logging (feeds the weight chart), units (kg/lb), and a derived daily protein target.
- **Learn** — the training principles: selection & ordering rules, the non-negotiables, warm-ups, stretches, and full muscle anatomy.
- **Animated demos** — every exercise streams a looping GIF from a CDN and is cached on-device for offline use.

---

## Tech stack

- **Expo SDK 56** · **React Native 0.85** · **TypeScript**
- **expo-router** — file-based navigation (5 bottom tabs + stack screens)
- **Zustand** + **AsyncStorage** — state with on-device persistence
- **react-native-reanimated** + **react-native-worklets** — rings, count-ups, entrance animations (all < 300ms)
- **react-native-svg** — progress rings and charts (no chart dependency)
- **expo-image** — animated GIF demos with disk caching
- **expo-haptics** — tactile feedback

---

## Project structure

```
src/
  app/                      expo-router routes
    (tabs)/                 Home (index) · Workout · Library · history (Progress) · info (Profile)
    day/[id].tsx            day overview
    workout/[id].tsx        active workout flow
    workout/complete.tsx    completion celebration
    exercise/[id].tsx       exercise detail
    learn.tsx               training principles
  components/               design-system kit (Surface, StatTile, ProgressRing,
                            AnimatedNumber, SegmentedControl, ListRow, ExerciseGif, MiniLineChart …)
  data/                     program, exercises, rules, warmups, stretches,
                            exerciseGifs (GIF map), exerciseMeta (instructions + muscles)
  store/                    useWorkoutStore, useSettingsStore (persisted)
  lib/                      prs, stats, dates, units, difficulty, motion
  theme/                    design tokens (colors, 8pt spacing, typography, elevation)
  types.ts
```

The training program, exercises, anatomy, warm-ups, and stretches are encoded as typed data in `src/data/` — the single source of truth the UI renders.

---

## Getting started (development)

```bash
npm install
npx expo start          # then press i (iOS), a (Android), or scan with Expo Go
```

Requires Node 18+. iOS device/simulator builds need Xcode; Android needs the Android SDK.

## Building & installing on a device

Native projects are committed under `ios/` and `android/`. Set the Android SDK location once:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

**Android (release APK):**

```bash
cd android
./gradlew assembleRelease
# APK → android/app/build/outputs/apk/release/app-release.apk
adb install -r app/build/outputs/apk/release/app-release.apk
```

**iOS (release, signed):**

```bash
cd ios
xcodebuild -workspace iFit.xcworkspace -scheme iFit -configuration Release \
  -destination 'generic/platform=iOS' -derivedDataPath build \
  DEVELOPMENT_TEAM=<YOUR_TEAM_ID> CODE_SIGN_STYLE=Automatic \
  -allowProvisioningUpdates -allowProvisioningDeviceRegistration build
xcrun devicectl device install app --device <UDID> \
  build/Build/Products/Release-iphoneos/iFit.app
```

First iOS launch may require trusting the developer profile on the device
(**Settings → General → VPN & Device Management**).

## Verifying changes

```bash
npx tsc --noEmit                 # type-check
npx expo export --platform ios   # validate the whole bundle compiles
npx expo-doctor                  # project health
```

> Most screen/logic changes are JS-only — no native rebuild needed. Re-run
> `assembleRelease` / `xcodebuild` only to ship a new standalone build.

---

## Design system

Dark, calm, technical. Strict **8pt spacing**, native system font (SF / Roboto), floating cards with elevation, a single restrained accent, and motion under 300ms. Per-day colors appear only as small tags. Tokens live in `src/theme/`.

## Data & attribution

Exercise **animations and instruction text** come from
[**ExerciseGymGifsDB**](https://github.com/JahelCuadrado/ExerciseGymGifsDB),
served via the free **jsDelivr** CDN (`src/data/exerciseGifs.ts`, `src/data/exerciseMeta.ts`).
GIFs and cues © their respective authors; used for non-commercial purposes with attribution
(credited in the app's Profile screen).

The training program and methodology are encoded from "The Complete 5-Day Training Bible".

## Out of scope

Apple Health / Google Fit integration, cloud sync / accounts, social features, video demos, and app-store submission are intentionally not included.
