ORYN Android V10.4.1 — SCARA V0.4 Integration

Base:
- User-provided latest Android source package.

Added:
- ORYN SCARA ESP32 as a third controller mode.
- Connect via oryn-scara.local.
- ORYN-SCARA AP fallback (192.168.4.1).
- Manual IP fallback.
- Existing ORYN offline pattern library -> SCARA upload/play.
- Play / Pause / Resume / Stop.
- Center / Perimeter.
- SCARA SET REFERENCE safety control.
- Existing 0° / 90° / 180° / 270° / custom orientation applied to SCARA THR playback.
- SCARA status/progress mapping.
- SCARA Wi-Fi status/network API routing.

Preserved:
- Raspberry Pi mode.
- Direct ESP32 / FluidNC mode.
- Existing Direct coupled-motion core.
- Existing offline pattern library.
- Pattern Designer / Pattern Forge assets.
- Existing Android foreground playback service.

Required SCARA firmware:
- ORYN SCARA ESP32 Firmware V0.4
- API controller id: oryn_scara
- 76 mm + 76 mm arms
- 152 mm full radius

Build:
- Push this complete project to the existing GitHub repository.
- GitHub Actions workflow builds:
  ORYN-V10.4.1-SCARA-V04-debug.apk
- Or build locally with Gradle/Android SDK 35.

Important:
- The physical SCARA reference is NOT set automatically.
- Place the mechanism at the validated +X, 152 mm straight-arm position,
  then press SCARA SET REFERENCE.
