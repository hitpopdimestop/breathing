# ADR-002: Use a CSS composition for the first tide renderer

## Status

Accepted

## Date

2026-08-15

## Context

The active session needs a calm full-screen tide whose level follows the pure session timeline. The renderer must show rising inhale, receding exhale, stable holds, readable overlays, reduced-motion behavior, and good mobile performance without becoming a second timing system.

## Decision

Use a CSS composition for the MVP tide. The pure `tide-visual-state` mapping converts phase progress into a level from `0` to `1` and one of four motion states. The React visual passes the level through a CSS custom property; CSS handles the boundary, gradient, and reduced-motion fallback.

## Full-screen geometry invariant

The tide must be completely absent at the low extreme and cover the entire viewport at the high extreme. The SVG boundary uses only a subtle bend and stays above the `viewBox`; the renderer maps the low level to a `112%` vertical offset and the high level to `0%`. This prevents a visible strip at either edge while keeping the wave visible between extremes. The offset mapping and path geometry are covered by unit and browser regression tests.

## Alternatives Considered

### Canvas 2D

Canvas could draw a more organic path, but the current CSS prototype already communicates direction and holds with fewer moving parts. Revisit it only if real-device testing shows the boundary is too curtain-like or CSS performance is insufficient.

### Paper.js

Paper.js would add a dependency and abstraction layer before direct Canvas is proven necessary. It is deferred.

### Three.js

Three.js is outside the visual need and would add unnecessary 3D complexity.

## Consequences

- Timing remains owned by `session-engine`; the renderer consumes derived state only.
- The MVP avoids a runtime animation dependency and keeps the offline bundle small.
- Visual polish can evolve through CSS tokens and shapes without changing session contracts.
- A future Canvas experiment must be measured on target mobile devices and documented as a superseding decision.
