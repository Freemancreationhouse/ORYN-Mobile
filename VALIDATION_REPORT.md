# ORYN Android V10.4.1 — Direct Final Validation

Build: `ORYN-ANDROID-V10.4.1-DIRECT-FINAL-ORIENTATION-CONTROL-FIX-20260904-1`

## Orientation-control correction

- PASS — the visible control anchors to `input[name="preExecutionAction"]`
  inside the open Pattern Details dialog.
- PASS — the removed legacy `.km-eyebrow` anchor is no longer used.
- PASS — the control includes 0°, 90°, 180°, 270°, and custom degree input.
- PASS — the selected angle is normalized and retained in Android WebView
  local storage for later individual patterns and playlists.
- PASS — selected pattern entries carry `theta_offset_rad`; clear-pattern
  entries intentionally do not.
- PASS — native playback applies the offset in memory and never rewrites the
  source THR library file.

## Packaging-time checks

- PASS — JavaScript syntax for the Android bootstrap.
- PASS — deterministic Offline / Pi / Direct connection-state test.
- PASS — Direct activation queues exactly one automatic Home and does not repeat it on reload.
- PASS — native status publishes elapsed, remaining, and completed-time values to both Direct status sockets.
- PASS — one exclusive persistent FluidNC motion session performs profile read and all pattern commands.
- PASS — socket read timeout is waiting/backpressure; the playback session has no acknowledgement deadline.
- PASS — each coordinated relative movement is sent once and progress advances only after its acknowledgement.
- PASS — final completion waits for explicit FluidNC `<Idle>` before releasing the session.
- PASS — completed/closed playback releases `directRunning` so a second pattern can start.
- PASS — leaving the Activity cannot call Direct Stop while Home or pattern motion is active.
- PASS — active motion, controller state, timer and socket survive Activity recreation in the foreground-service process.
- PASS — reopening during active motion does not become a fresh launch, reconnect, or queue automatic Home.
- PASS — foreground connected-device service holds CPU and high-performance Wi-Fi locks during motion.
- PASS — the foreground service is non-sticky, so an uncertain relative movement is never restarted after process death.
- PASS — generated/native pattern aliases normalize to one canonical `custom/*.thr` playlist entry.
- PASS — standalone Pattern Designer calls native Android ORYN Library storage directly rather than relying on the parent-page fetch router.
- PASS — Direct Pattern Designer save invokes native storage and returns its canonical `custom/*.thr` path.
- PASS — Browse metadata merges a saved Android pattern with all 100 bundled patterns (101 total in the deterministic test).
- PASS — Direct playlist playback resolves generated patterns to their native `user/*.thr` files.
- PASS — Wi-Fi setup scans with FluidNC `$WiFi/ListAPs` and shows ESP32-visible 2.4 GHz networks.
- PASS — all four saved Wi-Fi settings require explicit FluidNC `ok` acknowledgements.
- PASS — same-phone hotspot setup explains the required disconnect → enable 2.4 GHz hotspot → ESP32 power-cycle order.
- PASS — Settings → Open WiFi Setup uses Android Smart Wi-Fi in Offline and Direct modes.
- PASS — an active ORYN Pi bypasses the Android interceptor and opens the real Pi `/wifi-setup` page.
- PASS — the compiled Settings button invokes the mode-aware dispatcher and retains the Pi Wi-Fi route.
- PASS — Android Wi-Fi network and saved-network endpoints return arrays required by the locked Settings renderer.
- PASS — Offline, Direct ESP32 and Pi Wi-Fi routing are validated independently.
- PASS — Direct playback exposes 0°, 90°, 180°, 270° and custom pattern orientation controls.
- PASS — selected orientation is converted to radians and applied before whole-turn Theta alignment.
- PASS — clearing patterns receive no orientation offset.
- PASS — X5 measured coupling compensation is approximately Y−0.975238 for X=256, Y=210, gear ratio=6.25.
- PASS — `clear_from_in` runs Center → Perimeter.
- PASS — `clear_from_out` runs Perimeter → Center.
- PASS — saved Full Circle, Perimeter and Rho-direction calibration values remain runtime inputs.
- PASS — the 100-pattern offline assets, Pattern Designer, Pattern Forge, Pi support, branding and license remain present.
- PASS — GitHub Actions runs all four deterministic validations before compiling the APK.

## APK compile note

The source package is configured for Android SDK 35, Java 17 and Gradle 8.9 through GitHub Actions. This workspace does not contain the Android SDK/Gradle toolchain, so the APK binary was not claimed as locally compiled. The included workflow performs the real Android compilation after the tests pass.
