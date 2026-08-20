# ORYN Mobile v1.0

**ORYN — Designed to Move — by Studio Kinematics™**

Android client for the locked ORYN Raspberry Pi application.

## Architecture

The Raspberry Pi remains the single source of truth for machine motion,
Theta–Rho conversion, pattern execution, Pattern Forge, Perimeter Calibration,
Delete, clearing and settings.

The Android app does **not** duplicate or modify machine-control mathematics.
It discovers the ORYN Pi on the local network and opens the Pi-hosted locked
ORYN interface in an Android WebView.

## Connection flow

1. On first launch, ORYN Mobile checks a previously saved Pi address.
2. It tries `http://oryn.local`.
3. If needed, it scans the phone's local IPv4 subnet for an ORYN server by
   checking `/api/app-name`.
4. When found, it shows **ORYN found → Connect**.
5. The approved Pi address is remembered.
6. On later launches, the app reconnects automatically when that Pi is
   reachable.
7. A manual hostname/IP option is always available.

## Pattern Forge uploads

The WebView implements Android file selection so PNG, JPG, WEBP, BMP, SVG,
DXF and THR files can be selected from the phone for the Pi-hosted Pattern
Forge.

## Build in Android Studio

1. Install current Android Studio.
2. Open this folder as an existing project.
3. Let Android Studio install Android SDK Platform 36 / required build tools.
4. Select **Build > Build APK(s)**.
5. Debug APK is produced under:
   `app/build/outputs/apk/debug/app-debug.apk`.

The project uses Java 17, Android Gradle Plugin 8.13.2 and Gradle 8.13.

## Build automatically on GitHub

Push this Android project to GitHub. The included workflow:

`.github/workflows/build-apk.yml`

builds the debug APK automatically on every push to `main`.

In GitHub:
**Actions → Build ORYN Android APK → latest run → Artifacts →
ORYN-Mobile-v1.0-debug**

## Android permissions

- `INTERNET` — required to open the ORYN Pi web application.
- `ACCESS_NETWORK_STATE` — used to identify the current local network.
- `NEARBY_WIFI_DEVICES` — requested for local-network compatibility on newer
  Android versions and Android 16 local-network protections.

The app does not use Wi-Fi information to derive physical location.

## Local HTTP

ORYN Pi is intentionally served on the local network over HTTP. The app's
network security configuration explicitly allows cleartext local-network
traffic so `http://oryn.local` and private IPv4 addresses can load in WebView.

## Package

`com.studiokinematics.oryn`

Version: `1.0.0`
