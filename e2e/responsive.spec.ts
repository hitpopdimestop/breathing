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

test('stays within a narrow viewport when mobile page zoom reduces layout width', async ({ page }) => {
  await page.setViewportSize({ width: 280, height: 700 })
  await page.goto('/')

  const dimensions = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    header: document.querySelector('.app-header')?.getBoundingClientRect(),
    welcome: document.querySelector('.welcome')?.getBoundingClientRect(),
  }))

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)
  expect(dimensions.welcome?.left).toBeGreaterThanOrEqual(0)
  expect(dimensions.welcome?.right).toBeLessThanOrEqual(dimensions.innerWidth)
  expect(dimensions.welcome?.top).toBeGreaterThanOrEqual((dimensions.header?.bottom ?? 0) + 8)

  await page.getByRole('button', { name: 'Налаштування' }).click()
  const settingsDimensions = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    header: document.querySelector('.app-header')?.getBoundingClientRect(),
    panel: document.querySelector('.settings-panel')?.getBoundingClientRect(),
    close: document.querySelector('.settings-heading .close-button')?.getBoundingClientRect(),
  }))

  expect(settingsDimensions.scrollWidth).toBeLessThanOrEqual(settingsDimensions.innerWidth)
  expect(settingsDimensions.panel?.top).toBeGreaterThanOrEqual(
    (settingsDimensions.header?.bottom ?? 0) + 8,
  )
  expect(settingsDimensions.close?.right).toBeLessThanOrEqual(settingsDimensions.innerWidth)
})

test('keeps the start card below controls in a short mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 560 })
  await page.goto('/')

  const metrics = await page.evaluate(() => ({
    header: document.querySelector('.app-header')?.getBoundingClientRect(),
    welcome: document.querySelector('.welcome')?.getBoundingClientRect(),
  }))

  expect(metrics.welcome?.top).toBeGreaterThanOrEqual((metrics.header?.bottom ?? 0) + 8)
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
        wavePath: document.querySelector('.tide-wave')?.getAttribute('d'),
      }
    })

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth)
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight)
    expect(metrics.tide?.width).toBe(metrics.innerWidth)
    expect(metrics.tide?.height).toBe(metrics.innerHeight)
    expect(metrics.content?.left).toBeGreaterThanOrEqual(0)
    expect(metrics.content?.right).toBeLessThanOrEqual(metrics.innerWidth)
    expect(metrics.wavePath).toBe(
      'M0 -6 Q17 -16 34 -6 Q51 2 69 -6 Q85 -16 100 -6 L100 100 L0 100 Z',
    )

    const tideStyles = await page.locator('.tide-fill').evaluate((element) => getComputedStyle(element))
    expect(tideStyles.transitionDuration).toBe('0s')
  }
})

test('optically aligns the phase label with its countdown', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Почати' }).click()
  await expect(page.getByText('Вдих')).toBeVisible({ timeout: 8000 })

  const centers = await page.evaluate(() => {
    const label = document.querySelector('.session-label')?.getBoundingClientRect()
    const countdown = document.querySelector('.session-countdown')?.getBoundingClientRect()

    return {
      label: (label?.left ?? 0) + (label?.width ?? 0) / 2,
      countdown: (countdown?.left ?? 0) + (countdown?.width ?? 0) / 2,
    }
  })

  expect(centers.label).toBeGreaterThan(centers.countdown)
  expect(centers.label - centers.countdown).toBeLessThan(4)
})

test('gives mobile controls comfortable touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/')

  const metrics = await page.evaluate(() => ({
    settingsButton: document.querySelector('.settings-button')?.getBoundingClientRect(),
    languageSwitcher: document.querySelector('.language-switcher')?.getBoundingClientRect(),
    languageButtons: [...document.querySelectorAll('.language-button')].map((button) =>
      button.getBoundingClientRect(),
    ),
  }))

  expect(metrics.settingsButton?.width).toBeGreaterThanOrEqual(44)
  expect(metrics.settingsButton?.height).toBeGreaterThanOrEqual(44)
  expect(metrics.languageSwitcher?.height).toBeGreaterThanOrEqual(44)
  expect(metrics.languageButtons.every((button) => button.height >= 44)).toBe(true)

  await page.getByRole('button', { name: 'Налаштування' }).click()
  const settingsMetrics = await page.evaluate(() => ({
    close: document.querySelector('.close-button')?.getBoundingClientRect(),
    sliders: [...document.querySelectorAll<HTMLInputElement>('input[type="range"]')].map(
      (slider) => slider.getBoundingClientRect(),
    ),
  }))

  expect(settingsMetrics.close?.width).toBeGreaterThanOrEqual(44)
  expect(settingsMetrics.close?.height).toBeGreaterThanOrEqual(44)
  expect(settingsMetrics.sliders.every((slider) => slider.height >= 44)).toBe(true)
})

