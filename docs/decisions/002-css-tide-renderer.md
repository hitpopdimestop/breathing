# ADR-002: Use a CSS composition for the first tide renderer

## Status

Accepted

## Date

2026-08-15

## Context

The active session needs a calm full-screen tide whose level follows the pure session timeline. The renderer must show rising inhale, receding exhale, stable holds, readable overlays, reduced-motion behavior, and good mobile performance without becoming a second timing system.

## Decision

Use a CSS composition for the MVP tide. The pure `tide-visual-state` mapping converts phase progress into a low level (`0.22`), high level (`0.76`), and one of four motion states. The React visual passes the level through a CSS custom property; CSS handles the soft boundary, gradient, texture drift, and reduced-motion fallback.

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
