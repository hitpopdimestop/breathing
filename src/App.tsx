import { useEffect, useState, type MouseEvent } from 'react'
import { useStore } from 'zustand'

import type { BreathConfig } from './domain/session-engine'
import { createTranslator } from './i18n/localization'
import { getDurationSummary } from './store/settings-store'
import { settingsStore } from './store/settings-store'
import { SettingsPanel } from './ui/settings-panel'
import {
  ActiveSessionScreen,
  PreparationScreen,
} from './ui/session-screens'
import { useMeditationSession } from './ui/use-meditation-session'
import { useScreenWakeLock } from './pwa/use-screen-wake-lock'
import './App.css'

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const config = useStore(settingsStore, (state) => state.config)
  const language = useStore(settingsStore, (state) => state.language)
  const setLanguage = useStore(settingsStore, (state) => state.setLanguage)
  const setPhaseDuration = useStore(settingsStore, (state) => state.setPhaseDuration)
  const setCycles = useStore(settingsStore, (state) => state.setCycles)
  const meditationSession = useMeditationSession()
  const sessionStatus = meditationSession.status
  const stopSession = meditationSession.stop
  useScreenWakeLock(meditationSession.status === 'active')
  const t = createTranslator(language)
  const duration = getDurationSummary(config)
  const pattern = formatBreathPattern(config)

  useEffect(() => {
    const sessionActive = sessionStatus === 'preparing' || sessionStatus === 'active'

    if (!settingsOpen && !sessionActive) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      event.preventDefault()

      if (settingsOpen) {
        setSettingsOpen(false)
      } else {
        stopSession()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sessionStatus, settingsOpen, stopSession])

  const handleShellClick = (event: MouseEvent<HTMLElement>) => {
    if (!settingsOpen || !(event.target instanceof Element)) {
      return
    }

    if (event.target.closest('.settings-panel, .settings-button, .app-header')) {
      return
    }

    setSettingsOpen(false)
  }

  if (
    meditationSession.status === 'preparing'
    && meditationSession.preparationSecondsRemaining !== null
  ) {
    return (
      <div lang={language}>
        <PreparationScreen
          translate={t}
          onExit={meditationSession.stop}
          secondsRemaining={meditationSession.preparationSecondsRemaining}
        />
      </div>
    )
  }

  if (meditationSession.status === 'active' && meditationSession.activeState !== null) {
    return (
      <div lang={language}>
        <ActiveSessionScreen
          translate={t}
          onExit={meditationSession.stop}
          state={meditationSession.activeState}
        />
      </div>
    )
  }

  return (
    <main className="shell" lang={language} onClick={handleShellClick}>
      <header className="app-header">
        <div className="toolbar">
          <div className="language-switcher" role="group" aria-label={t('language')}>
            <button
              className={language === 'uk' ? 'language-button is-selected' : 'language-button'}
              type="button"
              aria-pressed={language === 'uk'}
              onClick={() => setLanguage('uk')}
            >
              UA
              <span className="sr-only">{t('ukrainian')}</span>
            </button>
            <button
              className={language === 'en' ? 'language-button is-selected' : 'language-button'}
              type="button"
              aria-pressed={language === 'en'}
              onClick={() => setLanguage('en')}
            >
              EN
              <span className="sr-only">{t('english')}</span>
            </button>
          </div>
          <button
            className="settings-button"
            type="button"
            aria-label={t('settings')}
            aria-expanded={settingsOpen}
            aria-controls="settings-panel"
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <span aria-hidden="true">⚙</span>
          </button>
        </div>
      </header>

      {settingsOpen ? (
        <SettingsPanel
          config={config}
          translate={t}
          onClose={() => setSettingsOpen(false)}
          onPhaseDurationChange={setPhaseDuration}
          onCyclesChange={setCycles}
        />
      ) : (
        <section className="welcome" aria-labelledby="app-title">
          <h1 id="app-title">{t('appName')}</h1>
          <p className="session-summary">
            <span>{pattern}</span>
            <span aria-hidden="true"> · </span>
            <span>{config.cycles} {t('cycles')}</span>
            <span aria-hidden="true"> · </span>
            <span>{duration.label}</span>
          </p>
          <p className="intro">{t('intro')}</p>
          <button
            className="start-button"
            type="button"
            onClick={() => meditationSession.start(config)}
          >
            {t('start')}
          </button>
        </section>
      )}
    </main>
  )
}

export default App

function formatBreathPattern(config: BreathConfig): string {
  return [
    config.inhaleSeconds,
    config.holdAfterInhaleSeconds,
    config.exhaleSeconds,
    config.holdAfterExhaleSeconds,
  ]
    .map((seconds) => String(seconds).padStart(2, '0'))
    .join(' · ')
}
