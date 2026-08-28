# ORYN Mobile Standalone V1.2

Standalone Android client for the locked ORYN Pi API baseline:

- Pattern Forge: PF-PRO-V10.4.1-20260828-1
- Motion core: UC-DUNE-MOTION-V9-20260827-1

The app UI and pattern library are packaged inside the APK. The app opens and browses locally even when no ORYN table is connected. Network access is used only for discovery and table control.

## GitHub repository layout

This package is intended to be the ROOT of the `ORYN-Mobile` repository:

```
ORYN-Mobile/
  .github/workflows/android-apk.yml
  app/
  build.gradle
  settings.gradle
  gradle.properties
```

Do not nest it inside another `mobile/` directory.

## Automated APK build

The GitHub workflow pins:

- JDK 17
- Android Gradle Plugin 8.13.2
- Gradle 8.13
- Android API 36
- Android SDK Build Tools 35.0.0

The first validation build intentionally creates a debug-signed APK because it is directly installable and does not require release-keystore secrets.

Artifact name: `ORYN-Mobile-Standalone-v1.2-APK`
APK: `ORYN-Mobile-Standalone-v1.2.apk`

If the build fails, the workflow also uploads `ORYN-Mobile-build-diagnostics` containing `android-build.log` when available.
