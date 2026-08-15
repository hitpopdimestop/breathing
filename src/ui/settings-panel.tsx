import type { BreathConfig } from '../domain/session-engine'
import {
  getDurationSummary,
  type PhaseDurationKey,
} from '../store/settings-store'
import { formatCycles, type Language, type TranslationKey } from '../i18n/localization'

type PhaseField = Readonly<{
  id: string
  key: PhaseDurationKey
  label: Extract<TranslationKey, 'inhale' | 'hold' | 'exhale'>
  min: number
  max: number
}>

const PHASE_FIELDS: readonly PhaseField[] = [
  { id: 'inhale-seconds', key: 'inhaleSeconds', label: 'inhale', min: 1, max: 20 },
  {
    id: 'hold-after-inhale-seconds',
    key: 'holdAfterInhaleSeconds',
    label: 'hold',
    min: 0,
    max: 20,
  },
  { id: 'exhale-seconds', key: 'exhaleSeconds', label: 'exhale', min: 1, max: 20 },
  {
    id: 'hold-after-exhale-seconds',
    key: 'holdAfterExhaleSeconds',
    label: 'hold',
    min: 0,
    max: 20,
  },
]

type SettingsPanelProps = Readonly<{
  config: BreathConfig
  language: Language
  translate: (key: TranslationKey) => string
  onClose: () => void
  onPhaseDurationChange: (phase: PhaseDurationKey, seconds: number) => void
  onCyclesChange: (cycles: number) => void
}>

export function SettingsPanel({
  config,
  language,
  translate,
  onClose,
  onPhaseDurationChange,
  onCyclesChange,
}: SettingsPanelProps) {
  const duration = getDurationSummary(config)

  return (
    <section
      id="settings-panel"
      className="settings-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="settings-heading">
        <h2 id="settings-title">{translate('settings')}</h2>
        <button
          className="close-button"
          type="button"
          aria-label={translate('close')}
          onClick={onClose}
        >
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="settings-summary" aria-live="polite">
        <span>{formatCycles(language, config.cycles)}</span>
        <span aria-hidden="true"> · </span>
        <span>{duration.label}</span>
      </div>

      <div className="settings-fields">
        {PHASE_FIELDS.map((field) => (
          <label className="range-field" htmlFor={field.id} key={field.key}>
            <span className="range-heading">
              <span>{translate(field.label)}</span>
              <span className="range-value">
                {config[field.key]} {translate('secondsShort')}
              </span>
            </span>
            <input
              id={field.id}
              aria-label={translate(field.label)}
              type="range"
              min={field.min}
              max={field.max}
              step="1"
              value={config[field.key]}
              onChange={(event) =>
                onPhaseDurationChange(field.key, Number(event.target.value))
              }
            />
          </label>
        ))}
      </div>

      <label className="range-field" htmlFor="cycles">
        <span className="range-heading">
          <span>{translate('cyclesLabel')}</span>
          <span className="range-value">{config.cycles}</span>
        </span>
        <input
          id="cycles"
          aria-label={translate('cyclesLabel')}
          type="range"
          min="1"
          max="50"
          step="1"
          value={config.cycles}
          onChange={(event) => onCyclesChange(Number(event.target.value))}
        />
      </label>
    </section>
  )
}
