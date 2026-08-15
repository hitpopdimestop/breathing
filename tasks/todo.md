# Breathing Task Checklist

This checklist follows the approved [`SPEC.md`](../SPEC.md) and [`tasks/plan.md`](plan.md). Complete tasks in order unless a dependency explicitly allows parallel work.

## Phase 1 — Foundation and pure contracts

### Task 1: Scaffold the application

**Description:** Create the React + TypeScript + Vite app and establish the agreed quality gates without adding a backend.

**Acceptance criteria:**

- [x] `yarn dev`, `yarn typecheck`, `yarn lint`, `yarn test`, `yarn build`, and `yarn test:e2e` exist and run.
- [x] The start route renders at mobile and desktop viewport sizes.
- [x] Versions and the stack decision are recorded in `package.json`, the lockfile, and the ADR.

**Verification:** Run all six scripts; open the start route in a real browser.

**Dependencies:** None
**Likely files:** `package.json`, `src/`, `e2e/`, `README.md`
**Scope:** Medium

### Task 2: Implement `session-engine`

**Description:** Build a pure elapsed-time model for `inhale → hold-after-inhale → exhale → hold-after-exhale`.

**Acceptance criteria:**

- [x] `4–4–4–4` produces a 16-second cycle and 240 seconds for 15 cycles.
- [x] Exact boundaries return the next phase with a fresh `4 → 3 → 2 → 1` countdown.
- [x] Completion occurs only at the total duration; delayed callbacks catch up correctly.

**Verification:** Unit-test time zero, one millisecond before and at every boundary, cycle transitions, completion, and representative skipped timestamps.

**Dependencies:** Task 1
**Likely files:** `src/domain/session-engine.*` and tests
**Scope:** Small

### Task 3: Add typed localization

**Description:** Add parity-checked Ukrainian and English dictionaries for every Breathing-owned label.

**Acceptance criteria:**

- [x] Both dictionaries have identical keys and concise phase labels.
- [x] Browser locale maps `uk` to Ukrainian and every other locale to English.
- [x] No component contains inline translated strings; missing keys fail in development.

**Verification:** Test key parity and render start, settings, active, and completion states in both languages.

**Dependencies:** Task 1
**Likely files:** `src/i18n/` and tests
**Scope:** Small

### Checkpoint: Foundation

- [x] All six scripts pass.
- [x] The timing model and dictionaries are independent of React, storage, and animation.
- [x] Human review confirms the contracts before UI behavior is built.

## Phase 2 — Settings and complete flow

### Task 4: Implement `user-settings`

**Description:** Add validated phase controls, the integer cycle slider, language selection, and narrow Zustand persistence.

**Acceptance criteria:**

- [x] Inhale/exhale accept `1–20`; holds accept `0–20`; cycles accept `1–50`.
- [x] The default is `4–4–4–4`, 15 cycles, shown as `15 cycles · 04:00` (localized).
- [x] `persist` saves only settings and language with `partialize`, a schema version, and migration; runtime state is never saved.

**Verification:** Test bounds, duration math, malformed storage, migration, reset-to-default, and refresh behavior.

**Dependencies:** Tasks 2 and 3
**Likely files:** `src/domain/breathing-config.*`, `src/store/`, `src/ui/settings.*`
**Scope:** Medium

### Task 5: Build `meditation-session`

**Description:** Connect the start, preparation, active, and completion states to an immutable configuration snapshot.

**Acceptance criteria:**

- [x] One tap starts the default session after `3 → 2 → 1` preparation.
- [x] Active state shows only phase label, phase countdown, and visual placeholder—no visible controls; clicking the session or pressing `Escape` returns to the start screen.
- [x] Completion returns to the start screen with saved configuration; reload or navigation abandons the session.

**Verification:** Component tests cover start, phase transitions, completion, return-to-ready, language changes, and snapshot isolation; run a shortened browser flow.

**Dependencies:** Tasks 2–4
**Likely files:** `src/ui/`, `src/app.*`, session-flow tests
**Scope:** Medium

### Checkpoint: Core flow

- [x] Standard and changed configurations start and finish on full-cycle boundaries.
- [x] No runtime session state survives reload.
- [x] Timing remains correct with a placeholder visual.

## Phase 3 — Tide visual and responsive experience

### Task 6: Run the motion spike

**Description:** Compare a throwaway one-cycle CSS tide with Canvas 2D only if CSS looks like a flat curtain; consider Paper.js only with evidence.

**Acceptance criteria:**

- [x] Inhale rises, exhale recedes, and both holds remain stable with subtle texture motion.
- [x] Phase progress maps correctly at `0`, midpoint, and `1`; reduced motion keeps phase information.
- [x] Renderer choice is recorded with mobile/desktop performance and complexity evidence.

**Verification:** Inspect representative visual states and measure smoothness on target viewport sizes.

**Dependencies:** Tasks 2 and 5
**Likely files:** throwaway prototype under `src/visuals/` or `prototype/` plus decision note
**Scope:** Medium

### Task 7: Integrate and polish `tide-visual`

**Description:** Integrate the selected renderer with morning-mist tokens, responsive composition, readable overlays, reduced motion, and completion state.

**Acceptance criteria:**

- [x] Visual direction is understandable without explanation and never owns timing.
- [x] «Затримка дихання» and countdown remain readable at mobile and desktop widths.
- [x] Decorative transitions do not change phase duration or create boundary jumps.

**Verification:** Run visual checks at each phase midpoint and boundary, across both languages, with reduced motion enabled; run tests and build.

**Dependencies:** Task 6
**Likely files:** `src/visuals/`, `src/ui/`, `src/styles/` and tests
**Scope:** Medium

### Checkpoint: Visual experience

- [x] A full `04:00` session is calm, legible, and directionally obvious on phone and desktop.
- [x] The animation remains synchronized after delayed frames or hidden-tab recovery.

## Phase 4 — Installable offline product and release

### Task 8: Package the installable PWA

**Description:** Add manifest metadata, original tide-mark icons, standalone display, service-worker caching, safe update behavior, and best-effort Screen Wake Lock.

**Acceptance criteria:**

- [x] The manifest provides standalone display, purpose-built 192/512 icons, and the browser/system owns installation UI.
- [x] After one successful online load, a shortened session completes after an offline reload.
- [x] Breathing renders no custom install banner, help screen, or fallback instructions; failed wake-lock requests never block a session.

**Verification:** Inspect manifest and service worker; install on supported Android and iOS devices where available; run airplane-mode session; test an update during an active session.

**Dependencies:** Tasks 5 and 7
**Likely files:** `public/manifest.webmanifest`, `public/icons/`, `src/pwa/`, Vite PWA config
**Scope:** Medium

### Task 9: Verify and publish

**Description:** Run the browser/device matrix, fix release blockers, publish the static app, and consider anonymous analytics only as a separately approved follow-up.

**Acceptance criteria:**

- [ ] Published app opens on mobile and desktop, installs where supported, and completes offline after the first online load.
- [ ] Timer, labels, visual, and completion remain synchronized in the production build.
- [ ] No breathing settings or personal data are sent; analytics are absent unless explicitly approved.

**Verification:** Run all scripts, browser scenarios, production smoke checks, and real-device install/offline checks; record the deployed URL and known platform limits.

**Dependencies:** Task 8
**Likely files:** deployment config, `README.md`, browser tests
**Scope:** Medium

### Checkpoint: Complete

- [ ] All acceptance criteria are checked.
- [ ] The published PWA is usable without network after its first successful load.
- [ ] Deferred features (sound, vibration, presets, history, accounts, medical claims) are not in the MVP.
