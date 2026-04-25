import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLookupActions'

import testData from '../support/data/orders.json' with { type: 'json' }

type MockLookupDbOrder = {
  id: string
  order_number: string
  color: string
  wheel_type: string
  optionals: string[]
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_cpf: string
  payment_method: 'avista' | 'financiamento'
  total_price: number
  status: string
  created_at: string
  updated_at: string
}

function toDbOrder(order: OrderDetails): MockLookupDbOrder {
  const payment = order.payment.toLowerCase().includes('vista') ? 'avista' : 'financiamento'

  return {
    id: `mock-${order.number.toLowerCase()}`,
    order_number: order.number,
    color: order.color.toLowerCase().replace(/\s+/g, '-'),
    wheel_type: order.wheels.toLowerCase().includes('sport') ? 'sport' : 'aero',
    optionals: [],
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_cpf: order.customer.document,
    payment_method: payment,
    total_price: Number.parseInt(order.total_price, 10),
    status: order.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

async function mockLookupOrder(
  page: import('@playwright/test').Page,
  expectedOrderNumber: string,
  order: OrderDetails | null
) {
  await page.route('**/rest/v1/orders*', async route => {
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }

    const requestUrl = new URL(route.request().url())
    const queryFilter = requestUrl.searchParams.get('order_number') ?? ''
    const requestedOrderNumber = queryFilter.replace('eq.', '').trim().toUpperCase()

    if (requestedOrderNumber !== expectedOrderNumber.trim().toUpperCase()) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
      return
    }

    const body = order ? [toDbOrder(order)] : []

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  })
}

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app, page }) => {
    const order: OrderDetails = testData.aprovado as OrderDetails

    await mockLookupOrder(page, order.number, order)

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app, page }) => {
    const order: OrderDetails = testData.reprovado as OrderDetails

    await mockLookupOrder(page, order.number, order)

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app, page }) => {
    const order: OrderDetails = testData.em_analise as OrderDetails

    await mockLookupOrder(page, order.number, order)

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app, page }) => {
    const order = generateOrderCode()
    await mockLookupOrder(page, order, null)
    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app, page }) => {
    const orderCode = 'XYZ-999-INVALIDO'
    await mockLookupOrder(page, orderCode, null)
    await app.orderLookup.searchOrder(orderCode)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({ app, page }) => {
    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('     ')
    await expect(button).toBeDisabled()
  })
})