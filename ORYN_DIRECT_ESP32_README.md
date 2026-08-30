# ORYN Direct ESP32 Prototype 1

Baseline preserved: ORYN Android Standalone V10.4.1 Mobile3 / locked PF-PRO-V10.4.1 assets.
This is a separate experimental branch. It does not modify the locked Pi package.

## What this build adds
- `Add ESP32 Direct` in the Sand Tables menu.
- Direct FluidNC probe over Wi-Fi/Telnet port 23.
- No Raspberry Pi and no USB required during normal operation.
- Local ORYN pattern library stays inside the Android app.
- Local THR is converted in the Android app using the saved calibration values entered during Direct setup:
  - X = theta/(2*pi) * saved theta revolution units
  - Y = rho * saved rho travel units * saved rho direction
- Direct Play, Stop, Pause, Resume, Home, Centre, Perimeter, coordinate move, and speed mapping.
- Direct status/progress is bridged back into the existing ORYN UI.

## Controller requirements
- ESP32 running FluidNC with Wi-Fi enabled.
- Telnet enabled on port 23.
- X = THETA, Y = RHO.
- FluidNC Cartesian/empty kinematics; ORYN performs Theta/Rho conversion.
- For the existing 28BYJ-48 + ULN2003 profile use the already prepared FluidNC v3.8.3 configuration.

## First test
1. Flash/configure the ESP32 and confirm `$I` works.
2. Connect the phone to the ESP32 AP (normally 192.168.0.1) or the same LAN as the ESP32.
3. Open ORYN.
4. Sand Tables -> `Add ESP32 Direct`.
5. Enter ESP32 IP, saved theta revolution units, saved rho travel units, rho direction, and a conservative feed.
6. First use Centre/Perimeter only after the mechanism is in a safe known position.
7. Test a simple pattern at low feed.

## Safety / prototype scope
This is Prototype 1. Pattern Forge and the offline library remain present, but not every Pi-only system/settings endpoint is mapped to the ESP32 direct transport yet. Direct pattern execution and core motion are implemented. Do not treat this as the replacement for the locked Pi baseline until physical-table testing is completed.

## Build
Use `BUILD_APK_WINDOWS.ps1` on Windows with Android Studio / Android SDK Platform 35 installed.
Output version: `10.4.1-direct1`.
