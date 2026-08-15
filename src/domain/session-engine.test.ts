import { describe, expect, it } from 'vitest'

import {
  DEFAULT_BREATH_CONFIG,
  getCycleDurationSeconds,
  getSessionDurationSeconds,
  getSessionState,
  type BreathConfig,
} from './session-engine'

const fourSecondConfig: BreathConfig = {
  inhaleSeconds: 4,
  holdAfterInhaleSeconds: 4,
  exhaleSeconds: 4,
  holdAfterExhaleSeconds: 4,
  cycles: 15,
}

describe('session-engine duration math', () => {
  it('calculates the default cycle and session durations', () => {
    expect(getCycleDurationSeconds(DEFAULT_BREATH_CONFIG)).toBe(16)
    expect(getSessionDurationSeconds(DEFAULT_BREATH_CONFIG)).toBe(240)
  })
})
describe('session-engine phase timeline', () => {
  it('starts with the first inhale and a full countdown', () => {
    expect(getSessionState(fourSecondConfig, 0)).toEqual({
      status: 'active',
      phase: 'inhale',
      cycle: 1,
      elapsedMs: 0,
      phaseElapsedMs: 0,
      phaseProgress: 0,
      secondsRemaining: 4,
    })
  })

  it('keeps the inhale active immediately before its boundary', () => {
    const state = getSessionState(fourSecondConfig, 3999)

    expect(state.phase).toBe('inhale')
    expect(state.secondsRemaining).toBe(1)
    expect(state.phaseProgress).toBeCloseTo(0.99975)
  })

  it('assigns an exact phase boundary to the next phase', () => {
    expect(getSessionState(fourSecondConfig, 4000)).toMatchObject({
      status: 'active',
      phase: 'hold-after-inhale',
      cycle: 1,
      phaseElapsedMs: 0,
      phaseProgress: 0,
      secondsRemaining: 4,
    })

    expect(getSessionState(fourSecondConfig, 8000).phase).toBe('exhale')
    expect(getSessionState(fourSecondConfig, 12000).phase).toBe('hold-after-exhale')
  })

  it('starts the next cycle at an exact cycle boundary', () => {
    expect(getSessionState(fourSecondConfig, 16000)).toMatchObject({
      status: 'active',
      phase: 'inhale',
      cycle: 2,
      phaseElapsedMs: 0,
      secondsRemaining: 4,
    })
  })

  it('catches up from a delayed callback using elapsed time', () => {
    expect(getSessionState(fourSecondConfig, 9700)).toMatchObject({
      status: 'active',
      phase: 'exhale',
      cycle: 1,
      phaseElapsedMs: 1700,
      secondsRemaining: 3,
    })
  })
})

describe('session-engine completion and zero-length holds', () => {
  it('completes exactly at the end of the final full cycle', () => {
    expect(getSessionState(fourSecondConfig, 240000)).toEqual({
      status: 'complete',
      phase: null,
      cycle: 15,
      elapsedMs: 240000,
      phaseElapsedMs: 0,
      phaseProgress: 1,
      secondsRemaining: 0,
    })
    expect(getSessionState(fourSecondConfig, 300000).status).toBe('complete')
  })

  it('skips zero-length holds without producing an invalid active phase', () => {
    const config: BreathConfig = {
      ...fourSecondConfig,
      holdAfterInhaleSeconds: 0,
      holdAfterExhaleSeconds: 0,
    }

    expect(getSessionState(config, 4000).phase).toBe('exhale')
    expect(getSessionState(config, 8000)).toMatchObject({
      phase: 'inhale',
      cycle: 2,
      phaseElapsedMs: 0,
    })
  })
})
