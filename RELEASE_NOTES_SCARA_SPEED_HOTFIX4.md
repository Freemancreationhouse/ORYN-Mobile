ORYN Android — SCARA High-Speed Hotfix 4

- SCARA default drawing speed changed from 7 to 60 mm/s.
- SCARA speed is selectable from 10 to 100 mm/s.
- Existing app /set_speed now controls ESP32 V0.5 /api/speed.
- Added speed slider + APPLY SPEED inside SCARA CONTROL.
- Selected speed is remembered and re-applied on reconnect.
- Preview elapsed/remaining time uses the selected SCARA speed.
- Pi and Direct FluidNC modes are unchanged.

Requires ORYN SCARA ESP32 Firmware V0.5 High-Speed.
