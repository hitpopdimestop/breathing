import { useEffect, useRef } from 'react'

type WakeLockSentinelLike = Readonly<{
  release: () => Promise<void>
}>

type NavigatorWithWakeLock = Navigator & Readonly<{
  wakeLock?: Readonly<{
    request: (type: 'screen') => Promise<WakeLockSentinelLike>
  }>
}>

export function useScreenWakeLock(enabled: boolean): void {
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null)

  useEffect(() => {
    let disposed = false

    const release = () => {
      const sentinel = sentinelRef.current
      sentinelRef.current = null
      void sentinel?.release().catch(() => undefined)
    }

    const request = async () => {
      if (!enabled || disposed || document.visibilityState !== 'visible') {
        return
      }

      const wakeLock = (navigator as NavigatorWithWakeLock).wakeLock
      if (!wakeLock) {
        return
      }

      try {
        const sentinel = await wakeLock.request('screen')
        if (disposed || !enabled) {
          await sentinel.release().catch(() => undefined)
          return
        }
        sentinelRef.current = sentinel
      } catch {
        // Wake Lock is a best-effort enhancement and must never block a session.
      }
    }

    if (!enabled) {
      release()
      return undefined
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void request()
      }
    }

    void request()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      disposed = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      release()
    }
  }, [enabled])
}
