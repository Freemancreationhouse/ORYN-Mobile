# ORYN V10.4.1 — Unified Motion Parity

Build: `ORYN-ANDROID-V10.4.1-UNIFIED-MOTION-PARITY-20260901-1`

## Fixed

- Direct ESP32 `.thr` playback now ports the locked ORYN Pi V9 coupled Theta–Rho motion mathematics.
- Replaced independent absolute `G90 X/Y` path streaming with coordinated relative `G91 G21 G1 XΔ YΔ` blocks.
- Added the mechanical Theta→Rho coupling compensation term.
- Reads live FluidNC X/Y `steps_per_mm` before Direct playback; it never writes or changes those settings.
- Detects the compact 28BYJ/Mini profile and uses its proven gear ratio / winding for coupling.
- Keeps saved 360° and perimeter calibrations authoritative.
- Waits for the first physical entry point and final FluidNC Idle before completion.
- Retains the unified Offline / Pi / Direct ESP32 connection state, Wi-Fi/hotspot setup, Home, live calibration, Pattern Designer, Pattern Forge and bundled patterns.
- Retains the PolyForm Noncommercial 1.0.0 repository license for ORYN-owned code.

## Why this was necessary

The compact Dune-Weaver-style mechanism is mechanically coupled: rotating Theta also induces Rho carriage motion. The previous Android Direct streamer scaled theta and rho correctly but treated the motor axes as independent absolute coordinates. On `clear_from_out.thr`, this left the physical ball near the perimeter after several rotations even though logical rho was decreasing. The Pi V9 core already contains the required compensation; this build ports that exact formula into Direct ESP32 playback.
