# Breathing

Breathing is a planned mobile-first breathing meditation PWA. Its default session follows a `4–4–4–4` rhythm for 15 complete cycles (`04:00`) and uses a calm full-screen “living tide” as the breathing guide.

## MVP

- One-tap default session with configurable phase lengths and cycle count
- Ukrainian and English interfaces
- Local settings persisted on the device
- Installable PWA with offline sessions
- Responsive mobile and desktop layouts
- No accounts, backend, presets, streaks, or medical claims

## Planned Stack

React, TypeScript, Vite, Zustand, and `vite-plugin-pwa`. The tide renderer will be selected after a focused CSS-versus-Canvas motion prototype.

## Project Status

Product planning and architecture are complete; the formal specification is approved, and Tasks 1–8 are complete. Release checks and publishing are the next implementation increment.

## Documentation

- [Product concept](docs/ideas/breathing.md)
- [Capability map](CAPABILITY-MAP.md)
- [Project specification](SPEC.md)
- [Architecture decision](docs/decisions/001-web-application-stack.md)
- [Implementation plan](tasks/plan.md)
- [Task checklist](tasks/todo.md)
- [Contributor guidelines](AGENTS.md)
- [Agent skills](.agents/skills/)
