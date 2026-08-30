# ORYN Direct ESP32 V10.4.1 — Direct2 + Pattern Designer

Build: `ORYN-DIRECT-ESP32-V10.4.1-DIRECT2-PD-20260831-1`

This is a separate Pi-free ORYN edition. Android communicates directly with an ESP32 running FluidNC over Wi-Fi/Telnet port 23. The locked Raspberry Pi and standard ORYN builds are not modified.

## Included
- Existing ORYN Mobile standalone/offline pattern library.
- Existing Direct ESP32 transport: probe, Play, Stop, Pause, Resume, Home, Centre, Perimeter, coordinate move and speed.
- X = Theta, Y = Rho conversion using the calibration values saved in Direct setup. No hard-coded table calibration values.
- ORYN Pattern Designer V2.0 Pro, 77 generators, Cartesian and Theta–Rho/Polar modes.
- Pattern Designer output can be saved into a persistent Android-local Direct library and then played straight to the ESP32.
- Android file export for THR, G-code, SVG, CSV, JSON and PNG.
- Android 15 safe-area correction for the bottom ORYN navigation.
- FluidNC 3.8.3 28BYJ-48/ULN2003 controller config under `esp32-fluidnc-config/`.

## No Pi required
Normal Direct operation is:

`ORYN Android app -> Wi-Fi -> ESP32 FluidNC -> X/Theta + Y/Rho motors`

The app retains Pi discovery only so the same build can still see a normal ORYN table, but Direct ESP32 mode does not use a Pi backend.

## First setup
1. Flash/configure the ESP32 with FluidNC 3.8.3 and the included `config.yaml` for the 28BYJ/ULN2003 controller profile, or use your compatible STEP/DIR FluidNC profile.
2. Confirm `$I` over FluidTerm/WebUI.
3. Connect the phone to the ESP32 AP (normally `192.168.0.1`) or the same LAN.
4. ORYN -> Sand Tables -> **Add ESP32 Direct**.
5. Enter the ESP32 host/IP.
6. Enter your saved Theta full-revolution controller units and saved Rho centre-to-perimeter controller units. These are machine calibration values, not FluidNC steps/mm.
7. Enter Rho direction (`1` or `-1`) and a conservative feed.
8. Test Centre/Perimeter from a safe known physical position before pattern playback.
9. Open Pattern Designer, generate a simple Spiral, **Save to ORYN Library**, return to Browse and play it at low feed.

## Important motion rule
ORYN performs the Theta/Rho conversion. FluidNC stays Cartesian/empty kinematics. Do not add a second polar transform in FluidNC.

## Status
This source is the Direct2 integration candidate. It is intentionally separate from the locked Pi baseline until physical-table testing confirms direct motion, clearing and generated-pattern playback.
