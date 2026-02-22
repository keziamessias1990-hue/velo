import { test, expect } from '@playwright/test';
import { title } from 'process';
import { generateOrderCode } from '../support/helpers';

/// AAA - Arrange, Act, Assert

test.describe('Consulta Pedido',  ()=> {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
 
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect (page.getByRole('heading')).toContainText('Consultar Pedido');
    })
  
  //test.afterEach(async () => {
    //console.log(
      //'afterEach: roda depois de cada teste.'
    //)
  //})
  //test.afterAll(async () => {
    //console.log(
      //'afterAll: roda uma vez depois de cada teste'
    //)
  //})

  test('Consulta pedido aprovado', async ({ page }) => {

  const orderId = 'VLO-4RKBQ4';
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

});

