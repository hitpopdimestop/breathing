import { expect, test } from '@playwright/test'

test('fits the start screen at mobile and desktop widths', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      welcome: document.querySelector('.welcome')?.getBoundingClientRect(),
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)
    const welcomeCenter = (dimensions.welcome?.top ?? 0) + (dimensions.welcome?.height ?? 0) / 2
    expect(Math.abs(welcomeCenter - dimensions.innerHeight / 2)).toBeLessThan(12)
    await expect(page.getByRole('heading', { name: 'Breathing' })).toBeVisible()
  }
})

test('keeps the active tide full-screen and content centered', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.getByRole('button', { name: 'Почати' }).click()
    await expect(page.getByText('Вдих')).toBeVisible({ timeout: 8000 })

    const metrics = await page.evaluate(() => {
      const tide = document.querySelector('.tide-visual')?.getBoundingClientRect()
      const content = document.querySelector('.session-content')?.getBoundingClientRect()

      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        tide,
        content,
      }
    })

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth)
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight)
    expect(metrics.tide?.width).toBe(metrics.innerWidth)
    expect(metrics.tide?.height).toBe(metrics.innerHeight)
    expect(metrics.content?.left).toBeGreaterThanOrEqual(0)
    expect(metrics.content?.right).toBeLessThanOrEqual(metrics.innerWidth)
  }
})