test('keeps the settings panel below the mobile toolbar', async ({ page }) => {
  for (const viewport of [
    { width: 280, height: 700 },
    { width: 320, height: 700 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.getByRole('button', { name: 'Налаштування' }).click()

    const metrics = await page.evaluate(() => ({
      header: document.querySelector('.app-header')?.getBoundingClientRect(),
      panel: document.querySelector('.settings-panel')?.getBoundingClientRect(),
    }))

    expect(metrics.panel?.top).toBeGreaterThanOrEqual((metrics.header?.bottom ?? 0) + 4)
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
    expect(metrics.settingsButton?.width).toBeGreaterThanOrEqual(32)
    expect(metrics.settingsButton?.height).toBeGreaterThanOrEqual(32)
  }
})

test('keeps the settings control as an outlined white button', async ({ page }) => {
  await page.goto('/')

  const settingsButton = page.locator('.settings-button')
  const metrics = await page.evaluate(() => {
    const settingsButton = document.querySelector('.settings-button')?.getBoundingClientRect()
    const languageSwitcher = document.querySelector('.language-switcher')?.getBoundingClientRect()
    const settingsStyles = getComputedStyle(document.querySelector('.settings-button')!)
    const languageStyles = getComputedStyle(document.querySelector('.language-switcher')!)

    return {
      settingsButton,
      languageSwitcher,
      settingsBackgroundColor: settingsStyles.backgroundColor,
      settingsColor: settingsStyles.color,
      settingsBorderColor: settingsStyles.borderTopColor,
      settingsBoxShadow: settingsStyles.boxShadow,
      settingsTransition: settingsStyles.transitionDuration,
      languageBorderColor: languageStyles.borderTopColor,
    }
  })

  expect(metrics.settingsButton?.width).toBeCloseTo(metrics.settingsButton?.height ?? 0)
  expect(metrics.settingsButton?.height).toBeCloseTo(metrics.languageSwitcher?.height ?? 0)
  expect(metrics.settingsBackgroundColor).toBe('rgba(0, 0, 0, 0)')
  expect(metrics.settingsColor).toBe('rgb(238, 242, 213)')
  expect(metrics.settingsBorderColor).toBe(metrics.languageBorderColor)
  expect(metrics.settingsBoxShadow).toBe('none')

  await settingsButton.hover()
  const hoveredStyles = await settingsButton.evaluate((element) => {
    const computed = getComputedStyle(element)
    return {
      backgroundColor: computed.backgroundColor,
      transform: computed.transform,
    }
  })

  expect(metrics.settingsTransition).toBe('0s')
  expect(hoveredStyles.backgroundColor).toBe(metrics.settingsBackgroundColor)
  expect(hoveredStyles.transform).toBe('none')
  await expect(settingsButton.locator('svg')).toHaveCount(1)
})

test('centers the settings gear inside its button', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const centers = await page.evaluate(() => {
      const button = document.querySelector('.settings-button')?.getBoundingClientRect()
      const icon = document.querySelector('.settings-button svg')?.getBoundingClientRect()

      return {
        button: {
          x: (button?.left ?? 0) + (button?.width ?? 0) / 2,
          y: (button?.top ?? 0) + (button?.height ?? 0) / 2,
        },
        icon: {
          x: (icon?.left ?? 0) + (icon?.width ?? 0) / 2,
          y: (icon?.top ?? 0) + (icon?.height ?? 0) / 2,
        },
      }
    })

    expect(Math.abs(centers.icon.x - centers.button.x)).toBeLessThan(1)
    expect(Math.abs(centers.icon.y - centers.button.y)).toBeLessThan(1)
  }
})

test('aligns the close icon with the settings values', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await page.getByRole('button', { name: 'Налаштування' }).click()

    const edges = await page.evaluate(() => {
      const close = document.querySelector('.close-button svg')?.getBoundingClientRect()
      const value = document.querySelector('.range-value')?.getBoundingClientRect()

      return {
        closeRight: close?.right ?? 0,
        valueRight: value?.right ?? 0,
      }
    })

    expect(Math.abs(edges.closeRight - edges.valueRight)).toBeLessThan(1)
  }
})

test('keeps the settings gear complete at desktop and mobile sizes', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/')

    const geometry = await page.locator('.settings-button svg').evaluate((svg) => {
      const path = svg.querySelector('path')
      const bounds = path?.getBBox()
      return {
        width: bounds?.width ?? 0,
        height: bounds?.height ?? 0,
      }
    })

    expect(geometry.width).toBeGreaterThanOrEqual(17)
    expect(geometry.height).toBeGreaterThanOrEqual(17)
  }
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
