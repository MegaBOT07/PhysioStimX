# PhysioStimX

Clinical stimulation workflow app built with React Native + Expo (TypeScript).

## Workflow Implemented

1. Splash
2. Onboarding
3. Patient Registration
4. Home Dashboard
5. Session Selection
6. Normal Session (fixed channels 1-4 sequence)
7. Custom Session (manual channel selection)
8. Session Feedback
9. Patient History / Analytics
10. BLE Connection screen from Home status corner

## Project Structure

- `src/navigation/AppNavigator.tsx`: Full stack navigation flow
- `src/context/AppContext.tsx`: App state for patients, sessions, BLE status
- `src/screens/*`: All workflow screens
- `src/components/*`: Shared UI primitives
- `stitch/*`: Original design references (`screen.png`)

## Run Locally

```bash
npm install
npm run start
```

Then in Expo:

- `a` for Android
- `i` for iOS (macOS required)
- `w` for Web (useful for users who do not install APK)

## Build Targets

- Android native: `npx expo run:android` (uses Gradle in generated android project)
- iOS native: `npx expo run:ios` (Xcode/macOS)
- Web: `npm run web` for browser access

## Note About Capacitor

This repository is now set up for Expo React Native delivery. Capacitor is typically used for web apps, not React Native apps. If you want Capacitor specifically, the recommended approach is to maintain a separate web client and wrap that with Capacitor.