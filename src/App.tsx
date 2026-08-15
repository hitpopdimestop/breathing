import { createTranslator, getInitialLanguage } from './i18n/localization'
import './App.css'

function App() {
  const language = getInitialLanguage()
  const t = createTranslator(language)

  return (
    <main className="shell" lang={language}>
      <section className="welcome" aria-labelledby="app-title">
        <p className="eyebrow">{t('pattern')}</p>
        <h1 id="app-title">{t('appName')}</h1>
        <p className="intro">{t('intro')}</p>
        <button className="start-button" type="button">
          {t('start')}
        </button>
      </section>
    </main>
  )
}

export default App
