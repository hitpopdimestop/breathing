export type BreathConfig = Readonly<{
  inhaleSeconds: number
  holdAfterInhaleSeconds: number
  exhaleSeconds: number
  holdAfterExhaleSeconds: number
  cycles: number
}>

export const DEFAULT_BREATH_CONFIG = {
  inhaleSeconds: 4,
  holdAfterInhaleSeconds: 4,
  exhaleSeconds: 4,
  holdAfterExhaleSeconds: 4,
  cycles: 15,
} as const satisfies BreathConfig

export type SessionPhase =
  | 'inhale'
  | 'hold-after-inhale'
  | 'exhale'
  | 'hold-after-exhale'

type PhaseDefinition = Readonly<{
  phase: SessionPhase
  seconds: number
}>

export type ActiveSessionState = Readonly<{
  status: 'active'
  phase: SessionPhase
  cycle: number
  elapsedMs: number
  phaseElapsedMs: number
  phaseProgress: number
  secondsRemaining: number
}>

export type CompleteSessionState = Readonly<{
  status: 'complete'
  phase: null
  cycle: number
  elapsedMs: number
  phaseElapsedMs: 0
  phaseProgress: 1
  secondsRemaining: 0
}>

export type SessionState = ActiveSessionState | CompleteSessionState

export function assertValidBreathConfig(config: BreathConfig): void {
  const durationValues = [
    config.inhaleSeconds,
    config.holdAfterInhaleSeconds,
    config.exhaleSeconds,
    config.holdAfterExhaleSeconds,
  ]

  const validDurations = durationValues.every(
    (seconds, index) =>
      Number.isInteger(seconds) && seconds >= (index === 0 || index === 2 ? 1 : 0) && seconds <= 20,
  )
  const validCycles = Number.isInteger(config.cycles) && config.cycles >= 1 && config.cycles <= 50

  if (!validDurations || !validCycles) {
    throw new Error('Invalid breath configuration')
  }
}

export function getCycleDurationSeconds(config: BreathConfig): number {
  assertValidBreathConfig(config)

  return (
    config.inhaleSeconds
    + config.holdAfterInhaleSeconds
    + config.exhaleSeconds
    + config.holdAfterExhaleSeconds
  )
}

export function getSessionDurationSeconds(config: BreathConfig): number {
  return getCycleDurationSeconds(config) * config.cycles
}

export function getSessionState(config: BreathConfig, elapsedMs: number): SessionState {
  const cycleDurationSeconds = getCycleDurationSeconds(config)

  if (!Number.isFinite(elapsedMs)) {
    throw new Error('Elapsed time must be finite')
  }

  const normalizedElapsedMs = Math.max(0, elapsedMs)
  const totalDurationMs = getSessionDurationSeconds(config) * 1000

  if (normalizedElapsedMs >= totalDurationMs) {
    return {
      status: 'complete',
      phase: null,
      cycle: config.cycles,
      elapsedMs: totalDurationMs,
      phaseElapsedMs: 0,
      phaseProgress: 1,
      secondsRemaining: 0,
    }
  }

  const cycleDurationMs = cycleDurationSeconds * 1000
  const cycleIndex = Math.floor(normalizedElapsedMs / cycleDurationMs)
  let cycleElapsedMs = normalizedElapsedMs % cycleDurationMs

  for (const definition of getPhaseDefinitions(config)) {
    const phaseDurationMs = definition.seconds * 1000

    if (phaseDurationMs === 0) {
      continue
    }

    if (cycleElapsedMs < phaseDurationMs) {
      return {
        status: 'active',
        phase: definition.phase,
        cycle: cycleIndex + 1,
        elapsedMs: normalizedElapsedMs,
        phaseElapsedMs: cycleElapsedMs,
        phaseProgress: cycleElapsedMs / phaseDurationMs,
        secondsRemaining: Math.max(1, Math.ceil((phaseDurationMs - cycleElapsedMs) / 1000)),
      }
    }

    cycleElapsedMs -= phaseDurationMs
  }

  throw new Error('Unable to resolve session phase')
}

function getPhaseDefinitions(config: BreathConfig): readonly PhaseDefinition[] {
  return [
    { phase: 'inhale', seconds: config.inhaleSeconds },
    { phase: 'hold-after-inhale', seconds: config.holdAfterInhaleSeconds },
    { phase: 'exhale', seconds: config.exhaleSeconds },
    { phase: 'hold-after-exhale', seconds: config.holdAfterExhaleSeconds },
  ]
}
