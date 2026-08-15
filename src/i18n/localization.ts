import { APP_NAME } from '../app-contract'

export const dictionaries = {
  uk: {
    appName: APP_NAME,
    intro: 'Спокійний ритм дихання починається з одного натискання.',
    start: 'Почати',
    settings: 'Налаштування',
    language: 'Мова',
    ukrainian: 'Українська',
    english: 'English',
    close: 'Закрити',
    secondsShort: 'с',
    cycles: 'циклів',
    cyclesLabel: 'Циклів',
    duration: 'Тривалість',
    inhale: 'Вдих',
    hold: 'Пауза',
    exhale: 'Видих',
    preparing: 'Підготовка',
  },
  en: {
    appName: APP_NAME,
    intro: 'A calm breathing rhythm starts with one tap.',
    start: 'Start',
    settings: 'Settings',
    language: 'Language',
    ukrainian: 'Ukrainian',
    english: 'English',
    close: 'Close',
    secondsShort: 's',
    cycles: 'cycles',
    cyclesLabel: 'Cycles',
    duration: 'Duration',
    inhale: 'Inhale',
    hold: 'Pause',
    exhale: 'Exhale',
    preparing: 'Prepare',
  },
} as const

export type Language = keyof typeof dictionaries
export type TranslationKey = keyof typeof dictionaries.uk

export function getInitialLanguage(
  locale: string | undefined = getBrowserLocale(),
): Language {
  return locale?.toLowerCase().startsWith('uk') ? 'uk' : 'en'
}

export function translate(language: Language, key: TranslationKey): string {
  const value = (dictionaries[language] as Record<string, string>)[key]

  if (typeof value !== 'string') {
    throw new Error(`Missing translation: ${language}.${key}`)
  }

  return value
}

export function createTranslator(language: Language): (key: TranslationKey) => string {
  return (key) => translate(language, key)
}

function getBrowserLocale(): string | undefined {
  return typeof navigator === 'undefined' ? undefined : navigator.language
}
