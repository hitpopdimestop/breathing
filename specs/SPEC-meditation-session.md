# Spec: meditation-session

## Objective

Provide the complete user flow from ready-to-start configuration through a finished breathing session.

## Flow

1. Start screen shows the current pattern, cycle summary, settings entry, language entry, and «Почати».
2. A short `3 → 2 → 1` preparation runs before the first inhale.
3. The active screen shows the current phase label, `4 → 3 → 2 → 1` countdown, and tide visual.
4. The active screen does not show a total timer, pause button, or exit control; clicking the session or pressing `Escape` cancels it and returns to the start screen.
5. After the final lower hold, the app returns to the ready start screen with the saved settings.

The session snapshots settings at start. Its phase and completion state come only from `session-engine`; the visual receives derived state and cannot advance time.

## Acceptance Criteria

- Default flow starts with one tap and completes 15 cycles.
- Starting again after completion uses the current saved configuration.
- Closing or navigating away simply abandons the session; no partial state is restored.
- The flow works in both languages and at mobile and desktop widths.

## Testing

Component tests cover preparation, start, phase transitions, completion, return to ready, language changes, and configuration snapshots. A browser test covers a shortened session end to end.

## Boundaries

- No in-session controls in the MVP.
- No sound, vibration, music, presets, account, history, or medical messaging.
- Do not put timing logic inside view components.

## Implementation Notes

Completion returns to the ready screen; navigation away remains the browser’s responsibility.
