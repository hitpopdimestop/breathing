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
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)
    await expect(page.getByRole('heading', { name: 'Breathing' })).toBeVisible()
  }
})
