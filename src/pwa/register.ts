import { registerSW } from 'virtual:pwa-register'

const SESSION_SHELL_SELECTOR = '.session-shell'
const RELOAD_RETRY_DELAY_MS = 1000

export function registerPwa(): void {
  registerSW({
    immediate: true,
    onOfflineReady: () => undefined,
    onNeedReload: reloadWhenSessionIsReady,
  })
}

// Auto-update can claim the page immediately, but an active session must finish before reload.
function reloadWhenSessionIsReady(): void {
  if (document.querySelector(SESSION_SHELL_SELECTOR) === null) {
    window.location.reload()
    return
  }

  window.setTimeout(reloadWhenSessionIsReady, RELOAD_RETRY_DELAY_MS)
}
