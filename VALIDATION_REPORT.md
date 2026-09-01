# ORYN Android V10.4.1 — Unified Final Measured Motion Validation

Build: `ORYN-ANDROID-V10.4.1-UNIFIED-FINAL-MEASURED-MOTION-20260901-1`

## Scope lock

Only the Android **Direct ESP32 / FluidNC pattern-motion path** was changed. The existing Offline/Pi paths, Wi-Fi and hotspot connection flow, manual IP, Home UI/action, Full Circle calibration, Perimeter calibration, 100-pattern library, Pattern Designer, Pattern Forge, branding/UI assets, and PolyForm Noncommercial license were retained from the uploaded base.

## Measured Mini coupling

Confirmed Direct Mini constants used by the motion core:

- `gear_ratio = 6.25`
- `X_steps_per_mm = 256`
- `Y_steps_per_mm = 210`
- `coupling = 256 / (6.25 × 210) = 0.19504761904761905`
- X positive requires Y negative compensation.
- X negative requires Y positive compensation.

Static calculation:

- `X +5.000000` → coupling Y = `-0.9752380952380952`
- `X -5.000000` → coupling Y = `+0.9752380952380952`

The Full Circle and Perimeter geometry values are **not hardcoded**. Playback continues to receive and use the saved live values passed as `thetaRevUnits`, `rhoTravelUnits`, and `rhoDirection`.

## Direct THR conversion

For each logical THR delta, the Android native streamer uses:

- `dX = deltaTheta / (2π) × savedThetaRevolutionUnits`
- `dY_radial = deltaRho × savedRhoTravelUnits × savedRhoDirection`
- `dY_coupling = -dX × X_steps_per_mm / (6.25 × Y_steps_per_mm) × savedRhoDirection`
- `dY = dY_radial + dY_coupling`

and sends one coordinated relative command:

`G91 G21 G1 X... Y... F...`

## Streaming validation

PASS — one persistent Direct FluidNC motion socket is used for the clear + pattern sequence.

PASS — every relative THR command is sent exactly once and then waits for its real FluidNC `ok` or `error`/`ALARM` result.

PASS — socket read timeout is treated as waiting/back-pressure, not completion.

PASS — the Direct pattern streamer contains no 15-second acknowledgement abort and no acknowledgement deadline.

PASS — an uncertain relative movement is never resent.

PASS — every parsed THR coordinate must be acknowledged before the file can complete.

PASS — after the final coordinate, ORYN repeatedly queries FluidNC until an explicit `<Idle...>` status is received.

PASS — only after `<Idle>` does the sequence restore `G90` and leave the running state.

## Clear validation

Both clear patterns are sent through the exact same `runDirectPattern` streamer as normal THR patterns.

- `clear_from_in.thr`: 3449 points; first rho = `0`; final rho = `1`. The first point establishes Center, then Direct playback prevents tiny rounding reversals so rho progresses Center → Perimeter.
- `clear_from_out.thr`: 3447 points; first rho = `1`; final rho = `0.001`. The first point establishes Perimeter, then Direct playback prevents tiny rounding reversals so rho progresses Perimeter → Center.

No bundled THR file was rewritten.

## Automated checks included

GitHub Actions runs these before APK compilation:

- `tests/test_connection_state.js`
- `tests/test_direct_coupled_motion.js`
- `tests/test_direct_clear_progression.js`
- `tests/test_direct_streamer_static.js`

All four checks pass in this source package.

## Build workflow

`.github/workflows/build-android-apk.yml` builds with Java 17, Android SDK 35, Gradle 8.9, and Android Gradle Plugin 8.7.3, then uploads:

`ORYN_ANDROID_V10_4_1_UNIFIED_FINAL_MEASURED_MOTION-debug.apk`

The current workspace does not include a local Android SDK/Gradle installation, so no local APK binary is claimed here; the complete GitHub Actions APK workflow is included and statically validated.
