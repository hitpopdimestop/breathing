import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  getSessionState,
  type ActiveSessionState,
  type BreathConfig,
} from '../domain/session-engine'

const PREPARATION_DURATION_MS = 3000
const TICK_INTERVAL_MS = 16

export type MeditationStatus = 'ready' | 'preparing' | 'active' | 'complete'

type MeditationSession = Readonly<{
  status: MeditationStatus
  configSnapshot: BreathConfig | null
  preparationSecondsRemaining: number | null
  activeState: ActiveSessionState | null
  start: (config: BreathConfig) => void
  stop: () => void
}>

export function useMeditationSession(): MeditationSession {
  const [status, setStatus] = useState<MeditationStatus>('ready')
  const [configSnapshot, setConfigSnapshot] = useState<BreathConfig | null>(null)
  const [preparationStartedAt, setPreparationStartedAt] = useState<number | null>(null)
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null)
  const [nowMs, setNowMs] = useState(0)

  const start = useCallback((config: BreathConfig) => {
    const startedAt = getNow()

    setConfigSnapshot({ ...config })
    setPreparationStartedAt(startedAt)
    setSessionStartedAt(null)
    setNowMs(startedAt)
    setStatus('preparing')
  }, [])

  const stop = useCallback(() => {
    setStatus('ready')
    setConfigSnapshot(null)
    setPreparationStartedAt(null)
    setSessionStartedAt(null)
    setNowMs(0)
  }, [])

  useEffect(() => {
    if (status !== 'preparing' && status !== 'active') {
      return undefined
    }

    const tick = () => {
      const currentTime = getNow()
      setNowMs(currentTime)

      if (
        status === 'preparing'
        && preparationStartedAt !== null
        && currentTime - preparationStartedAt >= PREPARATION_DURATION_MS
      ) {
        setSessionStartedAt(currentTime)
        setStatus('active')
      }

      if (
        status === 'active'
        && configSnapshot !== null
        && sessionStartedAt !== null
        && getSessionState(configSnapshot, currentTime - sessionStartedAt).status === 'complete'
      ) {
        setStatus('complete')
      }
    }

    tick()
    const intervalId = window.setInterval(tick, TICK_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [configSnapshot, preparationStartedAt, sessionStartedAt, status])

  const preparationSecondsRemaining = useMemo(() => {
    if (status !== 'preparing' || preparationStartedAt === null) {
      return null
    }

    return Math.max(
      1,
      Math.ceil((PREPARATION_DURATION_MS - (nowMs - preparationStartedAt)) / 1000),
    )
  }, [nowMs, preparationStartedAt, status])

  const activeState = useMemo(() => {
    if (status !== 'active' || configSnapshot === null || sessionStartedAt === null) {
      return null
    }

    const state = getSessionState(configSnapshot, Math.max(0, nowMs - sessionStartedAt))
    return state.status === 'active' ? state : null
  }, [configSnapshot, nowMs, sessionStartedAt, status])

  return {
    status,
    configSnapshot,
    preparationSecondsRemaining,
    activeState,
    start,
    stop,
  }
}

function getNow(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}
