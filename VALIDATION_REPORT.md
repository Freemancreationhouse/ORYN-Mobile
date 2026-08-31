# ORYN Android V10.4.1 — Unified Motion Parity Validation

Build: `ORYN-ANDROID-V10.4.1-UNIFIED-MOTION-PARITY-20260901-1`

## Packaging-time checks

- PASS — bundled Android offline library retained.
- PASS — JavaScript syntax (`oryn-mobile-bootstrap.js`).
- PASS — deterministic Offline / Pi / Direct connection-state test.
- PASS — Android manifest and resource XML parse.
- PASS — Direct coupled-motion parity test using bundled `clear_from_out.thr`.
- PASS — `clear_from_out.thr` verified as 3447 points / ~32.985 full revolutions.
- PASS — Direct playback source sends coordinated relative `G91 G21 G1 XΔ YΔ` blocks.
- PASS — Direct playback source contains the ORYN Pi V9 Theta→Rho coupling formula.
- PASS — Center / Perimeter / manual Theta-Rho coordinate moves are routed through the same coupled logical-delta conversion.
- PASS — GitHub Actions runs the deterministic connection + coupled-motion tests before APK compilation.
- PASS — controller X/Y steps-per-mm are read at playback start; no controller setting is written by this detector.
- PASS — PolyForm Noncommercial License 1.0.0 retained.

## Motion correction verified

The previous Direct Android streamer treated X/Theta and Y/Rho as independent absolute axes. The compact ORYN/Dune-Weaver-style mechanism is mechanically coupled, so that path cannot match the locked Pi V9 motion core.

This build ports the V9 formula:

- `dX = dTheta / (2π) × savedThetaRevolutionUnits`
- `dY_geometry = dRho × savedRhoTravelUnits × rhoDirection`
- `dY_coupling = dX × (xSteps / (gearRatio × ySteps)) × sourceSign × rhoDirection`
- `dY_motor = dY_geometry + dY_coupling`

The test verifies that coupling is already materially active by about three turns of `clear_from_out.thr`, which is the physical failure point reported on the compact table.

## APK compile note

The source package is configured for Android SDK 35 / Gradle 8.9 through GitHub Actions. This Linux workspace does not contain the complete Android SDK/Gradle build environment, so an APK binary was not claimed as locally compiled here. Push the source to GitHub and use the included workflow for the real APK build.
