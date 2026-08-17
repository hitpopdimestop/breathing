import { registerSW } from 'virtual:pwa-register'

export function registerPwa(): void {
  registerSW({
    immediate: true,
    onOfflineReady: () => undefined,
    // Auto-update should not reload the visible shell; the next navigation gets the new assets.
    onNeedReload: () => undefined,
  })
}
