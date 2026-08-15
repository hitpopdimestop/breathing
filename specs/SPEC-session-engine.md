# Spec: session-engine

## Objective

Provide a pure, deterministic model of a breathing session. Given a configuration and elapsed time, it returns the current phase, cycle number, phase progress, seconds remaining, and completion state.

## Contract

The phase order is `inhale → hold-after-inhale → exhale → hold-after-exhale`. A cycle duration is the sum of those four phase durations. A session duration is one cycle multiplied by the selected cycle count.

At an exact phase boundary, the next phase owns the timestamp. At the exact total duration, the session is complete. The model uses elapsed time rather than animation frames, React renders, or wall-clock display updates. Inhale and exhale durations are 1–20 seconds; hold durations may be 0–20 seconds; cycles are 1–25.

## Acceptance Criteria

- `4–4–4–4` produces a 16-second cycle and 240 seconds for 15 cycles.
- Every phase boundary returns the next phase with a fresh countdown.
- A session never ends in the middle of a phase.
- Delayed timer callbacks can catch up to the correct state without advancing multiple phases incorrectly.

## Testing

Unit tests cover time zero, one millisecond before and at every phase boundary, cycle transitions, final completion, and representative multi-cycle timestamps.

## Boundaries

- Must not import React, Zustand, browser storage, or animation libraries.
- Must not decide UI copy or colors.
- Configuration validation is explicit and shared with `user-settings`; this module remains the source of timing math.

## Implementation Notes

There are no product-level open questions. Any implementation ambiguity must be resolved against the root spec before coding.
