# ORYN Android Standalone

**Mobile branch:** ORYN-ANDROID-STANDALONE-1.0.2  
**Locked source baseline:** PF-PRO-V10.4.1-20260828-1  
**Locked motion baseline:** UC-ORYN-MOTION-V9-20260827-1 — unchanged on the Pi

This is a standalone Android application project. It packages the locked ORYN interface, 100 THR patterns, cached previews, icons and frontend assets inside the Android app. It does **not** load the Raspberry Pi website as its startup UI. The Pi remains the real machine-control endpoint when a table is connected.

## Mobile behavior

- Opens with the ORYN UI and pattern library even when no ORYN table is reachable.
- Keeps pattern browsing, cached previews, local settings, Favorites and playlists available offline.
- Tries `oryn.local` first and then scans the current private `/24` LAN for ORYN tables on ports `8080` and `80`.
- Keeps the existing **Add Table Manually** flow and adds native **Scan for ORYN** and **Open Wi-Fi Settings** actions.
- Selecting a discovered/manual table makes the existing ORYN controls use that table's real API.
- Motion, homing, calibration, Pattern Forge generation, LED and other machine-changing actions are never faked while offline; they require a selected reachable table.

## Build on Windows

1. Install/open Android Studio and install **Android SDK Platform 35**.
2. Right-click `BUILD_APK_WINDOWS.ps1` and run with PowerShell, or from PowerShell run:
   `powershell -ExecutionPolicy Bypass -File .\BUILD_APK_WINDOWS.ps1`
3. The completed debug APK is copied to `ORYN-Mobile-V10.4.1-mobile3-debug.apk` in the project root.

The script uses Android Studio's Java when available, locates the normal Android SDK path, downloads Gradle 8.9 if required, builds the project, and copies the APK to a clear filename.

## Build with GitHub Actions

The included `.github/workflows/build-android-apk.yml` builds the Android APK on push to `main` or from **Actions → Build ORYN Android APK → Run workflow**. The resulting artifact is named **ORYN-Mobile-V10.4.1-Mobile3-APK**.

## Android package

- Application ID: `com.studiokinematics.oryn`
- Version name: `10.4.1-mobile3`
- Version code: `1040102`
- Minimum Android API: 26
- Target / compile API: 35
