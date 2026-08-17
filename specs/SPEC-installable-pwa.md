# Spec: installable-pwa

## Objective

Make Breathing installable from a mobile browser, launchable from the home screen, and usable offline after its first successful online load.

## Contract

The PWA includes a manifest with Breathing name, standalone display, theme colors, start URL, and purpose-built icons. A service worker caches the deployable app shell and required local assets. Updates activate automatically without interrupting the visible shell or an active session; the updated shell is picked up on the next navigation or launch.

The install experience is entirely browser- and system-controlled. If the browser exposes a native install affordance, the person may accept it. Breathing does not render a custom install banner, help screen, or fallback instructions. Service-worker updates use auto-update behavior without forcing a visible page reload; a later navigation or launch receives the new shell. During an active session, the app may request Screen Wake Lock when supported; failure is silent and never blocks a session.

## Acceptance Criteria

- The app can be installed with a recognizable Breathing icon on supported mobile platforms.
- An installed app opens without browser chrome and reaches the start screen.
- After the first successful load, a full shortened session completes with the device offline.
- A service-worker update does not replace the active app mid-session.
- A new service-worker version activates without a manual update prompt.

## Testing

Inspect manifest metadata, install on at least one Android and one iOS device where available, run a session in airplane mode, and test an update from one app version to the next.

## Boundaries

- No backend, authentication, remote settings sync, or remote audio assets in the MVP.
- The icon is an original simple tide mark, not an unverified third-party asset.
- Do not claim that every browser offers identical installation UI.

## Open Questions

- Whether the best-effort wake lock behaves acceptably on the target mobile browsers.
