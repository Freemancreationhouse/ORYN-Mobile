# ORYN Android V10.4.1 — Direct ESP32 WebSocket Streaming Validation

Build: `ORYN-ANDROID-V10.4.1-DIRECT-WS-STREAM-20260901-4`

## Scope lock

This build is based on the previous measured-motion + persistent-stream + clear-direction full source. Only the Android native Direct ESP32 pattern-motion transport was changed for this build, plus validation/release metadata and the GitHub Actions validation list/artifact name.

The locked web UI/assets are byte-for-byte unchanged from the supplied previous build. Pi support, Home, Full Circle calibration, Perimeter calibration, Wi-Fi/home-hotspot/manual-IP flows, 100 offline patterns, Pattern Designer, Pattern Forge, branding, and license remain preserved.

## Measured Mini coupling

- gear ratio: `6.25`
- X steps/mm: `256`
- Y steps/mm: `210`
- coupling: `256 / (6.25 × 210) = 0.19504761904761905`
- X+ requires Y- compensation; X- requires Y+ compensation.
- `X +5` produces coupling Y `-0.9752380952380952` before logical rho contribution.

Saved live Full Circle / Perimeter calibration remains authoritative through `thetaRevUnits`, `rhoTravelUnits`, and `rhoDirection`; those values are not hardcoded.

## Direct FluidNC pattern streamer

PASS — pattern playback uses one exclusive FluidNC WebSocket motion connection on port `81` for the complete clear + drawing sequence.

PASS — machine name and X/Y steps-per-mm needed by the motion core are read through that same WebSocket channel before movement; pattern playback does not open a second Telnet client.

PASS — WebSocket handshake uses and validates `Sec-WebSocket-Key` / `Sec-WebSocket-Accept`.

PASS — Android client WebSocket frames are masked as required by RFC 6455.

PASS — FluidNC text and binary console messages are accepted.

PASS — `CURRENT_ID`, `ACTIVE_ID`, and app-level `PING` messages remain separated by WebSocket message boundaries and cannot corrupt a later `ok` token.

PASS — WebSocket protocol ping frames receive pong responses.

PASS — each coordinated relative command is transmitted exactly once, then waits without a fixed deadline for its real `ok`/`error`/alarm.

PASS — socket read timeout is waiting/backpressure only; it is never pattern completion.

PASS — there is no 15-second abort in Direct pattern playback.

PASS — an uncertain relative movement is never resent.

PASS — every parsed THR point must be acknowledged before the current file can complete.

PASS — after the final coordinate, the same connection queries FluidNC until an explicit `<Idle...>` frame is received; only then can playback finish.

PASS — explicit user Stop sends FluidNC realtime Ctrl-X through the active WebSocket channel.

PASS — TCP keepalive, TCP_NODELAY, high-performance Wi-Fi lock, and partial CPU wake lock remain active for Direct pattern playback.

## No-clear path

PASS — `pre_execution = none` adds no clear file but always queues the selected pattern.

PASS — the selected pattern then uses the same full-point acknowledgement streamer and the same final `<Idle>` completion gate.

## Clear direction retained

- `clear_from_in.thr`: 3449 points; rho constrained Center → Perimeter.
- `clear_from_out.thr`: 3447 points; rho constrained Perimeter → Center.
- UI `clear_from_out` / legacy `from_perimeter` maps to `clear_from_out.thr`.
- UI `clear_from_in` / legacy `from_center` maps to `clear_from_in.thr`.
- Both clear files use exactly the same Direct WebSocket streamer as normal drawing patterns.

## Included tests

GitHub Actions runs:

- `tests/test_connection_state.js`
- `tests/test_direct_coupled_motion.js`
- `tests/test_direct_ack_framing.js`
- `tests/test_direct_clear_progression.js`
- `tests/test_direct_streamer_static.js`
- `tests/test_direct_clear_mode_bridge.js`
- `tests/test_direct_no_clear_stream.js`

All tests pass in this source package.

## Source integrity

PASS — `app/src/main/assets/` is byte-for-byte identical to the previous full-source build.

PASS — offline catalog contains exactly 100 patterns.

PASS — Android manifest, app Gradle configuration, and existing license remain unchanged.

PASS — Java parser-level syntax scan reports no syntax-like errors; local compilation cannot resolve Android framework classes because this execution environment does not contain the Android SDK. The included GitHub Actions workflow installs Android SDK 35 and performs the real Gradle APK build.

## APK workflow

`.github/workflows/build-android-apk.yml` installs Java 17, Android SDK 35, Gradle 8.9 and runs all Direct-motion validation tests before `:app:assembleDebug`.

Artifact filename: `ORYN_ANDROID_V10_4_1_UNIFIED_FINAL_DIRECT_WS_STREAM-debug.apk`
