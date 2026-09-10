# ORYN Android — SCARA V0.4 Full Control Hotfix 2

Fixes missing SCARA controller UI.

Added a robust SCARA CONTROL launcher whenever ORYN SCARA is the active machine. It does not depend on finding an existing Home button in the React DOM.

Controls:
- SET REFERENCE at +X / 152 mm
- HOME / CENTRE
- PERIMETER 152 mm
- STOP
- Automatic Home toggle
- Radius / Perimeter calibration test
- 30° rotation calibration test
- Full 360° calibration test
- Reference and current Theta/Rho status

Automatic Home behavior:
- After a successful Set Reference, if enabled, SCARA automatically moves to Centre.
- On reconnect, if the ESP32 still reports referenced=true, it automatically moves to Centre.
- After ESP32 power loss, manual Set Reference is still required because the current prototype has no absolute/home sensors. This is a physical limitation, not an app limitation.

Also fixes SCARA pattern-orientation control visibility.

The validated ESP32 V0.4 motion math, 76+76 mm geometry, 152 mm radius, pins, Pi mode and Direct FluidNC mode are unchanged.
