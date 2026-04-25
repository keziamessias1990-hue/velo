import { Page, expect } from '@playwright/test'

export function createCheckoutActions(page: Page) {

  const terms = page.getByTestId('checkout-terms')

  const alerts = {
    name: page.getByText('Nome deve ter pelo menos 2 caracteres', { exact: true }),
    lastname: page.getByText('Sobrenome deve ter pelo menos 2 caracteres', { exact: true }),
    email: page.getByText('Email inválido', { exact: true }),
    phone: page.getByText('Telefone inválido', { exact: true }),
    document: page.getByText('CPF inválido', { exact: true }),
    store: page.getByText('Selecione uma loja', { exact: true }).last(),
    terms: page.getByText('Aceite os termos', { exact: true })
  }


  return {

    elements: {
      terms,
      alerts
    },

    async expectLoaded() {
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async expectSummaryTotal(price: string) {
      await expect(page.getByTestId('summary-total-price')).toHaveText(price)
    },

    async fillCustomerData(data: {
      name: string
      lastname: string
      email: string
      phone: string
      document: string
    }) {
      await page.getByTestId('checkout-name').fill(data.name)
      await page.getByTestId('checkout-surname').fill(data.lastname)
      await page.getByTestId('checkout-email').fill(data.email)
      await page.getByTestId('checkout-phone').fill(data.phone)
      await page.getByTestId('checkout-cpf').fill(data.document)
    },

    async selectStore(storeName: string) {
      await page.getByTestId('checkout-store').click()
      await page.getByRole('option', { name: storeName }).click()
    },

    async selectPaymentMethod(method: string) {
      await page.getByRole('button', { name: new RegExp(method, 'i') }).click()
    },

    async acceptTerms() {
      await terms.check()
    },

    async submit() {
      await page.getByRole('button', { name: 'Confirmar Pedido' }).click()
    },
  }
}