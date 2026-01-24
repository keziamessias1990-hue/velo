import { test, expect } from '@playwright/test';

test('Webapp deve estar online, criando uma nova branch no github e fazendo um pull request' , async ({ page }) => {
  const gitHub = new GitHub(page);
  await page.goto('http://localhost:5173');

  await expect(page).toHaveURL('http://localhost:5173');
});