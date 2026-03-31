export interface Product {
  id: string
  _id?: string
  name: string
  description?: string
  price: number
  image_url?: string
  stock_quantity: number
  created_at?: string
  createdAt?: string
}

export interface Profile {
  id: string
  _id?: string
  full_name?: string
  role: string
  email?: string
}

export interface OrderItem {
  id: string
  _id?: string
  order_id?: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface Order {
  id: string
  _id?: string
  user_id: string
  total_price: number
  status: string
  created_at: string
  createdAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
  profiles?: { full_name: string }
}

export interface CreateOrderRequest {
  items: {
    product: Product
    quantity: number
  }[]
}

export interface CreateOrderResponse {
  success: boolean
  order: {
    id: string
    total_price: number
    status: string
    created_at: string
  }
  error?: string
}
