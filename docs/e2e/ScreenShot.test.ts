import { expect, test } from '@playwright/test'

test('Initial state', async ({ page }) => {
  await page.goto('/e2e.html')
  await expect(page).toHaveScreenshot()
})
