# ORYN Android V10.4.1 — Visible Pattern Orientation Fix

This release fixes the missing Direct ESP32 **Pattern orientation** control in
the Pattern Details play sheet.

## Corrected

- The control now attaches to the current sheet's actual Clear-option radio
  group instead of a heading/class removed by the newer ORYN UI bundle.
- Available choices are **0°**, **90°**, **180°**, **270°**, and a custom degree
  value.
- The selected value is retained in Android WebView local storage and is reused
  for later individual patterns and playlists.
- The offset is passed only to the selected pattern. Clear patterns are not
  rotated.
- Native playback adds the angular offset in memory and continues streaming the
  original stored THR points. No library `.thr` file is rewritten.

## Preserved

Direct FluidNC streaming, measured Theta/Rho coupling, Home and calibration,
Wi-Fi switching, Pi support, background playback, generated-pattern saving,
the 100 bundled patterns, Pattern Designer, Pattern Forge, branding, UI, and
licensing are unchanged.
