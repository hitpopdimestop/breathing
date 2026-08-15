# Spec: Breathing

## Status

Approved for implementation planning. The capability map and this specification are approved; implementation must wait until the derived plan is approved.

## Objective

Breathing is a mobile-first, installable web app for guided breathing sessions. A person opens it, sees a ready-to-use `4–4–4–4` configuration, taps «Почати», and follows a full-screen visual tide through 15 complete cycles (`04:00`). The app must also work on desktop, support Ukrainian and English, preserve user settings locally, and run offline after its first successful load.

The MVP serves one job: guide a person through a configured breathing rhythm without requiring them to count silently or manage controls during the session.

## Tech Stack

- React and TypeScript for the interface and contracts
- Vite for local development and static production builds
- Zustand with narrowly scoped `persist` for settings and language
- `vite-plugin-pwa` for manifest, service worker, installation, and offline caching
- Vitest for unit/component tests
- Playwright for browser and installed-PWA flows
- CSS first for the tide prototype; Canvas or Paper.js only if the prototype proves CSS insufficient

Versions are pinned in `package.json` during Task 1 and must be documented in the lockfile.

## Commands

Task 1 must establish these executable scripts:

```text
yarn dev
yarn typecheck
yarn lint
yarn test
yarn build
yarn test:e2e
```

`yarn dev` runs the local app, `yarn typecheck` validates TypeScript, `yarn lint` checks style, `yarn test` runs fast tests, `yarn build` creates the deployable bundle, and `yarn test:e2e` checks the user flow in a real browser.

## Project Structure

```text
src/domain/       session-engine timing and validation
src/i18n/         typed Ukrainian and English dictionaries
src/store/        user-settings Zustand store and persistence
src/ui/           meditation-session screens and controls
src/visuals/      tide-visual renderer and visual tokens
src/pwa/          installable-pwa registration and update behavior
public/           manifest, icons, and static assets
e2e/              browser-level scenarios
specs/            module specifications
docs/             product and architecture documentation
tasks/            approved implementation plan and checklist
```

## Code Style

Use two-space indentation, named exports, PascalCase React components, camelCase functions/actions, and kebab-case filenames. Keep the timeline pure and independent of React renders and animation frames.

```ts
export function getCycleDurationSeconds(config: BreathConfig): number {
  return config.inhaleSeconds
    + config.holdAfterInhaleSeconds
    + config.exhaleSeconds
    + config.holdAfterExhaleSeconds
}
```

Do not persist active-session state. UI strings come from typed dictionaries rather than inline conditional translations.

## Testing Strategy

- `session-engine`: unit-test every phase boundary, countdown value, cycle boundary, and total duration.
- `user-settings`: test validation, full-cycle slider calculations, persistence, and schema migration behavior.
- React session flow: test start, preparation, phase changes, completion, and return-to-ready behavior.
- `tide-visual`: verify phase-to-visual mappings and readable text at representative progress points.
- `installable-pwa`: verify manifest, service worker, offline launch, installation metadata, and update behavior in a real browser.

Tests live beside source as `*.test.ts(x)`; Playwright scenarios live in `e2e/*.spec.ts`. There is no blanket coverage threshold yet, but all pure domain branches and user-critical flows require coverage.

## Boundaries

- **Always:** use the approved module boundaries; derive animation from elapsed session state; persist only settings and language; run focused tests before committing; keep UA/EN keys in parity.
- **Ask first:** add a dependency; change the persisted settings schema; introduce sound, vibration, presets, analytics fields, backend behavior, or a new public deployment target.
- **Never:** commit secrets or environment files; restore a session mid-breath after reload; make medical claims; let animation timing become the source of truth; add Next.js or a backend to the MVP.

## Success Criteria

- The default start screen shows `4–4–4–4`, `15 cycles`, and `04:00`.
- Inhale and exhale values validate from 1 through 20 seconds; hold values validate from 0 through 20 seconds; cycles validate from 1 through 50.
- A complete session runs through 15 cycles with exact phase timing and no visible session controls; clicking the session or pressing `Escape` cancels it and returns to the start screen.
- The current phase and `4 → 3 → 2 → 1` countdown remain synchronized with elapsed time.
- Custom settings change only at full-cycle boundaries and survive app restarts on the same installed device.
- Ukrainian and English flows have matching coverage, use browser locale for the initial language, and have no layout break from «Затримка дихання».
- The app installs as a PWA and completes a session offline after its first online load.
- The experience works at mobile and desktop viewport sizes.

## Open Questions

- Does best-effort Screen Wake Lock behave acceptably on the target mobile browsers?
- Does target-device testing reveal a reason to replace the accepted CSS tide with Canvas 2D?
- Does the service-worker update strategy preserve an active session on each target browser?

## Module Specifications

- [Session engine](specs/SPEC-session-engine.md)
- [Localization](specs/SPEC-localization.md)
- [User settings](specs/SPEC-user-settings.md)
- [Meditation session](specs/SPEC-meditation-session.md)
- [Tide visual](specs/SPEC-tide-visual.md)
- [Installable PWA](specs/SPEC-installable-pwa.md)
