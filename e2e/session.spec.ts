import { expect, test } from '@playwright/test'

test('runs a shortened session from preparation to completion', async ({ page }) => {
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
  await expect(page.getByText('Видих')).toBeVisible({ timeout: 8000 })
  await expect(page.getByText('Сесію завершено')).toBeVisible({ timeout: 12000 })
  await expect(page.getByRole('button', { name: 'Ще раз' })).toBeVisible()
})
