import { useState } from 'react'
import { useStore } from 'zustand'

import { createTranslator } from './i18n/localization'
import { getDurationSummary } from './store/settings-store'
import { settingsStore } from './store/settings-store'
import { SettingsPanel } from './ui/settings-panel'
import './App.css'

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const config = useStore(settingsStore, (state) => state.config)
  const language = useStore(settingsStore, (state) => state.language)
  const setLanguage = useStore(settingsStore, (state) => state.setLanguage)
  const setPhaseDuration = useStore(settingsStore, (state) => state.setPhaseDuration)
  const setCycles = useStore(settingsStore, (state) => state.setCycles)
  const t = createTranslator(language)
  const duration = getDurationSummary(config)

  return (
    <main className="shell" lang={language}>
      <header className="app-header">
        <p className="brand">{t('appName')}</p>
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
          <p className="eyebrow">{t('pattern')}</p>
          <h1 id="app-title">{t('appName')}</h1>
          <p className="session-summary">
            {config.cycles} {t('cycles')} <span aria-hidden="true">·</span> {duration.label}
          </p>
          <p className="intro">{t('intro')}</p>
          <button className="start-button" type="button">
            {t('start')}
          </button>
        </section>
      )}
    </main>
  )
}

export default App
