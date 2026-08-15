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
}>

export function PreparationScreen({
  translate,
  secondsRemaining,
}: SessionScreenProps & { secondsRemaining: number }) {
  return (
    <main className="session-shell" aria-live="polite">
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
  state,
}: SessionScreenProps & { state: ActiveSessionState }) {
  return (
    <main className={`session-shell phase-${state.phase}`} aria-live="polite">
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
