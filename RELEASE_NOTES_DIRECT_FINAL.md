# ORYN Android V10.4.1 — Direct Final

This final Android source keeps the established ORYN UI, calibration, Pi support, Pattern Forge, 100 offline patterns, branding and non-commercial license unchanged.

## Final corrections

- Settings → **Open WiFi Setup** now opens ORYN Android Smart Wi-Fi directly in both Offline and Direct modes instead of entering the Raspberry Pi-only route.
- The legacy Wi-Fi endpoint shapes were corrected so the Settings renderer cannot crash into a blank screen if that route is reached.
- Pattern Designer now recognizes the active `ORYN Direct — ESP32 FluidNC` table as a native ORYN Library target.
- **Save to ORYN Library** calls Android storage directly from the standalone Designer page, requires an explicit native success response, and returns its canonical `custom/*.thr` path.
- Browse merges the saved Android patterns with the 100 bundled patterns, so its count becomes 101, 102, and onward after returning or refreshing.
- Direct running, pause, Home, controller, timer, kinematics and FluidNC socket state now belong to the foreground app process instead of one Activity screen.
- Reopening ORYN while a pattern is running reattaches to that live session; it does not disconnect, treat the screen as a cold launch, or start automatic Home over the pattern.
- The foreground service continues the acknowledged FluidNC stream while the app is backgrounded.

## Retained fixes

- FluidNC-side 2.4 GHz network detection and acknowledged Wi-Fi settings writes.
- Home Wi-Fi, phone hotspot, current-network discovery and manual IP connection.
- One exclusive Direct FluidNC motion stream through every THR point and final `<Idle>`.
- Measured Mini coupling `256 / (6.25 × 210)` with negative X-to-Y compensation.
- Correct clear directions: Center → Perimeter and Perimeter → Center.

If Android force-stops the application or kills its process, an uncertain relative movement is never automatically resent. Normal app switching and Activity recreation are supported while the foreground playback service remains alive.
