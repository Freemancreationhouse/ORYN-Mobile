# ORYN Android — Unified Pi + Direct ESP32 — Motion Parity

This repository contains the consolidated ORYN Android application. It opens as a complete offline ORYN app and can then connect either to an ORYN Raspberry Pi table or directly to an ESP32 running FluidNC.

## Connection model

- **Cold launch:** `ORYN Offline`. The bundled pattern library, Pattern Designer and offline functions remain available without a table.
- **Direct ESP32:** use **ESP32 Smart Connect**. ORYN probes the saved IP first, then `fluidnc.local`, then private LAN / phone-hotspot subnets. A successful connection becomes the single active machine `ORYN Direct — ESP32 FluidNC`.
- **Raspberry Pi:** use **Scan for ORYN** or **Add ORYN Pi Manually**. Pi entries remain separate from Direct ESP32.
- Direct ESP32 is **not stored as a fake Pi/remote table**. Old Direct/Offline ghost entries are cleaned on a true cold launch while saved Direct calibration/IP are preserved.

## Moving the ESP32 to another Wi-Fi or phone hotspot

Open **ESP32 Smart Connect → Wi-Fi network setup (change anytime)** while FluidNC is reachable, enter the new SSID/password, save, reboot the ESP32, then use **Find ESP32 on Current Network**. The app also supports manual IP fallback.

## Direct ESP32 calibration

Direct calibration uses controller units, not physical millimetres. The current saved Theta full-revolution and Rho center-to-perimeter values are retained across app upgrades. Do not uninstall the app if you want Android local data/calibration preserved.


## Direct ESP32 coupled Theta–Rho motion

Direct ESP32 playback now uses the same **coupled relative-delta mathematics as the locked ORYN Pi V9 motion core**. It does not treat X and Y as independent absolute axes. For each THR point it computes logical `delta_theta` and `delta_rho`, scales them with the saved 360° / center-to-perimeter calibrations, and adds the mechanical Theta→Rho compensation term before sending one coordinated `G91 G21 G1 X… Y…` block.

At the start of each motion session ORYN reads the controller's current X/Y `steps_per_mm`. The compact 28BYJ/Mini profile uses the proven gear ratio 32 / Mini winding; other profiles retain the V9 generic fallback. **No FluidNC settings are changed by this detection.**

This correction is important for clears such as `clear_from_out.thr`: the file contains about 33 spiral revolutions. On the compact coupled mechanism, sending only the logical rho value makes the ball linger near the perimeter and the pattern can fail mechanically after only a few turns. The coupled V9 compensation keeps physical Rho synchronized with the THR path.

## Build APK with GitHub Actions

Push this project to the `main` branch. The workflow `.github/workflows/build-android-apk.yml` builds with Android SDK 35, Java 17 and Gradle 8.9. Download the artifact named:

`ORYN-V10.4.1-Unified-Motion-Parity-APK`

The APK filename inside the artifact is:

`ORYN-V10.4.1-unified-motion-parity-debug.apk`

## Upgrade from earlier Direct builds

Install the new APK **over the existing ORYN app**. On the first true cold launch it intentionally opens as `ORYN Offline` and removes stale Direct ghost table rows, but keeps the saved ESP32 host and calibration for reconnect.

## License

ORYN-owned portions of this repository are licensed for **non-commercial use only** under the PolyForm Noncommercial License 1.0.0. See `LICENSE` and `NOTICE.md`. A separate written commercial license is required for commercial use. Third-party components remain under their own terms.

## Local state test

If Node.js is installed, run:

```bash
node tests/test_connection_state.js
```

Expected result:

```text
PASS connection-state deterministic tests
```

See `VALIDATION_REPORT.md` for the packaging-time checks and the explicit APK-build limitation.

## GitHub repository

Commit the **contents of this folder as the repository root**. Do not put the whole project one
extra folder deep. The `.github/workflows/build-android-apk.yml` workflow will then run on pushes
to `main` that change the Android project files.
