import type { CSSProperties } from 'react'

import type { ActiveSessionState } from '../domain/session-engine'
import { getTideOffsetPercent, getTideVisualState } from './tide-visual-state'

type TideVisualProps = Readonly<{
  state: ActiveSessionState
}>

export function TideVisual({ state }: TideVisualProps) {
  const visualState = getTideVisualState(state.phase, state.phaseProgress)
  const style = {
    '--tide-offset': `${getTideOffsetPercent(visualState.level)}%`,
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
          d="M0 -4 Q17 -10 34 -4 Q51 0 69 -4 Q85 -10 100 -4 L100 100 L0 100 Z"
          fill="url(#tide-gradient)"
        />
      </svg>
    </div>
  )
}
