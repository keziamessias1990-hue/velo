import { db } from './database'
import { OrderTable } from './schema'

export async function insertOrder(data: OrderTable) {
  await db.insertInto('orders').values(data).execute()
}

export async function deleteOrderByNumber(orderNumber: string) {
  await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
}

export async function deleteOrderByEmail(email: string) {
  await db.deleteFrom('orders').where('customer_email', '=', email).execute()
}