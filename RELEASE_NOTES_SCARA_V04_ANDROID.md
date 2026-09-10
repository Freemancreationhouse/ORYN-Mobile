# ORYN Android — SCARA V0.4 integration

Base: uploaded last Android source package.

## Added
- Third controller profile: **ORYN SCARA — ESP32**.
- SCARA connection button alongside existing Pi and Direct FluidNC flows.
- Auto probe using `oryn-scara.local`.
- AP fallback to `ORYN-SCARA` / `192.168.4.1`.
- Manual IP fallback.
- V0.4 `/api/device` verification before activation.
- Pattern upload from the existing offline ORYN library to SCARA ESP32.
- `.thr` orientation transform using the existing 0/90/180/270/custom control.
- Play, Pause, Resume, Stop, Center, Perimeter and status/progress mapping.
- Explicit **SCARA SET REFERENCE** control with physical 152 mm reference confirmation.
- SCARA Wi-Fi status/network endpoint routing.

## Preserved
- Existing Raspberry Pi mode.
- Existing Direct ESP32 / FluidNC mode and its calibrated motion engine.
- Offline 100-pattern library.
- Pattern Designer / Pattern Forge assets.
- Existing Android background FluidNC playback service.
- Existing branding/UI bundle.

## SCARA baseline expected by this app
- ORYN SCARA Firmware V0.4 API v1.
- Arms: 76 mm + 76 mm.
- Full radius: 152 mm.
- ESP32 AP fallback: `ORYN-SCARA`, `192.168.4.1`.

## Safety behavior
The app does not silently redefine the SCARA home/reference. The mechanism must be physically placed at the validated +X 152 mm straight-arm reference before **SCARA SET REFERENCE** is confirmed.
