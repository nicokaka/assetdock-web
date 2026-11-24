import { expect, test } from '@playwright/test'

test.describe('Health Check Status', () => {
  test('home page shows API Online when backend is running', async ({ page }) => {
    await page.goto('/')
    
    // We expect the "API Online" badge to be visible.
    // The timeout is slightly longer to account for React Query's initial fetch
    await expect(page.getByText('API Online')).toBeVisible({ timeout: 10_000 })
  })

  test('home page shows API Offline when backend is down', async ({ page }) => {
    // Mock the backend info endpoint to abort the connection (simulate offline)
    await page.route('**/api/v1/info', route => route.abort())
    
    await page.goto('/')
    
    // With the network request aborted, it should show API Offline
    await expect(page.getByText('API Offline')).toBeVisible({ timeout: 5_000 })
  })
})
