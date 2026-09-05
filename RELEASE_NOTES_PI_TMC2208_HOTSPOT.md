# ORYN Android V10.4.1 — Pi TMC2208 + Phone-Hotspot Sync

Build marker: **ORYN-ANDROID-V10.4.1-PI-TMC2208-HOTSPOT-20260905-1**

## Hardware baseline

This Android build targets the confirmed working ORYN Pi baseline:

- Raspberry Pi ORYN backend
- Arduino Uno + CNC Shield / GRBL
- TMC2208 standalone STEP/DIR
- No CNC-shield microstep jumpers
- TMC2208 external input resolution: 1/8
- GRBL migration values verified from the user's prior A4988 full-step calibration: `$100=205.000`, `$101=143.504`
- Pi backend build: `UC-DUNE-MOTION-V9-TMC2208-UNO-GRBL-HOTFIX-20260905-2`

The Android app does not reproduce or alter the Pi's Theta–Rho motor mathematics. Pi mode sends commands to the Pi backend, so the now-working Pi calibration remains authoritative.

## Android connection behavior

The existing locked mobile architecture is preserved:

- opens as a complete ORYN Offline app;
- keeps the bundled 100-pattern library, Pattern Designer and Pattern Forge;
- scans for an ORYN Pi at `oryn.local:8080`, `oryn.local`, then private IPv4 /24 subnets;
- supports manual Pi URL/IP fallback;
- the subnet scan includes private interfaces exposed while the Android phone is providing a hotspot/tether network;
- existing Direct ESP32 mode remains available and unchanged.

For phone-hotspot use, connect the Pi to the phone's hotspot SSID. Then open ORYN Android and press **Scan for ORYN**. If discovery is blocked by a particular Android tether implementation, use **Add ORYN Pi Manually** with the Pi address shown in the phone's hotspot connected-device list, normally `http://<PI-IP>:8080`.

## TMC2208 UI sync

The bundled core UI and Universal Machine Profile helper are synced from the confirmed working Pi TMC2208 hotfix. The standalone TMC2208 choices are restricted to `1/2`, `1/4`, `1/8`, `1/16`, and the UI explains that no MS jumpers means `1/8` for this TMC2208 setup.

Offline fallback metadata was also corrected so it no longer exposes invalid TMC2208 1/32–1/256 jumper selections.

## Preserved Android fixes

- saved pattern orientation: 0°, 90°, 180°, 270° and custom degrees;
- background Direct ESP32 playback service;
- Wi-Fi scan and Smart Connect;
- Pattern Forge Android file picker;
- Pattern Designer save-to-library bridge;
- manual IP connection;
- all existing branding and offline assets.
