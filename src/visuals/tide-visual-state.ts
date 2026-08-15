import type { SessionPhase } from '../domain/session-engine'

const LOW_TIDE_LEVEL = 0
const HIGH_TIDE_LEVEL = 1

export type TideMotion = 'rising' | 'upper-hold' | 'falling' | 'lower-hold'

export type TideVisualState = Readonly<{
  level: number
  motion: TideMotion
}>

// The extra 12% clears the subtle wave boundary at both full-screen extremes.
const TIDE_OFFSET_SCALE_PERCENT = 112

export function getTideVisualState(
  phase: SessionPhase,
  phaseProgress: number,
): TideVisualState {
  const progress = clamp(phaseProgress)

  switch (phase) {
    case 'inhale':
      return { level: interpolate(LOW_TIDE_LEVEL, HIGH_TIDE_LEVEL, progress), motion: 'rising' }
    case 'hold-after-inhale':
      return { level: HIGH_TIDE_LEVEL, motion: 'upper-hold' }
    case 'exhale':
      return { level: interpolate(HIGH_TIDE_LEVEL, LOW_TIDE_LEVEL, progress), motion: 'falling' }
    case 'hold-after-exhale':
      return { level: LOW_TIDE_LEVEL, motion: 'lower-hold' }
  }
}

export function getTideOffsetPercent(level: number): number {
  return (1 - clamp(level)) * TIDE_OFFSET_SCALE_PERCENT
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function interpolate(start: number, end: number, progress: number): number {
  const easedProgress = smoothstep(progress)
  return start + (end - start) * easedProgress
}

function smoothstep(progress: number): number {
  return progress * progress * (3 - 2 * progress)
}
