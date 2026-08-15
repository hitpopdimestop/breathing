# Breathing

<p align="center">
  A calm, offline-first breathing meditation for the web.
  <br />
  <a href="https://breathing-sandy.vercel.app"><strong>Open the live app →</strong></a>
</p>

Breathing guides a session through a simple `4–4–4–4` rhythm: inhale, pause, exhale, pause. The default session runs for 15 complete cycles (`04:00`) and uses a slow, full-screen tide as its visual cue.

## Features

- One-tap start with ready-to-use defaults
- Adjustable inhale, exhale, pause, and cycle durations
- Ukrainian and English interfaces
- Smooth countdown and animated full-screen tide
- Settings persisted locally on the device
- Installable PWA with offline support
- Responsive layouts for mobile, tablet, and desktop
- No account, backend, or medical claims

## Stack

- React 19 and TypeScript
- Vite
- Zustand with local persistence
- CSS tide renderer
- Vite PWA and Workbox
- Vitest and Playwright

## Run locally

```bash
yarn install
yarn dev
```

Then open `http://127.0.0.1:5173`.

Useful checks:

```bash
yarn test          # unit tests
yarn test:e2e      # browser tests
yarn test:pwa      # production PWA and offline flow
yarn typecheck     # TypeScript
yarn lint          # Oxlint
yarn build
```

## Project docs

- [Product concept](docs/ideas/breathing.md)
- [Capability map](CAPABILITY-MAP.md)
- [Project specification](SPEC.md)
- [Architecture decisions](docs/decisions/)
- [Implementation plan](tasks/plan.md)
- [Contributor guide](AGENTS.md)

## Status

The MVP is live at [breathing-sandy.vercel.app](https://breathing-sandy.vercel.app). The project is intentionally small and focused; future ideas such as presets, sound, vibration, and richer analytics remain separate from the core experience.
