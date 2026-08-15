import type {
  ActiveSessionState,
  SessionPhase,
} from '../domain/session-engine'
import type { TranslationKey } from '../i18n/localization'
import { TideVisual } from '../visuals/tide-visual'

const PHASE_LABEL_KEYS: Record<SessionPhase, Extract<TranslationKey, 'inhale' | 'hold' | 'exhale'>> = {
  inhale: 'inhale',
  'hold-after-inhale': 'hold',
  exhale: 'exhale',
  'hold-after-exhale': 'hold',
}

type SessionScreenProps = Readonly<{
  translate: (key: TranslationKey) => string
  onExit: () => void
}>

export function PreparationScreen({
  translate,
  onExit,
  secondsRemaining,
}: SessionScreenProps & { secondsRemaining: number }) {
  return (
    <main className="session-shell" aria-live="polite" onClick={onExit}>
      <div className="session-content">
        <p className="session-label">{translate('preparing')}</p>
        <p className="session-countdown" aria-label={`${secondsRemaining}`}>
          {secondsRemaining}
        </p>
      </div>
    </main>
  )
}

export function ActiveSessionScreen({
  translate,
  onExit,
  state,
}: SessionScreenProps & { state: ActiveSessionState }) {
  return (
    <main className={`session-shell phase-${state.phase}`} aria-live="polite" onClick={onExit}>
      <TideVisual state={state} />
      <div className="session-content">
        <p className="session-label">{translate(PHASE_LABEL_KEYS[state.phase])}</p>
        <p className="session-countdown" aria-label={`${state.secondsRemaining}`}>
          {state.secondsRemaining}
        </p>
      </div>
    </main>
  )
}
