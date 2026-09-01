# ORYN Android V10.4.1 — Direct ESP32 Persistent Streaming + Clear Direction Fix Validation

Build: `ORYN-ANDROID-V10.4.1-DIRECT-PERSISTENT-STREAM-CLEAR-20260901-3`

## Scope lock

Only the Android Direct ESP32 / FluidNC pattern-motion path was changed. The locked visual UI bundle is unchanged; one offline Direct bridge mapping was corrected so the existing clear-mode values reach the correct bundled THR clear files. Existing Pi support, connection flows, Home, calibration UI/actions, 100-pattern library, Pattern Designer, Pattern Forge, branding, and license remain preserved.

One additional normal Android permission, `WAKE_LOCK`, is present only so the app can hold Direct pattern Wi-Fi/CPU execution while a pattern is actively streaming. It does not change Wi-Fi selection or connection behavior.

## Measured Mini coupling

- gear ratio: `6.25`
- X steps/mm: `256`
- Y steps/mm: `210`
- coupling: `256 / (6.25 × 210) = 0.19504761904761905`
- X+ requires Y- compensation; X- requires Y+ compensation.
- `X +5` produces coupling Y `-0.9752380952380952` before logical rho contribution.

Saved live Full Circle / Perimeter calibration remains authoritative through `thetaRevUnits`, `rhoTravelUnits`, and `rhoDirection`; those values are not hardcoded.

## Persistent Direct FluidNC streamer

PASS — one exclusive Telnet socket owns the complete clear + pattern sequence.

PASS — one persistent reader thread frames all FluidNC line acknowledgements and `<...>` status frames for the life of that socket.

PASS — fragmented acknowledgement bytes such as `o` followed later by `k\r\n` are reconstructed as one real `ok`.

PASS — incoming Telnet IAC negotiation bytes are stripped before parsing and cannot corrupt `ok`/`error` tokens.

PASS — `TCP_NODELAY` and TCP keepalive are enabled on the Direct motion socket.

PASS — Android Direct pattern playback holds high-performance Wi-Fi and a partial CPU wake lock only while streaming.

PASS — each coordinated relative command is transmitted once, then waits for its real `ok`/`error`/alarm. Socket read timeout is waiting/backpressure, never completion.

PASS — an uncertain relative movement is never resent.

PASS — there is no 15-second abort or acknowledgement deadline in the Direct pattern streamer.

PASS — every parsed THR point must be acknowledged before that file may complete.

PASS — after the final coordinate, the same socket repeatedly queries FluidNC until an explicit `<Idle...>` frame is received; only then is the file complete.

## Clear direction

- `clear_from_in.thr`: 3449 points; rho is constrained Center → Perimeter.
- `clear_from_out.thr`: 3447 points; rho is constrained Perimeter → Center.
- Both use the same persistent streamer as normal THR playback.
- UI `clear_from_out` maps to `clear_from_out.thr` (legacy `from_perimeter` also accepted).
- UI `clear_from_in` maps to `clear_from_in.thr` (legacy `from_center` also accepted).
- `clear_from_out.thr` is inserted before the selected drawing pattern, so From Perimeter cannot silently skip clearing and jump to the drawing pattern start.
- Bundled THR files were not rewritten.

## Included tests

GitHub Actions runs:

- `tests/test_connection_state.js`
- `tests/test_direct_coupled_motion.js`
- `tests/test_direct_clear_progression.js`
- `tests/test_direct_ack_framing.js`
- `tests/test_direct_streamer_static.js`
- `tests/test_direct_clear_mode_bridge.js`

All tests pass in this source package.

## Integrity checks

PASS — locked compiled UI bundle, Pattern Designer, Pattern Forge, catalog, previews, and THR assets are unchanged. Only `offline/oryn-mobile-bootstrap.js` Direct clear-mode routing changed.

PASS — offline catalog contains 100 patterns.

PASS — `LICENSE`, `NOTICE.md`, Gradle build configuration, settings, and properties are unchanged.

## APK workflow

`.github/workflows/build-android-apk.yml` includes validation and a debug APK build using Java 17, Android SDK 35, Gradle 8.9, and AGP 8.7.3.

Artifact filename: `ORYN_ANDROID_V10_4_1_UNIFIED_FINAL_MEASURED_MOTION_STREAMING_CLEAR_FIX-debug.apk`
