export interface OrderTable {
    id: string
    order_number: string
    color: string
    wheel_type: string
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_cpf: string
    payment_method: string
    total_price: string
    status: string
    created_at: Date | string
    updated_at: Date | string
    optionals: string[]
  }
  
  export interface Database {
    orders: OrderTable
  }