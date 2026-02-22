import { test, expect } from '@playwright/test';
import { title } from 'process';


function generateOrderCode() {
  const prefix = 'VLO-';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPart += characters[randomIndex];
  }

  return prefix + randomPart;
}

// Exemplo de uso
const order = generateOrderCode();
console.log(order);

/// AAA - Arrange, Act, Assert

const orderId = 'VLO-4RKBQ4';


test('test', async ({ page }) => {
  //Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
 
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect (page.getByRole('heading')).toContainText('Consultar Pedido');

  //Act
  await page.getByRole('textbox' , { name: 'Número do pedido' }).fill(orderId);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();  

  //Assert
  await expect(page.getByTestId('search-order-id')).toBeVisible({ timeout:10_000 });
  await page.getByText(orderId);

  await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  await page.getByText('APROVADO').click();
  
});

test('Deve exibir mensagem de erro com pedido incorreto', async ({ page }) => {

  const order = generateOrderCode();

  //Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
 
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect (page.getByRole('heading')).toContainText('Consultar Pedido');

  //Act
  await page.getByRole('textbox' , { name: 'Número do pedido' }).fill(order);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();  

  //const title = page.getByRole('heading' ,{name: 'Pedido não encontrado'});
  //await expect(title).toBeVisible();

  //const massage = page.locator('p', {hasText: 'Verifique o número do pedido e tente novamente'});
  //await expect(massage).toBeVisible();

  // root valida o html, e toMatcAriaSnapshot valida a area o e conteúdo dela
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);

});
