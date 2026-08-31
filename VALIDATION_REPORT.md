# ORYN Android V10.4.1 — Unified Connection Validation

Build marker: `ORYN-ANDROID-V10.4.1-UNIFIED-CONNECTION-20260901-1`

## Local checks completed

- JavaScript syntax check for the offline/direct bootstrap: PASS
- Deterministic connection-state test: PASS
  - true cold start forces ORYN Offline
  - stale/ghost Direct ESP32 table row removed
  - saved Direct ESP32 host/calibration retained
  - Direct ESP32 activation creates exactly one active Direct identity
  - internal state refresh preserves Direct mode
  - Pi discovery does not steal Direct mode
  - switching to Offline disables Direct routing
  - switching to a Pi preserves the Pi entry
  - Direct table rename persists only on the Direct identity
- Android XML parsing: PASS
  - AndroidManifest.xml
  - network_security_config.xml
  - themes.xml
  - strings.xml
- Java source delimiter/structure check: PASS
- GitHub Actions workflow and project version metadata inspected for consistency
- Non-commercial license/notice files present

## Important build-status note

A full Android SDK/Gradle APK compilation was not executed in the packaging environment because
that environment does not contain the Android SDK/Gradle toolchain. The included GitHub Actions
workflow builds with Android SDK 35, Java 17 and Gradle 8.9. A Windows local build helper is also
included.

This report intentionally does not claim a compiled APK test that was not performed.
