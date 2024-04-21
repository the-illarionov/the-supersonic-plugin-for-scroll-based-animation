import { expect, test } from '@playwright/test'

test('0', async ({ page }) => {
  await page.goto('/e2e.html')
  await sleep()
  await expect(page).toHaveScreenshot({
    animations: 'allow',
  })
})

test('500', async ({ page }) => {
  await page.goto('/e2e.html')
  await sleep()
  await page.evaluate(() => window.scrollTo(0, 500))
  await sleep()
  await expect(page).toHaveScreenshot({
    animations: 'allow',
  })
})

test('1000', async ({ page }) => {
  await page.goto('/e2e.html')
  await sleep()
  await page.evaluate(() => window.scrollTo(0, 1000))
  await sleep()
  await expect(page).toHaveScreenshot({
    animations: 'allow',
  })
})

test('3000', async ({ page }) => {
  await page.goto('/e2e.html')
  await sleep()
  await page.evaluate(() => window.scrollTo(0, 3000))
  await sleep()
  await expect(page).toHaveScreenshot({
    animations: 'allow',
  })
})

function sleep(time = 500) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}
