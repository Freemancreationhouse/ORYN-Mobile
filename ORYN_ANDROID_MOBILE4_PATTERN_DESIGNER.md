# ORYN Android Mobile4 — Pattern Designer integration

Build: `ORYN-ANDROID-MOBILE4-PD-20260831-1`

This build starts from the proven Mobile3 cold-start-fixed source and adds the working ORYN Pattern Designer V2.0 Pro as an isolated local Android asset.

## Added
- Pattern Designer launcher beside Pattern Forge on Browse Patterns.
- 77-generator Pattern Designer available even when the phone is offline.
- Cartesian / XY and Theta–Rho / Polar modes preserved.
- When a real ORYN table is selected, **Save to Connected ORYN** posts generated THR to that table's `/api/pattern-designer/save` bridge.
- THR, G-code, SVG, CSV, JSON and PNG exports use Android's system document saver through the existing WebView native bridge.
- Mobile responsive layout for the Pattern Designer page.

## Preserved
The embedded ORYN React bundle, offline pattern catalog, cached previews, Mobile3 cold-start behavior, table discovery, Pattern Forge implementation, machine-control routing, branding patches and all existing mobile functionality are left unchanged except for the additive launcher and native export bridge.

## Pi requirement for direct library save
The connected Pi must contain the Pattern Designer integration endpoint `/api/pattern-designer/save` (the Pi build already tested in this project does). Pattern generation and file export do not require a Pi.
