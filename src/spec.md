# Specification

## Summary
**Goal:** Replace the Google Maps-based ground with a locally generated, deterministic procedural world (terrain + buildings) that streams around the aircraft without requiring an API key.

**Planned changes:**
- Remove the Google Maps dependency, including any VITE_GOOGLE_MAPS_API_KEY gating/config checks and related error UI in the main sim view.
- Implement a procedurally generated terrain surface (with visible elevation variation) that is generated locally and updates/extends as the aircraft moves to avoid flying beyond the environment.
- Add procedurally generated buildings/structures with varying placement/density, streaming consistently as the aircraft moves and avoiding overlap at the aircraft spawn/reset location.
- Make procedural generation deterministic for a given seed and integrate it with the reset flow so resets restore a clean scene (no duplicated chunks/objects) and apply a consistent seed behavior on reset.

**User-visible outcome:** The simulator runs without any Google Maps API key, and flying shows an endlessly updating procedural terrain with buildings that stream in predictably based on a seed and reset cleanly.
