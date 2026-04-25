import { test, expect } from '../support/fixtures'

test.describe('CT02 - Configuração do Veículo (Cores e Rodas)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configure')
  })

  test('deve atualizar preço e preview ao alterar cor e rodas', async ({ page }) => {
    const priceElement = page.getByTestId('total-price')
    const carImage = page.locator('img[alt^="Velô Sprint"]')

    // Checkpoint 1: preço inicial
    await expect(priceElement).toBeVisible()
    await expect(priceElement).toHaveText('R$ 40.000,00')

    // Checkpoint 2: alterar cor não altera preço base
    await page.getByRole('button', { name: 'Midnight Black' }).click()
    await expect(carImage).toHaveAttribute('src', '/src/assets/midnight-black-aero-wheels.png')
    await expect(priceElement).toHaveText('R$ 40.000,00')

    // Checkpoint 3: Sport Wheels soma +R$ 2.000,00
    await page.getByRole('button', { name: /Sport Wheels/ }).click()
    await expect(carImage).toHaveAttribute('src', '/src/assets/midnight-black-sport-wheels.png')
    await expect(priceElement).toHaveText('R$ 42.000,00')

    // Checkpoint 4: Aero Wheels retorna ao preço base
    await page.getByRole('button', { name: /Aero Wheels/ }).click()
    await expect(carImage).toHaveAttribute('src', '/src/assets/midnight-black-aero-wheels.png')
    await expect(priceElement).toHaveText('R$ 40.000,00')
  })
})

test('CT03 - deve atualizar preço ao adicionar/remover opcionais e navegar para checkout', async ({ app, page }) => {
  await app.configurator.open()

  // Checkpoint 1: preço inicial
  await app.configurator.expectPrice('R$ 40.000,00')

  // Checkpoint 2: Precision Park (+5.500)
  await app.configurator.checkOptional(/Precision Park/i)
  await app.configurator.expectPrice('R$ 45.500,00')

  // Checkpoint 3: Flux Capacitor (+5.000)
  await app.configurator.checkOptional(/Flux Capacitor/i)
  await app.configurator.expectPrice('R$ 50.500,00')

  // Checkpoint 4: remover opcionais e voltar ao base
  await app.configurator.uncheckOptional(/Precision Park/i)
  await app.configurator.expectPrice('R$ 45.000,00')

  await app.configurator.uncheckOptional(/Flux Capacitor/i)
  await app.configurator.expectPrice('R$ 40.000,00')

  // Checkpoint 5: ir para checkout
  await app.configurator.finishConfigurator()
  await expect(page).toHaveURL(/\/order/)
})
