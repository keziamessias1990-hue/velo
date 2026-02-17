import { test, expect } from '@playwright/test';

/// AAA - Arrange, Act, Assert

const orderId = 'VLO-4RKBQ4';


test('test', async ({ page }) => {
  //Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
 
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect (page.getByRole('heading')).toContainText('Consultar Pedido');

  //Act
  await page.getByRole('textbox' , { name: 'Número do pedido' }).fill('VLO-4RKBQ4');
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();  

  //Assert
  await expect(page.getByTestId('search-order-id')).toBeVisible({ timeout:10_000 });
  await page.getByText('VLO-4RKBQ4');

  await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  await page.getByText('APROVADO').click();
});