# ADR-001: Use React, TypeScript, Vite, and Zustand

## Status

Accepted

## Date

2026-08-15

## Context

Breathing is a small client-only application with four main interface states: start, settings, active session, and completion. It needs an exact timer, a full-screen animated visual, two languages, local settings, PWA installation, and complete offline operation after the first load. It does not need server rendering, a backend, a database, authentication, or server-side routing.

The project should remain simple now while leaving room for later presets, optional sound design, and a possible native application if real usage justifies it.

## Decision

- Use **React** for interface composition and explicit screen/state boundaries.
- Use **TypeScript** for the breathing timeline, configuration, persisted schema, and component contracts.
- Use **Vite** for local development and static production builds.
- Use **vite-plugin-pwa** for the web app manifest, service worker generation, installation, and offline asset caching.
- Use **Zustand** for application settings and language.
- Use Zustand `persist` with an explicit `partialize` rule so only the breathing configuration and language are written to `localStorage`.
- Version the persisted schema and provide migrations when its structure changes.
- Keep the active session, current phase, countdown, animation progress, and installation prompts transient. Reloading the page always returns to the start screen rather than restoring a session mid-breath.
- Keep the animation rendering technology open until a focused motion prototype compares a CSS-based tide with a Canvas-based tide.

## Alternatives Considered

### Vanilla TypeScript with Vite

- Pros: few dependencies and a small runtime.
- Cons: screen transitions, settings, localization, and future feature growth require more custom organization.
- Rejected: React adds useful structure at acceptable cost for this project.

### Next.js

- Pros: an integrated full-stack framework and a migration path if the product later needs server-rendered or server-side features.
- Cons: Breathing currently needs none of those capabilities and can be deployed as a static client application.
- Rejected: unnecessary surface area for the MVP. A future server-backed product can be reconsidered from the product documentation rather than pre-built now.

### Manual React state and direct localStorage access

- Pros: avoids a state-management dependency.
- Cons: requires custom hydration, validation, persistence selection, and future schema migration handling.
- Rejected: Zustand provides a small, explicit home for durable settings, provided persistence remains narrowly scoped.

### Persist the entire Zustand store

- Pros: minimal initial configuration.
- Cons: would save transient session and animation state, creating invalid restoration behavior after refreshes and future schema changes.
- Rejected: only stable user preferences belong in storage.

### Choose Paper.js or another animation library immediately

- Pros: may simplify organic vector/path animation if the final visual requires it.
- Cons: the required effect may be achievable with a few composited CSS layers, making an additional rendering abstraction unnecessary.
- Deferred: select a rendering method from an actual one-cycle motion prototype, not from assumptions.

## Consequences

- The application remains a static deployment with no backend operations.
- Settings persist on one device but do not synchronize between devices.
- Timer correctness remains independent from React renders and visual frame rate.
- The animation consumes normalized progress from the session model; it never owns or advances breathing time.
- Adding presets later changes the configuration model but does not require replacing the application stack.
- A separate ADR will record the animation renderer if the motion prototype selects a non-trivial library.
