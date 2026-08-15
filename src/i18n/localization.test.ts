import { describe, expect, it } from 'vitest'

import {
  dictionaries,
  getInitialLanguage,
  translate,
  type TranslationKey,
} from './localization'

describe('localization dictionaries', () => {
  it('keeps Ukrainian and English keys in parity', () => {
    expect(Object.keys(dictionaries.uk).sort()).toEqual(Object.keys(dictionaries.en).sort())
  })

  it('uses the agreed concise phase labels', () => {
    expect(translate('uk', 'inhale')).toBe('Вдих')
    expect(translate('uk', 'hold')).toBe('Пауза')
    expect(translate('uk', 'exhale')).toBe('Видих')
    expect(translate('en', 'inhale')).toBe('Inhale')
    expect(translate('en', 'hold')).toBe('Pause')
    expect(translate('en', 'exhale')).toBe('Exhale')
  })

  it('selects Ukrainian only for Ukrainian browser locales', () => {
    expect(getInitialLanguage('uk')).toBe('uk')
    expect(getInitialLanguage('uk-UA')).toBe('uk')
    expect(getInitialLanguage('en-US')).toBe('en')
    expect(getInitialLanguage('pl-PL')).toBe('en')
    expect(getInitialLanguage(undefined)).toBe('en')
  })

  it('fails loudly when a runtime key is missing', () => {
    expect(() => translate('uk', 'missing' as TranslationKey)).toThrow(
      'Missing translation: uk.missing',
    )
  })
})
