# ORYN Android V10.4.1 — Direct Playback State Fix

This full-source build is based on the uploaded Unified Motion Parity package. It changes only the Direct ESP32 connection/playback state path.

## Corrected

- Successful Direct ESP32 activation now queues one automatic Home when Home-on-connect is enabled.
- The existing player receives live `elapsed_time` and `remaining_time` values instead of displaying `--:--` throughout playback.
- Pattern playback owns one exclusive, persistent FluidNC connection from controller-profile read through the final `<Idle>` state.
- FluidNC replies are framed as complete command/status records; a socket read timeout is waiting/backpressure and never completion.
- The stream consumes every THR point once and never resends an uncertain relative movement.
- The completed session closes cleanly and allows the second and later patterns to start normally.
- Direct Stop does not leave a stop flag armed while no motion is active.
- Clear From Center accepts `from_center` and `clear_from_in`; Clear From Perimeter accepts `from_perimeter` and `clear_from_out`.
- Measured Mini coupling is preserved as X=256, Y=210, gear ratio=6.25, negative X→Y compensation.

## Preserved

Pi support, the offline pattern library, Pattern Designer, Pattern Forge, Home and calibration behavior, UI/branding, saved live calibration values, and the non-commercial license are unchanged.
