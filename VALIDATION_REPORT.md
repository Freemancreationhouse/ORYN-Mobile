# ORYN Android V10.4.1 — Direct Playback State Fix Validation

Build: `ORYN-ANDROID-V10.4.1-DIRECT-PLAYBACK-STATE-FIX-20260901-1`

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
- PASS — X5 measured coupling compensation is approximately Y−0.975238 for X=256, Y=210, gear ratio=6.25.
- PASS — `clear_from_in` runs Center → Perimeter.
- PASS — `clear_from_out` runs Perimeter → Center.
- PASS — saved Full Circle, Perimeter and Rho-direction calibration values remain runtime inputs.
- PASS — the 100-pattern offline assets, Pattern Designer, Pattern Forge, Pi support, branding and license remain present.
- PASS — GitHub Actions runs all three deterministic validations before compiling the APK.

## APK compile note

The source package is configured for Android SDK 35, Java 17 and Gradle 8.9 through GitHub Actions. This workspace does not contain the Android SDK/Gradle toolchain, so the APK binary was not claimed as locally compiled. The included workflow performs the real Android compilation after the tests pass.
