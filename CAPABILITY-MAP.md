# Capability Map: Breathing

Status: **Approved**

Module specifications:

- [Session engine](specs/SPEC-session-engine.md)
- [Localization](specs/SPEC-localization.md)
- [User settings](specs/SPEC-user-settings.md)
- [Meditation session](specs/SPEC-meditation-session.md)
- [Tide visual](specs/SPEC-tide-visual.md)
- [Installable PWA](specs/SPEC-installable-pwa.md)

| Module id | Responsibility | Depends on |
|---|---|---|
| `session-engine` | Pure breathing timeline: phases, countdown, complete cycles, elapsed-time correctness | — |
| `localization` | Ukrainian and English dictionaries plus language selection contract | — |
| `user-settings` | Phase durations, cycle slider, validation, and persisted device settings | `session-engine`, `localization` |
| `meditation-session` | Start screen, preparation countdown, active session, completion state, and user flow | `session-engine`, `user-settings`, `localization` |
| `tide-visual` | Full-screen morning-mist tide, phase transitions, countdown presentation, and responsive visual behavior | `session-engine`, `meditation-session` |
| `installable-pwa` | Manifest, custom icon, service worker, offline app shell, browser/system install affordance, and update behavior | `meditation-session`, `user-settings` |

## Dependency Direction

```text
session-engine ─┐
                ├── user-settings ─┐
localization ───┘                  ├── meditation-session ── tide-visual
                                   └──────────────────────── installable-pwa
```

## Build Order

1. `session-engine` and `localization` can be specified independently.
2. `user-settings` defines the persisted configuration contract.
3. `meditation-session` delivers the first complete user flow.
4. `tide-visual` replaces the temporary session indicator with the final visual.
5. `installable-pwa` packages the stable flow for home-screen and offline use.

Presets, sound design, vibration, accounts, history, analytics, and native applications are outside this capability map and remain deferred.
