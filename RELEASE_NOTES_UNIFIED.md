# ORYN V10.4.1 — Unified Connection Rebuild

Build marker: `ORYN-ANDROID-V10.4.1-UNIFIED-CONNECTION-20260901-1`

This build consolidates the Android offline, Raspberry Pi and Direct ESP32 connection paths into one deterministic machine-state model.

## Connection-state rebuild

- Cold launch is always `ORYN Offline` while keeping offline patterns and saved Direct calibration/IP.
- Direct ESP32 is one dedicated machine identity, not a fake Pi/known-table entry.
- Stale `ORYN Offline <ESP32 IP>` / duplicate Direct rows from older builds are removed at cold start.
- Manual IP connection probes FluidNC asynchronously and only activates Direct mode after a real FluidNC response.
- Direct activation creates one current Direct identity and one Offline switch target, preserving genuine Pi entries.
- Pi discovery cannot overwrite or duplicate an active Direct ESP32 machine.
- Direct connection uses the saved numeric controller IP when available.

## Wi-Fi / hotspot discovery

- `Find ESP32 on Current Network` first probes the last-known IP.
- Then it tries `fluidnc.local`.
- Then it scans all private IPv4 interfaces, including phone-hotspot/tether interfaces rather than relying only on Android's default Internet interface.
- Wi-Fi credentials can be written to FluidNC while it is reachable over either its AP or a LAN/hotspot IP.

## Preserved motion behavior

The existing Direct playback, Home, Theta–Rho conversion, live calibration, planner back-pressure handling, Stop/Pause/Resume, and wait-for-Idle completion logic are retained. This connection rebuild does not replace the saved machine calibration values.
