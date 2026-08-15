import { expect, test } from '@playwright/test'

test('serves install metadata and completes a shortened session offline', async ({
  page,
  context,
}) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Breathing')
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1)

  await page.getByRole('button', { name: 'Налаштування' }).click()
  await page.getByRole('slider', { name: 'Вдих' }).fill('1')
  await page.getByRole('slider', { name: 'Пауза' }).nth(0).fill('0')
  await page.getByRole('slider', { name: 'Видих' }).fill('1')
  await page.getByRole('slider', { name: 'Пауза' }).nth(1).fill('0')
  await page.getByRole('slider', { name: 'циклів' }).fill('1')
  await page.getByRole('button', { name: 'Закрити' }).click()
  await expect(page.getByText('1 циклів · 00:02')).toBeVisible()

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()

  await context.setOffline(true)
  await page.reload()

  await expect(page.getByRole('heading', { name: 'Breathing' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Почати' })).toBeVisible()
  await page.getByRole('button', { name: 'Почати' }).click()
  await expect(page.getByRole('heading', { name: 'Breathing' })).toBeVisible({ timeout: 12000 })
  await expect(page.getByRole('button', { name: 'Почати' })).toBeVisible()
})
