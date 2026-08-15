import { expect, test } from '@playwright/test'

test.use({ reducedMotion: 'reduce' })

test('returns to the start screen after a shortened session completes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Налаштування' }).click()

  await page.getByRole('slider', { name: 'Вдих' }).fill('1')
  await page.getByRole('slider', { name: 'Затримка дихання' }).nth(0).fill('0')
  await page.getByRole('slider', { name: 'Видих' }).fill('1')
  await page.getByRole('slider', { name: 'Затримка дихання' }).nth(1).fill('0')
  await page.getByRole('slider', { name: 'циклів' }).fill('1')
  await page.getByRole('button', { name: 'Закрити' }).click()

  await page.getByRole('button', { name: 'Почати' }).click()
  await expect(page.getByText('Підготовка')).toBeVisible()
  await expect(page.getByText('Вдих')).toBeVisible({ timeout: 8000 })
  await expect(page.locator('.tide-visual')).toBeVisible()
  await expect
    .poll(() => page.locator('.tide-fill').evaluate((element) => getComputedStyle(element).transitionDuration))
    .toContain('0s')
  await expect(page.getByText('Видих')).toBeVisible({ timeout: 8000 })
  await expect(page.getByRole('heading', { name: 'Breathing' })).toBeVisible({ timeout: 12000 })
  await expect(page.getByRole('button', { name: 'Почати' })).toBeVisible()
})
