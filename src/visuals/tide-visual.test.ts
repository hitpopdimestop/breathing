import { describe, expect, it } from 'vitest'

import { getTideVisualState } from './tide-visual-state'

describe('tide visual phase mapping', () => {
  it('rises through inhale progress', () => {
    expect(getTideVisualState('inhale', 0)).toEqual({ level: 0.22, motion: 'rising' })
    expect(getTideVisualState('inhale', 0.5)).toEqual({ level: 0.49, motion: 'rising' })
    expect(getTideVisualState('inhale', 1)).toEqual({ level: 0.76, motion: 'rising' })
  })

  it('holds the upper level after inhale', () => {
    expect(getTideVisualState('hold-after-inhale', 0.4)).toEqual({
      level: 0.76,
      motion: 'upper-hold',
    })
  })

  it('recedes through exhale progress', () => {
    expect(getTideVisualState('exhale', 0)).toEqual({ level: 0.76, motion: 'falling' })
    expect(getTideVisualState('exhale', 0.5)).toEqual({ level: 0.49, motion: 'falling' })
    expect(getTideVisualState('exhale', 1)).toEqual({ level: 0.22, motion: 'falling' })
  })

  it('holds the lower level after exhale and clamps progress', () => {
    expect(getTideVisualState('hold-after-exhale', 2)).toEqual({
      level: 0.22,
      motion: 'lower-hold',
    })
    expect(getTideVisualState('inhale', -1).level).toBe(0.22)
  })
})
