import { test, expect } from '../support/fixtures'

type CreateOrderPayload = {
  order_number: string
  color: string
  wheel_type: string
  optionals: string[] | null
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_cpf: string
  payment_method: 'avista' | 'financiamento'
  total_price: number
  status: 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'
  created_at: string
  updated_at: string
  id: string
}

async function mockOrderCreation(page: import('@playwright/test').Page, overrides: Partial<CreateOrderPayload> = {}) {
  await page.route('**/rest/v1/orders*', async route => {
    if (route.request().method() !== 'POST') {
      await route.fallback()
      return
    }

    const now = new Date().toISOString()
    const payload = route.request().postDataJSON() as Record<string, unknown>

    const body: CreateOrderPayload = {
      id: 'mock-order-id',
      order_number: 'VLO-MOCK01',
      color: String(payload.color ?? 'glacier-blue'),
      wheel_type: String(payload.wheel_type ?? 'aero'),
      optionals: (payload.optionals as string[] | null) ?? [],
      customer_name: String(payload.customer_name ?? 'Cliente Teste'),
      customer_email: String(payload.customer_email ?? 'cliente@teste.com'),
      customer_phone: String(payload.customer_phone ?? '(11) 99999-9999'),
      customer_cpf: String(payload.customer_cpf ?? '000.000.000-00'),
      payment_method: (payload.payment_method as 'avista' | 'financiamento') ?? 'avista',
      total_price: Number(payload.total_price ?? 40000),
      status: (payload.status as 'APROVADO' | 'REPROVADO' | 'EM_ANALISE') ?? 'APROVADO',
      created_at: now,
      updated_at: now,
      ...overrides,
    }

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  })
}

test.describe('Checkout', () => {



  test.describe('Validações de campos obrigatórios', () => {

    let alerts: any

    test.beforeEach(async ({ page, app }) => {
      await page.goto('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()

      alerts = app.checkout.elements.alerts
    })


    test('deve validar obrigatoriedade de todos os campos em branco', async ({ app }) => {
      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
      await expect(alerts.email).toHaveText('Email inválido')
      await expect(alerts.phone).toHaveText('Telefone inválido')
      await expect(alerts.document).toHaveText('CPF inválido')
      await expect(alerts.store).toHaveText('Selecione uma loja')
      await expect(alerts.terms).toHaveText('Aceite os termos')
    })

    test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ app }) => {

      const customer = {
        name: 'A',
        lastname: 'B',
        email: 'papito@teste.com',
        document: '00000014141',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    })

    test('deve exibir erro para e-mail com formato inválido', async ({ app }) => {
      const customer = {
        name: 'Fernando',
        lastname: 'Papito',
        email: '',
        document: '00000014141',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.email).toHaveText('Email inválido')
    })

    test('deve exibir erro para CPF inválido', async ({ app }) => {

      const customer = {
        name: 'Fernando',
        lastname: 'Papito',
        email: 'papito@test.com',
        document: '',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.document).toHaveText('CPF inválido')
    })

    test('deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ app }) => {

      const customer = {
        name: 'Fernando',
        lastname: 'Papito',
        email: 'papito@test.com',
        document: '00000014199',
        phone: '(11) 99999-9999'
      }

      // Arrange
      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')

      await expect(app.checkout.elements.terms).not.toBeChecked()

      // Act
      await app.checkout.submit()

      // Assert
      await expect(alerts.terms).toHaveText('Aceite os termos')
    })
  })

  test.describe('Pagamento e Confirmação', () => {

    test('deve criar um pedido com sucesso para pagamento à vista', async ({ page, app }) => {

      const customer = {
        name: 'Fernando',
        lastname: 'Papito',
        email: 'papito@teste.com',
        document: '05366127068',
        phone: '(11) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'À Vista',
        totalPrice: 'R$ 40.000,00'
      }

      await mockOrderCreation(page, {
        customer_email: customer.email,
        status: 'APROVADO',
      })

      // Arrange
      await page.goto('/')
      await page.getByRole('link', { name: /Configure Agora/i }).click()

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      // Act
      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      await app.checkout.expectSummaryTotal(customer.totalPrice)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert
      await expect(page).toHaveURL(/\/success/)
      await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible()
    })

    test('deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento', async ({ page, app }) => {

      const customer = {
        name: 'Steve',
        lastname: 'Woz',
        email: 'woz@velo.dev',
        document: '65493881047',
        phone: '(11) 99999-9999',
        store: 'Velô Paulista',
        paymentMethod: 'Financiamento',
        totalPrice: 'R$ 40.000,00'
      }

      await mockOrderCreation(page, {
        customer_email: customer.email,
        payment_method: 'financiamento',
        status: 'APROVADO',
      })

      await page.route('**/functions/v1/credit-analysis', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'Done',
            score: 710,
          }),
        })
      })

      // Arrange
      await page.goto('/')
      await page.getByRole('link', { name: /Configure Agora/i }).click()

      await app.configurator.expectPrice(customer.totalPrice)
      await app.configurator.finishConfigurator()
      await app.checkout.expectLoaded()

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore(customer.store)

      // Act
      await app.checkout.selectPaymentMethod(customer.paymentMethod)
      // await app.checkout.expectSummaryTotal(customer.totalPrice)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      // Assert
      await expect(page).toHaveURL(/\/success/)
      await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible()
    })
  })
})