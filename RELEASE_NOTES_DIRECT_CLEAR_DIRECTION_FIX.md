# ORYN Android V10.4.1 — Direct Clear Direction Fix

Build: `ORYN-ANDROID-V10.4.1-DIRECT-PERSISTENT-STREAM-CLEAR-20260901-3`

This full source is based on the persistent Direct ESP32 streaming fix. No UI redesign or unrelated functional changes were made.

## Corrected

- The locked ORYN UI sends `clear_from_out` for **From Perimeter** and `clear_from_in` for **From Center**.
- The Direct Android bridge previously only recognized legacy aliases `from_perimeter` and `from_center`, so the clear file could be skipped and the drawing pattern could immediately move to its own starting coordinate.
- Direct playback now maps both the current UI values and legacy aliases correctly.
- `clear_from_out.thr` is therefore inserted before the requested pattern and its first rho target is the physical perimeter (`rho=1`), after which rho is constrained monotonically toward center.
- `clear_from_in.thr` begins at center (`rho=0`) and progresses monotonically outward.
- `clear_sideway` is also mapped to its existing bundled clear file.

The measured Mini coupling, saved live calibration values, persistent single-socket streamer, exactly-once acknowledgement handling, final FluidNC `<Idle>` gate, Pi support, pattern library, Pattern Designer, Pattern Forge, branding, and license remain unchanged.
