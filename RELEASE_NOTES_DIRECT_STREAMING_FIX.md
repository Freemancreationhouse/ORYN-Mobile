# ORYN V10.4.1 — Direct ESP32 Persistent Streaming Fix

Build: `ORYN-ANDROID-V10.4.1-DIRECT-PERSISTENT-STREAM-20260901-2`

Physical retest of the preceding measured-motion build showed Direct clearing still stopping after roughly 2–3 revolutions even though FluidNC later reported Idle. This revision changes only the Direct ESP32 pattern streaming transport.

- Replaces per-command raw TCP chunk reading with one persistent FluidNC response reader for the entire clear + pattern session.
- Frames `ok`, `error`/alarm, and `<status>` independently.
- Handles acknowledgement fragmentation across TCP reads.
- Strips Telnet negotiation bytes.
- Enables TCP_NODELAY and keepalive.
- Keeps Android Wi-Fi/CPU awake only while Direct playback is active.
- Does not resend uncertain relative movement.
- Does not add any timeout-based completion or 15-second abort.
- Still requires every THR point acknowledgement and final explicit `<Idle>`.
- Preserves the measured 256 / (6.25 × 210) negative coupling and all saved live calibration values.
