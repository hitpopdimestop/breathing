import { APP_NAME } from '../app-contract'

export const dictionaries = {
  uk: {
    appName: APP_NAME,
    pattern: '04–04–04–04',
    intro: 'Спокійний ритм дихання починається з одного натискання.',
    start: 'Почати',
    settings: 'Налаштування',
    language: 'Мова',
    cycles: 'циклів',
    duration: 'Тривалість',
    inhale: 'Вдих',
    hold: 'Затримка дихання',
    exhale: 'Видих',
    preparing: 'Підготовка',
    complete: 'Сесію завершено',
    repeat: 'Ще раз',
  },
  en: {
    appName: APP_NAME,
    pattern: '04–04–04–04',
    intro: 'A calm breathing rhythm starts with one tap.',
    start: 'Start',
    settings: 'Settings',
    language: 'Language',
    cycles: 'cycles',
    duration: 'Duration',
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    preparing: 'Prepare',
    complete: 'Session complete',
    repeat: 'Again',
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
