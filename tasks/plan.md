# Implementation Plan: Breathing

Status: **Implementation in progress; Tasks 1–6 are complete and Task 7 is next.**

## Outcome

Deliver a mobile-first, installable Breathing PWA with a one-tap `4–4–4–4` session, 15 complete cycles (`04:00`), Ukrainian and English interfaces, local settings, an organic full-screen tide, and offline operation after the first successful load.

## Fixed decisions

- React + TypeScript + Vite; no Next.js, backend, accounts, or remote runtime data.
- Zustand `persist` stores only phase settings, cycle count, and language with explicit `partialize` and migration.
- Inhale/exhale: `1–20` seconds; holds: `0–20` seconds; cycles: `1–25`.
- Browser locale chooses the initial language: `uk` → Ukrainian, everything else → English.
- The session is driven by elapsed time, ends only after a full cycle, and has no pause, exit, or total-time control.
- Installation UI is browser/system-owned. Breathing renders no custom install banner, help screen, or fallback instructions.
- Screen Wake Lock is best-effort and silent on unsupported or failed requests.
- The visual renderer is selected by a throwaway CSS-first motion spike; Canvas 2D is compared only if CSS is too curtain-like, and Paper.js is not a default dependency.

## Dependency graph

```text
Task 1: foundation
  ├── Task 2: session-engine ──┐
  └── Task 3: localization ───┼── Task 4: user-settings
                              └── Task 5: meditation-session
                                      ├── Task 6: tide motion spike
                                      └── Task 7: production visual
                                              └── Task 8: installable PWA
                                                      └── Task 9: release checks
```

## Phases and checkpoints

### Phase 1 — Foundation and pure contracts

1. Scaffold React, TypeScript, Vite, linting, type-checking, Vitest, Playwright, and the required `yarn` scripts.
2. Implement the pure `session-engine` with phase boundaries, countdowns, cycle math, completion, and delayed-callback catch-up.
3. Implement typed Ukrainian and English dictionaries with browser-locale initialization and key-parity checks.

**Checkpoint:** the project builds, all pure tests pass, and no timing or translation contract depends on React, storage, or animation.

### Phase 2 — Settings and complete user flow

4. Add the validated Zustand settings store, persisted schema migration, cycle-duration summary, and settings UI.
5. Build start, preparation, active, and completion states around an immutable configuration snapshot; use a placeholder visual until the motion spike is selected.

**Checkpoint:** a shortened browser test can start, cross every phase, complete, repeat, and abandon without restoring partial runtime state.

### Phase 3 — Tide visual and responsive experience

6. Compare a one-cycle CSS composition with Canvas 2D only if needed; record the decision using phase mapping, hold behavior, reduced motion, and mobile performance.
7. Integrate the chosen renderer, morning-mist tokens, readable overlays, responsive layout, and calm completion state without moving timing into the view.

**Checkpoint:** a full `04:00` session remains understandable and smooth on representative mobile and desktop viewports.

### Phase 4 — Installable offline product

8. Add the manifest, original tide-mark icons, standalone metadata, service-worker caching, safe update behavior, and best-effort wake lock. Verify native install affordances without adding app-owned install UI.
9. Run the full browser/device matrix, publish the static app, and optionally add only anonymous open/start/complete analytics after a separate decision.

**Checkpoint:** the published app installs where supported, opens offline after one online load, completes a session, and does not interrupt an active session during an update.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Visual tide is decorative but unclear | Prototype phase direction and countdown before polishing. |
| Frame drops or hidden tabs desynchronise the guide | Derive every state from elapsed time, never frame count. |
| Device sleeps during a session | Request Screen Wake Lock when supported; continue silently if it fails. |
| Service-worker update interrupts a session | Activate updates only outside an active session or on the next launch. |
| Install behavior differs by platform | Test browser/system affordances on supported Android and iOS devices; ship no custom banner. |
| Ukrainian text overflows | Test the longest phase label at narrow mobile widths and keep overlays independent. |

## Parallel work

After Task 1, Tasks 2 and 3 can proceed in parallel. The motion spike may begin once the session state contract is stable, but production visual integration waits for Task 5. PWA packaging and release checks wait for the complete flow and chosen renderer. No post-MVP feature (sound, vibration, presets, history, accounts, or analytics fields) enters these phases without a new decision.
