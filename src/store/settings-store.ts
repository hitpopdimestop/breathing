import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import {
  assertValidBreathConfig,
  DEFAULT_BREATH_CONFIG,
  getSessionDurationSeconds,
  type BreathConfig,
} from '../domain/session-engine'
import { getInitialLanguage, type Language } from '../i18n/localization'

export const SETTINGS_STORAGE_KEY = 'breathing-settings'
const SETTINGS_STORAGE_VERSION = 1

export type PhaseDurationKey = Exclude<keyof BreathConfig, 'cycles'>

export type SettingsState = Readonly<{
  config: BreathConfig
  language: Language
  setConfig: (config: BreathConfig) => void
  setPhaseDuration: (phase: PhaseDurationKey, seconds: number) => void
  setCycles: (cycles: number) => void
  setLanguage: (language: Language) => void
  resetToDefaults: () => void
}>

type PersistedSettings = Pick<SettingsState, 'config' | 'language'>

export function getDurationSummary(config: BreathConfig): {
  totalSeconds: number
  label: string
} {
  const totalSeconds = getSessionDurationSeconds(config)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return {
    totalSeconds,
    label: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  }
}

export function createSettingsStore(storage?: StateStorage) {
  return createStore<SettingsState>()(
    persist(
      (set) => ({
        config: DEFAULT_BREATH_CONFIG,
        language: getInitialLanguage(),
        setConfig: (config) => {
          assertValidBreathConfig(config)
          set({ config: { ...config } })
        },
        setPhaseDuration: (phase, seconds) => {
          set((state) => {
            const config = { ...state.config, [phase]: seconds }
            assertValidBreathConfig(config)
            return { config }
          })
        },
        setCycles: (cycles) => {
          set((state) => {
            const config = { ...state.config, cycles }
            assertValidBreathConfig(config)
            return { config }
          })
        },
        setLanguage: (language) => set({ language }),
        resetToDefaults: () =>
          set({ config: DEFAULT_BREATH_CONFIG, language: getInitialLanguage() }),
      }),
      {
        name: SETTINGS_STORAGE_KEY,
        version: SETTINGS_STORAGE_VERSION,
        storage: getPersistStorage(storage),
        partialize: ({ config, language }) => ({ config, language }),
        migrate: migratePersistedSettings,
      },
    ),
  )
}

export const settingsStore = createSettingsStore()

function getPersistStorage(storage?: StateStorage) {
  if (storage) {
    return createJSONStorage<PersistedSettings>(() => storage)
  }

  if (typeof window === 'undefined') {
    return undefined
  }

  return createJSONStorage<PersistedSettings>(() => window.localStorage)
}

function migratePersistedSettings(
  persistedState: unknown,
  _version: number,
): PersistedSettings {
  if (!isRecord(persistedState)) {
    return getDefaultPersistedSettings()
  }

  return {
    config: normalizeConfig(persistedState.config),
    language: persistedState.language === 'uk' ? 'uk' : 'en',
  }
}

function normalizeConfig(value: unknown): BreathConfig {
  if (!isRecord(value)) {
    return DEFAULT_BREATH_CONFIG
  }

  const config = {
    inhaleSeconds: value.inhaleSeconds,
    holdAfterInhaleSeconds: value.holdAfterInhaleSeconds,
    exhaleSeconds: value.exhaleSeconds,
    holdAfterExhaleSeconds: value.holdAfterExhaleSeconds,
    cycles: value.cycles,
  } as BreathConfig

  try {
    assertValidBreathConfig(config)
    return config
  } catch {
    return DEFAULT_BREATH_CONFIG
  }
}

function getDefaultPersistedSettings(): PersistedSettings {
  return {
    config: DEFAULT_BREATH_CONFIG,
    language: getInitialLanguage(),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
