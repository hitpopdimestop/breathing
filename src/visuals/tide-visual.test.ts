import { describe, expect, it } from 'vitest'

import { getTideVisualState } from './tide-visual-state'

describe('tide visual phase mapping', () => {
  it('rises through inhale progress', () => {
    expect(getTideVisualState('inhale', 0)).toEqual({ level: 0, motion: 'rising' })
    expect(getTideVisualState('inhale', 0.25)).toEqual({ level: 0.15625, motion: 'rising' })
    expect(getTideVisualState('inhale', 0.5)).toEqual({ level: 0.5, motion: 'rising' })
    expect(getTideVisualState('inhale', 1)).toEqual({ level: 1, motion: 'rising' })
  })

  it('keeps sub-percent progress for smooth rendering', () => {
    const progress = 0.123
    const expectedLevel = progress * progress * (3 - 2 * progress)

    expect(getTideVisualState('inhale', progress).level).toBeCloseTo(expectedLevel, 6)
  })

  it('holds the upper level after inhale', () => {
    expect(getTideVisualState('hold-after-inhale', 0.4)).toEqual({
      level: 1,
      motion: 'upper-hold',
    })
  })

  it('recedes through exhale progress', () => {
    expect(getTideVisualState('exhale', 0)).toEqual({ level: 1, motion: 'falling' })
    expect(getTideVisualState('exhale', 0.25)).toEqual({ level: 0.84375, motion: 'falling' })
    expect(getTideVisualState('exhale', 0.5)).toEqual({ level: 0.5, motion: 'falling' })
    expect(getTideVisualState('exhale', 1)).toEqual({ level: 0, motion: 'falling' })
  })

  it('holds the lower level after exhale and clamps progress', () => {
    expect(getTideVisualState('hold-after-exhale', 2)).toEqual({
      level: 0,
      motion: 'lower-hold',
    })
    expect(getTideVisualState('inhale', -1).level).toBe(0)
  })
})
