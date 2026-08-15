# Spec: user-settings

## Objective

Let a person adjust the four phase durations and the number of complete cycles while keeping the default path one tap away.

## Contract

The persisted settings are the four phase durations, cycle count, and language. Zustand `persist` uses a stable storage key, an explicit `partialize` selection, and a schema version with migration support. Active phase, countdown, elapsed time, animation progress, and browser/system installation state are never persisted.

The cycle slider changes an integer cycle count from 1 through 50. Inhale and exhale controls accept 1–20 seconds; hold controls accept 0–20 seconds. The UI shows both count and calculated duration, for example `15 cycles · 04:00`. Changing a phase recalculates duration immediately.

## Acceptance Criteria

- The initial configuration is `4–4–4–4`, 15 cycles.
- Invalid values are rejected before a session starts.
- Settings and language survive refresh and later launches of the installed app on the same device.
- A refreshed app returns to the start screen rather than resuming a session.

## Testing

Test validation boundaries, cycle-duration math, partial persistence, storage version migration, malformed stored data, and reset-to-default behavior.

## Boundaries

- Must not persist session history or personal information.
- Must not expose a preset system in the MVP.
- Must not let settings edits mutate an already-started session; the session receives an immutable configuration snapshot.

## Implementation Notes

Any storage migration must preserve these bounds or explicitly reset invalid legacy values.
