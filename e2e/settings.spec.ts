import { expect, test } from '@playwright/test'

test('edits and persists the breathing settings', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('04 · 04 · 04 · 04 · 15 циклів · 04:00')).toBeVisible()
  await page.getByRole('button', { name: 'Налаштування' }).click()
  await expect(page.getByRole('slider', { name: 'циклів' })).toHaveAttribute('max', '50')

  await page.getByRole('slider', { name: 'Вдих' }).fill('6')
  await expect(page.getByText('15 циклів · 04:30')).toBeVisible()

  await page.getByRole('button', { name: 'Закрити' }).click()
  await page.reload()

  await expect(page.getByText('06 · 04 · 04 · 04 · 15 циклів · 04:30')).toBeVisible()
})
test('switches the start screen language before a session', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'English' }).click()

  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible()
  await expect(page.getByText('04 · 04 · 04 · 04 · 15 cycles · 04:00')).toBeVisible()
})

test('keeps settings open while switching language', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Налаштування' }).click()

  await page.getByRole('button', { name: 'English' }).click()

  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})
