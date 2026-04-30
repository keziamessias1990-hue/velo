import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLookupActions'
import { deleteOrderByNumber, insertOrder } from '../support/database/orderRepository'
import data from '../support/fixtures/orders.json' with { type: 'json' }

test.describe('Consulta de Pedido', () => {
  let createdOrders: string[] = []

  test.afterAll(async () => {
    for (const code of createdOrders) {
      await deleteOrderByNumber(code)
    }
  })

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {
    const code = generateOrderCode()
    createdOrders.push(code)
    const order = {
      number: code,
      ...data.aprovado
    } as OrderDetails
    await deleteOrderByNumber(order.number)
    await insertOrder(order)

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {
    const code = generateOrderCode()
    createdOrders.push(code)
    const order = {
      number: code,
      ...data.reprovado
    } as OrderDetails

   await deleteOrderByNumber(order.number)
   await insertOrder(order)

   await app.orderLookup.searchOrder(order.number)
   await app.orderLookup.validateOrderDetails(order)
   await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {
    const code = generateOrderCode()
    createdOrders.push(code)
    const order = {
      number: code,
      ...data.em_analise
    } as OrderDetails

    await deleteOrderByNumber(order.number)
    await insertOrder(order)

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