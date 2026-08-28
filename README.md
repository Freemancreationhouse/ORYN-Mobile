# ORYN Mobile Standalone v1

Standalone Android client built from the locked ORYN Pi baseline:
- Pattern Forge: PF-PRO-V10.4.1-20260828-1
- Motion: UC-DUNE-MOTION-V9-20260827-1

## Standalone behavior
The app launches from local Android assets. It does **not** load `oryn.local` as its UI and does not require a table to open. The 100-pattern library, thumbnails, favorites/playlists, control screens, LED screen and settings are available before connection.

## Connection
- Automatically scans the current Wi-Fi LAN for an ORYN table.
- Tries `oryn.local` first.
- Manual host/IP connection is available.
- Remembers the last successful table.

## Connected actions
Pattern playback, HOME/Centre/Perimeter/Stop, LED commands and machine-profile reads use the locked ORYN HTTP API only after a table is connected.

## Build
This directory is a normal Android Gradle project. `gradle assembleRelease` creates `app-release.apk`.
The included GitHub Actions workflow builds an installable APK artifact after the project is placed in the repository as `/mobile`.
