import { Page, expect } from '@playwright/test'

export function createLandingActions(page: Page) {
  return {
    async openLocalDevApp() {
      await page.goto('http://localhost:5173')
    },

    async expectDocumentTitle() {
      await expect(page).toHaveTitle(/Velô by Papito/)
    },
  }
}
