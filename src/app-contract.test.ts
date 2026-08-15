import { describe, expect, it } from 'vitest'

import { APP_NAME } from './app-contract'

describe('application foundation', () => {
  it('exposes the product name used by the shell', () => {
    expect(APP_NAME).toBe('Breathing')
  })
})
