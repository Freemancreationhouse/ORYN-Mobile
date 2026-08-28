# ORYN Android Standalone V10.4.1 Mobile2

This revision is based on the user-confirmed working Android standalone branch.

Fixed only the reported mobile issues:

1. **Pattern Forge artwork picker** — added the native Android WebView file chooser and enabled picker-granted `content://` access while raw `file://` access remains disabled.
2. **Pattern Forge phone layout** — converted the modal to a true single-column phone layout, removed horizontal clipping, constrained source/output previews to the phone width, and removed the sticky action overlap.
3. **Android system navigation overlap** — applies system-bar insets so the bottom Pattern Forge action is not covered by Android navigation controls.
4. **ORYN-only branding** — connected-table JSON, discovered table names, visible text, cached metadata, and mobile build markers are sanitized to ORYN. No DUNE branding is intentionally exposed by the mobile app.
5. **Motion/calibration behavior** — no Pi motion, homing, calibration, conversion, or controller mathematics were changed.

Pattern Forge route generation still uses the selected connected ORYN table's existing `/api/v2/pattern-generator/*` production endpoints, so the exact locked Pattern Forge converter remains the source of machine-ready routes. The phone can select and preview artwork locally; generation/save requires an ORYN table connection in this revision.
