import { beforeEach, describe, expect, it, vi } from 'vitest'

const { registerSW } = vi.hoisted(() => ({ registerSW: vi.fn() }))

vi.mock('virtual:pwa-register', () => ({ registerSW }))

import { registerPwa } from './register'

describe('PWA registration', () => {
  beforeEach(() => {
    registerSW.mockReset()
  })

  it('updates the service worker without forcing a visible page reload', () => {
    registerPwa()

    expect(registerSW).toHaveBeenCalledOnce()
    const options = registerSW.mock.calls[0]?.[0]

    expect(options).toMatchObject({ immediate: true })
    expect(options.onNeedReload).toEqual(expect.any(Function))
    expect(options.onNeedReload()).toBeUndefined()
  })
})
