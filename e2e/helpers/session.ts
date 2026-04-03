import { expect, type Page } from '@playwright/test'

const loginEmail = process.env.PLAYWRIGHT_LOGIN_EMAIL ?? 'admin@local.test'
const loginPassword = process.env.PLAYWRIGHT_LOGIN_PASSWORD ?? 'SenhaForte123!'

export async function login(page: Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(loginEmail)
  await page.getByLabel('Password').fill(loginPassword)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
  await expect(page.locator('section').getByText('Overview', { exact: true })).toBeVisible()
}
