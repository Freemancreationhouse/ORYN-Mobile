ORYN Direct ESP32 V10.4.1 Direct3.3 Core Fix

Purpose
- Fix "Failed to load patterns / 0 patterns" after activating ESP32 Direct.
- Fix Direct ESP32 machine connection state in the normal ORYN UI.
- Fix Home dispatch so the full homing sequence is not sent as one untracked Telnet block.

Key changes
1. Single-origin Direct bridge
   - The ORYN UI remains served from http://app.oryn.
   - Selecting ESP32 Direct no longer changes the frontend API origin to http://direct.oryn.
   - Bundled offline pattern library therefore remains available while ESP32 Direct is active.
2. Direct machine endpoints are selectively routed to the native FluidNC bridge.
3. WebSocket status on app.oryn dynamically reports the Direct controller connection/motion state.
4. /connect now probes FluidNC instead of returning a fake success.
5. Native Direct Home runs asynchronously, reports is_homing, waits for FluidNC Idle, then sets X/Y logical origin to 0.
6. Multi-line Direct actions are sent line-by-line and wait for each FluidNC response.
7. Native-generated Pattern Designer .thr previews are supported in the local library.

Preserved
- Pattern Designer files/generator implementation unchanged.
- Bundled .thr library files unchanged.
- Theta/Rho conversion unchanged:
  X = theta / (2*pi) * saved theta revolution units
  Y = rho * saved rho travel units * rho direction
- Smart Wi-Fi connection flow retained.
- Android safe-area fix retained.

CURRENT TABLE IMPORTANT
Do not reflash or replace the ESP32 configuration just to install this Android update.
Your current ESP32 already moved both motors in FluidNC manual tests. Keep that controller configuration and only use the corrected app.
For the current small Dune Weaver Mini calibration, the values previously verified from the locked ORYN logs are:
- Theta full revolution: 78.00000 controller units
- Rho center to perimeter: 51.95800 controller units
- Rho direction: +1
- Physical radius: 110 mm (not entered in the controller-unit field)
Start Direct app feed at 60 for the first safe test.
