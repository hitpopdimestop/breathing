import type { CSSProperties } from 'react'

import type { ActiveSessionState } from '../domain/session-engine'
import { getTideVisualState } from './tide-visual-state'

type TideVisualProps = Readonly<{
  state: ActiveSessionState
}>

export function TideVisual({ state }: TideVisualProps) {
  const visualState = getTideVisualState(state.phase, state.phaseProgress)
  const style = {
    '--tide-offset': `${(1 - visualState.level) * 100}%`,
  } as CSSProperties

  return (
    <div
      className={`tide-visual tide-motion-${visualState.motion}`}
      style={style}
      aria-hidden="true"
    >
      <svg
        className="tide-fill"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="tide-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#b5e1d2" />
            <stop offset="1" stopColor="#eef2d5" />
          </linearGradient>
        </defs>
        <path
          className="tide-wave"
          d="M0 2 C10 -1 22 4 34 2 S57 -1 69 2 S90 4 100 1 L100 100 L0 100 Z"
          fill="url(#tide-gradient)"
        />
      </svg>
    </div>
  )
}
