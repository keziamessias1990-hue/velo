import { db } from './database'
import { OrderTable } from './schema'
import { OrderDetails } from '../actions/orderLookupActions'
import crypto from 'crypto'
import { normalize } from 'path';

function normalizarValue(value: string) {
  if (!value) return '';

  return value
    .normalize('NFD')                 // separa acentos
    .replace(/[\u0300-\u036f]/g, '')  // remove acentos
    .replace(/\s+/g, '')              // remove espaços
    .toLowerCase();                  // deixa minúsculo
}

export async function insertOrder(order: OrderDetails) {

  const data = {
    id: crypto.randomUUID(),
    order_number: order.number,
    color: order.color.toLowerCase().replace(' ', '-'),
    wheel_type: order.wheels.toLowerCase().replace(' wheels', ''),
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone!,
    customer_cpf: order.customer.document!,
    payment_method: normalizarValue(order.payment),
    total_price: '40000',
    status: order.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    optionals: [],
  }

  await db.insertInto('orders').values(data).execute()
}

export async function deleteOrderByNumber(orderNumber: string) {
  await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
}

export async function deleteOrderByEmail(email: string) {
  await db.deleteFrom('orders').where('customer_email', '=', email).execute()
}