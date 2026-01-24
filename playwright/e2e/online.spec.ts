import { test, expect } from '@playwright/test';

test('A Webapp deve estar online', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page).toHaveURL('http://localhost:5173');
});


