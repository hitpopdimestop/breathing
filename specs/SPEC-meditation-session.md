# Spec: meditation-session

## Objective

Provide the complete user flow from ready-to-start configuration through a finished breathing session.

## Flow

1. Start screen shows the current pattern, cycle summary, settings entry, language entry, and «Почати».
2. A short `3 → 2 → 1` preparation runs before the first inhale.
3. The active screen shows the current phase label, `4 → 3 → 2 → 1` countdown, and tide visual.
4. The active screen does not show a total timer, pause button, or exit control.
5. After the final lower hold, the completion state offers «Ще раз».

The session snapshots settings at start. Its phase and completion state come only from `session-engine`; the visual receives derived state and cannot advance time.

## Acceptance Criteria

- Default flow starts with one tap and completes 15 cycles.
- Repeating a completed session uses the current saved configuration.
- Closing or navigating away simply abandons the session; no partial state is restored.
- The flow works in both languages and at mobile and desktop widths.

## Testing

Component tests cover preparation, start, phase transitions, completion, repeat, language changes, and configuration snapshots. A browser test covers a shortened session end to end.

## Boundaries

- No in-session controls in the MVP.
- No sound, vibration, music, presets, account, history, or medical messaging.
- Do not put timing logic inside view components.

## Implementation Notes

The completion state offers «Ще раз»; navigation away remains the browser’s responsibility.
