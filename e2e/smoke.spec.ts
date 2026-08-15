import { expect, test } from '@playwright/test'

test('shows the Breathing start shell', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Breathing')
  await expect(page.getByRole('heading', { name: 'Breathing' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Почати' })).toBeVisible()
})
