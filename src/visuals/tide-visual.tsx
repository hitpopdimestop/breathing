import type { CSSProperties } from 'react'

import type { ActiveSessionState } from '../domain/session-engine'
import { getTideVisualState } from './tide-visual-state'

type TideVisualProps = Readonly<{
  state: ActiveSessionState
}>

export function TideVisual({ state }: TideVisualProps) {
  const visualState = getTideVisualState(state.phase, state.phaseProgress)
  const style = {
    '--tide-level': `${visualState.level * 100}%`,
  } as CSSProperties

  return (
    <div
      className={`tide-visual tide-motion-${visualState.motion}`}
      style={style}
      aria-hidden="true"
    >
      <div className="tide-fill">
        <div className="tide-surface" />
      </div>
    </div>
  )
}
