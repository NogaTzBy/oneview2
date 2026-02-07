// Shopify Types
export interface ShopifyOrder {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
  total_price: string
  financial_status: 'pending' | 'authorized' | 'partially_paid' | 'paid' | 'partially_refunded' | 'refunded' | 'voided' | 'unpaid'
  fulfillment_status: string | null
  line_items: ShopifyLineItem[]
  customer: ShopifyCustomer | null
}

export interface ShopifyLineItem {
  id: string
  product_id: string
  variant_id: string
  title: string
  quantity: number
  price: string
}

export interface ShopifyCheckout {
  id: string
  token: string
  cart_token: string
  email: string
  created_at: string
  updated_at: string
  abandoned_checkout_url: string
  total_price: string
  line_items: ShopifyLineItem[]
  customer: ShopifyCustomer | null
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  vendor: string
  product_type: string
  created_at: string
  updated_at: string
  variants: ShopifyVariant[]
  images: ShopifyImage[]
}

export interface ShopifyVariant {
  id: string
  title: string
  price: string
  sku: string
  inventory_quantity: number
}

export interface ShopifyImage {
  id: string
  src: string
  alt: string
}

export interface ShopifyCustomer {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  orders_count: number
  total_spent: string
}

export interface ShopifyRefund {
  id: string
  order_id: string
  created_at: string
  note: string
  refund_line_items: ShopifyRefundLineItem[]
  transactions: ShopifyTransaction[]
}

export interface ShopifyRefundLineItem {
  id: string
  line_item_id: string
  quantity: number
  subtotal: string
}

export interface ShopifyTransaction {
  id: string
  amount: string
  kind: string
  status: string
}

// Database Types (Supabase)
export interface Order {
  id: string
  shopify_id: string
  shopify_name: string
  email: string
  total_price: number
  financial_status: string
  fulfillment_status: string | null
  created_at: string
  updated_at: string
  synced_at: string
}

export interface Checkout {
  id: string
  shopify_id: string
  shopify_token: string
  email: string
  total_price: number
  abandoned_at: string | null
  recovered_at: string | null
  created_at: string
  updated_at: string
  synced_at: string
}

export interface Product {
  id: string
  shopify_id: string
  title: string
  handle: string
  vendor: string
  product_type: string
  created_at: string
  updated_at: string
  synced_at: string
}

export interface Refund {
  id: string
  shopify_id: string
  order_id: string
  amount: number
  created_at: string
  synced_at: string
}

export interface Customer {
  id: string
  shopify_id: string
  email: string
  first_name: string
  last_name: string
  orders_count: number
  total_spent: number
  is_repeat_customer: boolean
  created_at: string
  updated_at: string
  synced_at: string
}

// KPI Types
export interface KPIs {
  total_revenue: number
  total_orders: number
  abandoned_checkouts: number
  recovered_checkouts: number
  first_time_customers: number
  repeat_customers: number
  pending_orders: number
  paid_orders: number
  total_refunds: number
  refunds_count: number
  star_product: {
    id: string
    title: string
    revenue: number
  } | null
  top_products: Array<{
    id: string
    title: string
    units_sold: number
    revenue: number
  }>
}

