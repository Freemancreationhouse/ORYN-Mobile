# ORYN Android V10.4.1 — Direct ESP32 WebSocket Stream Fix

Build marker: `ORYN-ANDROID-V10.4.1-DIRECT-WS-STREAM-20260901-4`

## Reason for this build

Physical testing showed Direct ESP32 playback could still stop after a few turns even when **no clear pattern** was selected. That proves the remaining failure was in the native Direct pattern transport rather than the clear-selection bridge.

## Direct-pattern-only correction

- Direct pattern playback now uses one persistent FluidNC Grbl WebSocket motion channel on port `81`.
- Home, Full Circle calibration, Perimeter calibration, manual moves, controller probing, Pi support, Wi-Fi connection flows, Pattern Designer, Pattern Forge, UI/branding and the pattern library are not redesigned.
- The pattern session itself performs its FluidNC machine/steps read on the same WebSocket channel before movement, so pattern playback does not open a second Telnet client.
- Every THR point still sends exactly one coordinated relative command:
  `G91 G21 G1 X... Y... F...`
- The sender waits for that command's real FluidNC `ok` or `error` before advancing.
- Socket read timeout is waiting/backpressure only; there is no fixed playback/acknowledgement abort.
- An uncertain relative move is never resent.
- WebSocket text/binary reply messages are parsed separately, so FluidNC management messages such as `CURRENT_ID`, `ACTIVE_ID` and `PING` cannot become concatenated with a later `ok` acknowledgement.
- WebSocket protocol ping frames are answered with pong.
- Explicit Stop sends one FluidNC realtime Ctrl-X on the active WebSocket channel and closes it.
- Completion still requires every THR coordinate to be acknowledged, followed by an explicit FluidNC `<Idle>` status.
- Clear patterns use exactly the same streamer.

## Measured Mini coupling retained

- `gear_ratio = 6.25`
- `X_steps_per_mm = 256`
- `Y_steps_per_mm = 210`
- coupling = `0.19504761904761905`
- `X+5` coupling compensation = approximately `Y-0.975238095`

Saved Full Circle, Perimeter and rho-direction values remain live runtime inputs and are not hardcoded.
