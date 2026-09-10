# ORYN Android — SCARA Preview + Timing Hotfix 3

## Fixed
- Now Playing keeps the local ORYN pattern name instead of the ESP32 temporary filename `oryn_app_current.thr`.
- Expanded Now Playing loads the correct local Theta–Rho coordinates, restoring the synchronized path preview.
- SCARA progress now publishes the real pattern point total instead of making total equal to the current point.
- Estimated elapsed and remaining times are calculated from the actual local THR path length at the validated 152 mm radius and the SCARA 7 mm/s draw speed.
- Preview progress follows `played_points`, so the path trace advances with the physical pattern.

## Homing
- Existing Automatic Home after Set Reference / reconnect remains intact.
- The control panel now accurately identifies the remaining power-cycle limitation: true absolute homing after complete ESP32 power loss requires physical reference sensors because 28BYJ + ULN2003 provides no stall or absolute-position feedback.
- GPIO32 / GPIO33 are reserved as the intended two Hall/home sensor inputs for a future true power-on homing firmware update.

## Preserved
- Raspberry Pi mode
- Direct ESP32 / FluidNC mode
- SCARA V0.4 motion API and validated 76 + 76 / 152 mm geometry
- Pattern library, Pattern Designer, Pattern Forge, playlists, orientation control
