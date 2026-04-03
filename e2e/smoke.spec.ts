import { expect, test } from '@playwright/test'

import { login } from './helpers/session'

test.describe('mvp smoke', () => {
  test('login, refresh keeps the session, and logout clears it', async ({ page }) => {
    await login(page)

    await page.reload()
    await expect(page).toHaveURL(/\/app$/)
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
    await expect(page.locator('header nav').getByRole('link', { name: 'Overview', exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByLabel('Email')).toBeVisible()
  })

  test('assets list and detail are available, and a new asset can be created', async ({ page }) => {
    await login(page)

    await page.locator('header nav').getByRole('link', { name: 'Assets', exact: true }).click()
    await expect(page).toHaveURL(/\/app\/assets$/)
    await expect(page.locator('section').getByText('Assets', { exact: true })).toBeVisible()

    await page.getByRole('link', { name: 'New Asset' }).click()
    await expect(page).toHaveURL(/\/app\/assets\/new$/)
    await expect(page.locator('section').getByText('New Asset', { exact: true })).toBeVisible()

    const assetTag = `PW-${Date.now()}`
    await page.getByLabel('Asset tag').fill(assetTag)
    await page.getByLabel('Display name').fill('Playwright Asset')
    await page.getByLabel('Serial number').fill(`SN-${assetTag}`)
    await page.getByLabel('Hostname').fill(`pw-${assetTag.toLowerCase()}`)
    await page.getByLabel('Description').fill('Created during the Playwright smoke test.')
    await page.getByRole('button', { name: 'Create asset' }).click()

    await expect(page).toHaveURL(/\/app\/assets\/[^/]+$/)
    await expect(page.locator('section').getByText('Playwright Asset', { exact: true })).toBeVisible()
    await expect(page.locator('section').getByText(assetTag, { exact: true })).toBeVisible()

    await page.getByRole('link', { name: 'Back to assets' }).click()
    await expect(page).toHaveURL(/\/app\/assets$/)
    await expect(page.locator('section').getByText(assetTag, { exact: true })).toBeVisible()
  })

  test('users list and detail are available', async ({ page }) => {
    await login(page)

    await page.locator('header nav').getByRole('link', { name: 'Users', exact: true }).click()
    await expect(page).toHaveURL(/\/app\/users$/)
    await expect(page.locator('section').getByText('Users', { exact: true })).toBeVisible()

    const firstUserLink = page.locator('a[href^="/app/users/"]').first()
    await expect(firstUserLink).toBeVisible()
    await firstUserLink.click()

    await expect(page).toHaveURL(/\/app\/users\/[^/]+$/)
    await expect(page.getByText('Status', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Roles', { exact: true }).first()).toBeVisible()
  })

  test('audit logs and imports pages open without breaking', async ({ page }) => {
    await login(page)

    await page.locator('header nav').getByRole('link', { name: 'Audit Logs', exact: true }).click()
    await expect(page).toHaveURL(/\/app\/audit-logs$/)
    await expect(page.locator('section').getByText('Audit Logs', { exact: true })).toBeVisible()

    await page.locator('header nav').getByRole('link', { name: 'Imports', exact: true }).click()
    await expect(page).toHaveURL(/\/app\/imports$/)
    await expect(page.locator('section').getByText('Imports', { exact: true })).toBeVisible()
    await expect(page.getByText('Select a CSV file to start an import.')).toBeVisible()
  })
})
