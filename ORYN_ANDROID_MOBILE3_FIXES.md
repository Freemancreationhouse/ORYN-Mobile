# ORYN Android Standalone V10.4.1 Mobile3

## Cold-start offline fix

- Every new Android Activity launch starts on the embedded ORYN Mobile Offline Library, even if a physical table was the last selected table.
- Remembered/discovered ORYN tables are retained; only the startup active table is reset to the local embedded app.
- Native Wi-Fi discovery still runs automatically in the background, but discovery no longer auto-selects a table or forces a backend connection.
- A discovered table becomes active only after the user explicitly selects/connects it.
- Internal page reloads during the same Android Activity do not reset an explicitly selected remote table.
- A one-shot native `consumeFreshLaunch()` flag distinguishes a real app reopen from an in-app reload.

Pattern Forge Mobile2 fixes are preserved. Locked Pi motion/calibration behavior remains untouched.
