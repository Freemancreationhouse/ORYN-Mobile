# ORYN Mobile v2.0 — Standalone Interface

ORYN — Designed to Move — by Studio Kinematics™

This Android build bundles the ORYN frontend inside the APK. The application opens immediately whether or not a Raspberry Pi/table is reachable.

## Behaviour

- Tap ORYN → full ORYN interface opens from the APK itself.
- No Raspberry Pi is required to launch or browse the interface.
- A small **Connect Table** control lets you enter an ORYN address or scan local Wi‑Fi.
- When connected, the existing ORYN frontend talks directly to the selected ORYN table over HTTP/WebSocket.
- If no table is connected, machine-action API calls are intentionally rejected by the local shell instead of hiding the app.
- Pattern Forge file selection remains supported through Android's file picker.

The Raspberry Pi remains authoritative for actual machine motion/Theta–Rho execution. The Android APK is now authoritative for its own application interface and launch lifecycle.

Package: `com.studiokinematics.oryn`
Version: `2.0.0`
