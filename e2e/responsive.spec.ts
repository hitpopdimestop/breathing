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

test('keeps the settings panel aligned with the welcome panel', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.getByRole('button', { name: 'Налаштування' }).click()

    const metrics = await page.evaluate(() => {
      const panel = document.querySelector('.settings-panel')?.getBoundingClientRect()

      return {
        innerHeight: window.innerHeight,
        panel,
      }
    })

    const panelCenter = (metrics.panel?.top ?? 0) + (metrics.panel?.height ?? 0) / 2
    expect(Math.abs(panelCenter - metrics.innerHeight / 2)).toBeLessThan(12)
  }
})

test('centers the language controls without a redundant brand label', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const metrics = await page.evaluate(() => {
      const toolbar = document.querySelector('.toolbar')?.getBoundingClientRect()
      const settingsButton = document.querySelector('.settings-button')?.getBoundingClientRect()

      return {
        innerWidth: window.innerWidth,
        toolbar,
        settingsButton,
      }
    })

    await expect(page.locator('.brand')).toHaveCount(0)
    const toolbarCenter = (metrics.toolbar?.left ?? 0) + (metrics.toolbar?.width ?? 0) / 2
    expect(Math.abs(toolbarCenter - metrics.innerWidth / 2)).toBeLessThan(12)
    expect(metrics.settingsButton?.width).toBeGreaterThanOrEqual(36)
    expect(metrics.settingsButton?.height).toBeGreaterThanOrEqual(36)
  }
})

test('keeps the settings control as an outlined white button', async ({ page }) => {
  await page.goto('/')

  const styles = await page.locator('.settings-button').evaluate((element) => {
    const computed = getComputedStyle(element)

    return {
      backgroundColor: computed.backgroundColor,
      color: computed.color,
      boxShadow: computed.boxShadow,
    }
  })

  expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)')
  expect(styles.color).toBe('rgb(238, 242, 213)')
  expect(styles.boxShadow).toBe('none')
})

test('closes settings with Escape or an outside click', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Налаштування' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()

  await page.getByRole('button', { name: 'Налаштування' }).click()
  await page.locator('main.shell').click({ position: { x: 8, y: 320 } })
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('keeps welcome and settings panels at one size across languages', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const welcomeUkrainian = await page.locator('.welcome').boundingBox()
    await page.getByRole('button', { name: 'English' }).click()
    const welcomeEnglish = await page.locator('.welcome').boundingBox()
    await page.getByRole('button', { name: 'Settings' }).click()
    const settings = await page.locator('.settings-panel').boundingBox()

    expect(welcomeUkrainian?.width).toBeCloseTo(welcomeEnglish?.width ?? 0)
    expect(welcomeUkrainian?.height).toBeCloseTo(welcomeEnglish?.height ?? 0)
    expect(welcomeUkrainian?.width).toBeCloseTo(settings?.width ?? 0)
    expect(welcomeUkrainian?.height).toBeCloseTo(settings?.height ?? 0)
  }
})

test('keeps the metadata row and start button stable across languages', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/')

  const headingUkrainian = await page.locator('#app-title').boundingBox()
  const buttonUkrainian = await page.getByRole('button', { name: 'Почати' }).boundingBox()
  await expect(page.locator('.session-summary')).toHaveText(
    '04 · 04 · 04 · 04 · 15 циклів · 04:00',
  )

  await page.getByRole('button', { name: 'English' }).click()

  const headingEnglish = await page.locator('#app-title').boundingBox()
  const buttonEnglish = await page.getByRole('button', { name: 'Start' }).boundingBox()
  await expect(page.locator('.session-summary')).toHaveText(
    '04 · 04 · 04 · 04 · 15 cycles · 04:00',
  )

  expect(headingUkrainian?.y).toBeCloseTo(headingEnglish?.y ?? 0)
  expect(buttonUkrainian?.y).toBeCloseTo(buttonEnglish?.y ?? 0)
})
