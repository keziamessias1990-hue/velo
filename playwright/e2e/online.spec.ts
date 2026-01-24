import { test, expect } from '@playwright/test';

test('Webapp deve estar online, testes teste', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page).toHaveURL('http://localhost:5173');
});
