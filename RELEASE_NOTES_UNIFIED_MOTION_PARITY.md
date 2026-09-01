# ORYN V10.4.1 — Unified Final Measured Motion

Build: `ORYN-ANDROID-V10.4.1-UNIFIED-FINAL-MEASURED-MOTION-20260901-1`

## Direct ESP32 pattern-motion correction only

- Uses the physically confirmed ORYN Mini coupling constants: 6.25 gear ratio, X 256 steps/mm, Y 210 steps/mm, negative X→Y coupling sign.
- X+5 therefore produces approximately Y-0.975238 coupling compensation before any logical rho contribution.
- Keeps saved live Full Circle and Perimeter calibration values authoritative; no user calibration values are hardcoded.
- Sends coordinated relative FluidNC motion as `G91 G21 G1 X... Y... F...`.
- Removes fixed acknowledgement-abort behavior from Direct pattern streaming.
- Treats socket read timeout as planner back-pressure/waiting, never pattern completion.
- Never retransmits an uncertain relative movement.
- Requires every THR point to receive its FluidNC acknowledgement before completion.
- Polls FluidNC until `<Idle>` after the final coordinate before marking the motion sequence finished.
- Uses the same Direct streamer for clear and normal patterns.
- Enforces progressive clear rho direction after the clear entry point: Center → Perimeter for `clear_from_in`, Perimeter → Center for `clear_from_out`.

## Preserved from uploaded base

No redesign was made. Existing ESP32 connection, Home Wi-Fi / hotspot flow, manual IP, ORYN Direct header, Home, Full Circle calibration, Perimeter calibration, Pi support, 100 offline patterns, Pattern Designer, Pattern Forge, UI/branding, and non-commercial license remain in place.
