import { describe, expect, it } from 'vitest'

import {
  dictionaries,
  formatCycles,
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

  it('formats cycle counts with English and Ukrainian plural rules', () => {
    expect(formatCycles('en', 1)).toBe('1 cycle')
    expect(formatCycles('en', 2)).toBe('2 cycles')

    expect(formatCycles('uk', 1)).toBe('1 цикл')
    expect(formatCycles('uk', 2)).toBe('2 цикли')
    expect(formatCycles('uk', 3)).toBe('3 цикли')
    expect(formatCycles('uk', 4)).toBe('4 цикли')
    expect(formatCycles('uk', 5)).toBe('5 циклів')
    expect(formatCycles('uk', 6)).toBe('6 циклів')
    expect(formatCycles('uk', 7)).toBe('7 циклів')
    expect(formatCycles('uk', 11)).toBe('11 циклів')
    expect(formatCycles('uk', 22)).toBe('22 цикли')
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
