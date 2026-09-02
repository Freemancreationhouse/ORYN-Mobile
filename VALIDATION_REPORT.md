# ORYN Android V10.4.1 — Direct Final Validation

Build: `ORYN-ANDROID-V10.4.1-DIRECT-FINAL-WIFI-SCREEN-FIX-20260902-1`

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
- PASS — Settings → Open WiFi Setup is intercepted before the Raspberry Pi-only route and opens Android Smart Wi-Fi.
- PASS — Android Wi-Fi network and saved-network endpoints return arrays required by the locked Settings renderer.
- PASS — the Wi-Fi Settings safety path is identical in Offline and Direct modes.
- PASS — X5 measured coupling compensation is approximately Y−0.975238 for X=256, Y=210, gear ratio=6.25.
- PASS — `clear_from_in` runs Center → Perimeter.
- PASS — `clear_from_out` runs Perimeter → Center.
- PASS — saved Full Circle, Perimeter and Rho-direction calibration values remain runtime inputs.
- PASS — the 100-pattern offline assets, Pattern Designer, Pattern Forge, Pi support, branding and license remain present.
- PASS — GitHub Actions runs all four deterministic validations before compiling the APK.

## APK compile note

The source package is configured for Android SDK 35, Java 17 and Gradle 8.9 through GitHub Actions. This workspace does not contain the Android SDK/Gradle toolchain, so the APK binary was not claimed as locally compiled. The included workflow performs the real Android compilation after the tests pass.
