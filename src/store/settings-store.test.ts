import { describe, expect, it } from 'vitest'
import type { StateStorage } from 'zustand/middleware'

import {
  DEFAULT_BREATH_CONFIG,
  type BreathConfig,
} from '../domain/session-engine'
import {
  createSettingsStore,
  getDurationSummary,
  SETTINGS_STORAGE_KEY,
} from './settings-store'

const customConfig: BreathConfig = {
  inhaleSeconds: 5,
  holdAfterInhaleSeconds: 3,
  exhaleSeconds: 6,
  holdAfterExhaleSeconds: 2,
  cycles: 7,
}

function createMemoryStorage(initial: Record<string, string> = {}) {
  const values = { ...initial }
  const storage: StateStorage = {
    getItem: (name) => values[name] ?? null,
    setItem: (name, value) => {
      values[name] = value
    },
    removeItem: (name) => {
      delete values[name]
    },
  }

  return { storage, values }
}

describe('settings duration summary', () => {
  it('formats the default session as four minutes', () => {
    expect(getDurationSummary(DEFAULT_BREATH_CONFIG)).toEqual({
      totalSeconds: 240,
      label: '04:00',
    })
  })

  it('recalculates duration for a changed configuration', () => {
    expect(getDurationSummary(customConfig)).toEqual({
      totalSeconds: 112,
      label: '01:52',
    })
  })
})

describe('settings store validation', () => {
  it('starts with the approved default settings', () => {
    const store = createSettingsStore(createMemoryStorage().storage)

    expect(DEFAULT_BREATH_CONFIG).toEqual({
      inhaleSeconds: 4,
      holdAfterInhaleSeconds: 4,
      exhaleSeconds: 4,
      holdAfterExhaleSeconds: 4,
      cycles: 15,
    })
    expect(store.getState().config).toEqual(DEFAULT_BREATH_CONFIG)
    expect(store.getState().language).toBe('en')
  })

  it('rejects invalid phase and cycle values without partial mutation', () => {
    const store = createSettingsStore(createMemoryStorage().storage)

    expect(() => store.getState().setPhaseDuration('inhaleSeconds', 0)).toThrow()
    expect(() => store.getState().setPhaseDuration('holdAfterInhaleSeconds', 21)).toThrow()
    expect(() => store.getState().setCycles(51)).toThrow()
    expect(store.getState().config).toEqual(DEFAULT_BREATH_CONFIG)
  })

  it('accepts the maximum cycle count', () => {
    const store = createSettingsStore(createMemoryStorage().storage)

    store.getState().setCycles(50)

    expect(store.getState().config.cycles).toBe(50)
  })

  it('updates phase values, cycles, language, and can reset them', () => {
    const store = createSettingsStore(createMemoryStorage().storage)

    store.getState().setConfig(customConfig)
    store.getState().setLanguage('uk')
    expect(store.getState().config).toEqual(customConfig)
    expect(store.getState().language).toBe('uk')

    store.getState().resetToDefaults()
    expect(store.getState().config).toEqual(DEFAULT_BREATH_CONFIG)
    expect(store.getState().language).toBe('en')
  })
})

describe('settings store persistence', () => {
  it('persists only settings and language', () => {
    const { storage, values } = createMemoryStorage()
    const firstStore = createSettingsStore(storage)

    firstStore.getState().setConfig(customConfig)
    firstStore.getState().setLanguage('uk')

    const saved = JSON.parse(values[SETTINGS_STORAGE_KEY])
    expect(saved.state).toEqual({ config: customConfig, language: 'uk' })
    expect(saved.state).not.toHaveProperty('setConfig')

    const secondStore = createSettingsStore(storage)
    expect(secondStore.getState().config).toEqual(customConfig)
    expect(secondStore.getState().language).toBe('uk')
  })

  it('migrates a valid older state and resets invalid persisted values', () => {
    const legacy = createMemoryStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({
        state: { config: customConfig, language: 'uk' },
        version: 0,
      }),
    })
    const migratedStore = createSettingsStore(legacy.storage)

    expect(migratedStore.getState().config).toEqual(customConfig)
    expect(migratedStore.getState().language).toBe('uk')

    const invalid = createMemoryStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({
        state: { config: { ...customConfig, cycles: 0 }, language: 'xx' },
        version: 0,
      }),
    })
    const resetStore = createSettingsStore(invalid.storage)

    expect(resetStore.getState().config).toEqual(DEFAULT_BREATH_CONFIG)
    expect(resetStore.getState().language).toBe('en')
  })

  it('keeps defaults when stored JSON is malformed', () => {
    const malformed = createMemoryStorage({ [SETTINGS_STORAGE_KEY]: '{not-json' })

    const store = createSettingsStore(malformed.storage)

    expect(store.getState().config).toEqual(DEFAULT_BREATH_CONFIG)
  })
})
