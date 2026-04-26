import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLookupActions'
import { deleteOrderByNumber, insertOrder } from '../support/database/orderRepository'
import crypto from 'crypto'

test.describe('Consulta de Pedido', () => {
  let createdOrders: string[] = []

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test.beforeEach(async () => {
    for (const orderNumber of createdOrders) {
      await deleteOrderByNumber(orderNumber)
    }
    createdOrders = []
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {
    const code = generateOrderCode()
    createdOrders.push(code)
    const order: OrderDetails = {
      number: code,
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fernando Papito',
        email: 'papito@velo.dev',
        document: '780.228.290-05',
        phone: '(11) 99999-9999'
      },
      payment: 'À Vista',
      total_price: '40000'
    }

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: code,
      color: 'glacier-blue',
      wheel_type: 'aero',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone!,
      customer_cpf: order.customer.document!,
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: [],
    })

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {
    const code = generateOrderCode()
    createdOrders.push(code)
    const order: OrderDetails = {
      number: code,
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@apple.com',
        document: '780.228.290-05',
        phone: '(11) 99999-9999'
      },
      payment: 'À Vista',
      total_price: '40000'
    }

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: code,
      color: 'midnight-black',
      wheel_type: 'sport',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone!,
      customer_cpf: order.customer.document!,
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: [],
    })

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {
    const code = generateOrderCode()
    createdOrders.push(code)
    const order: OrderDetails = {
      number: code,
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'João da Silva',
        email: 'joao@velo.dev',
        document: '780.228.290-05',
        phone: '(11) 99999-9999'
      },
      payment: 'À Vista',
      total_price: '40000'
    }

    await insertOrder({
      id: crypto.randomUUID(),
      order_number: code,
      color: 'lunar-white',
      wheel_type: 'aero',
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone!,
      customer_cpf: order.customer.document!,
      payment_method: 'avista',
      total_price: '40000',
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: [],
    })

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    const order = generateOrderCode()
    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {
    const orderCode = 'XYZ-999-INVALIDO'
    await app.orderLookup.searchOrder(orderCode)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({ app }) => {
    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLookup.elements.orderInput.fill('     ')
    await expect(button).toBeDisabled()
  })
})