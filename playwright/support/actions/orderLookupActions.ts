import { Page, expect } from '@playwright/test'

export type OrderDetails = {
  number: string
  status: string
  color: string
  wheels: string
  customer: {
    name: string
    email: string
    document: string
    phone: string
  }
  payment: string
  total_price: string
}

function formatBrlFromDbTotal(total: string): string {
  const value = Number.parseInt(total, 10)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function createOrderLookupActions(page: Page) {
  const orderInput = page.getByTestId('search-order-id')
  const searchButton = page.locator('form:has([data-testid="search-order-id"]) button[type="submit"]')

  return {
    elements: {
      orderInput,
      searchButton,
    },

    async open() {
      await page.goto('/lookup')
    },

    async searchOrder(orderNumber: string) {
      const normalized = orderNumber.trim().toUpperCase()
      await orderInput.fill(orderNumber)
      await searchButton.click()

      const resultCard = page.getByTestId(`order-result-${normalized}`)
      const notFoundHeading = page.getByRole('heading', { name: 'Pedido não encontrado' })
      await expect(resultCard.or(notFoundHeading)).toBeVisible({ timeout: 20_000 })
    },

    async validateOrderDetails(order: OrderDetails) {
      const card = page.getByTestId(`order-result-${order.number}`)
      await expect(card).toBeVisible()

      await expect(card.getByText(order.color)).toBeVisible()
      await expect(card.getByText(order.customer.name)).toBeVisible()
      await expect(card.getByText(order.customer.email)).toBeVisible()
      await expect(card.getByText(order.payment)).toBeVisible()
      await expect(card.getByText(formatBrlFromDbTotal(order.total_price))).toBeVisible()

      const wheelsPattern = new RegExp(order.wheels.replace(/\s+/g, '\\s+'), 'i')
      await expect(card.getByText(wheelsPattern)).toBeVisible()
    },

    async validateStatusBadge(status: string) {
      const card = page.locator('[data-testid^="order-result-"]').first()
      await expect(card.getByText(status, { exact: true })).toBeVisible()
    },

    async validateOrderNotFound() {
      await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible()
    },
  }
}
