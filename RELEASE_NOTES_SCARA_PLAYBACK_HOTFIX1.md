# ORYN Android — SCARA V0.4 Playback Hotfix 1

Fixes the reported SCARA Android behavior where the UI displayed **Pattern started** but the machine immediately showed **Not Playing** and did not move.

Changes are limited to the SCARA Android transport layer:

- `/run_theta_rho` does not return success until ESP32 `/api/status` confirms playback.
- Explicitly checks `referenced=true` before upload/play and reports a clear SCARA reference message if missing.
- Verifies the uploaded THR actually exists in ESP32 `/patterns` before sending Play.
- Uses one fixed temporary file `oryn_app_current.thr`, preventing repeated Android plays from filling LittleFS with duplicate uploaded patterns.
- A premature stop is now surfaced as an error instead of being treated as a successful completion.
- Existing Pi and Direct FluidNC logic is unchanged.
- Existing SCARA geometry/motion firmware is unchanged.
