-- OneView Database Schema
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_id TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  orders_count INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  is_repeat_customer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  handle TEXT,
  vendor TEXT,
  product_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_id TEXT UNIQUE NOT NULL,
  shopify_name TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  financial_status TEXT NOT NULL, -- pending, authorized, paid, refunded, etc.
  fulfillment_status TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table (for line items in orders)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  shopify_line_item_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  shopify_product_id TEXT,
  shopify_variant_id TEXT,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkouts Table (Abandoned Checkouts)
CREATE TABLE IF NOT EXISTS checkouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_id TEXT UNIQUE NOT NULL,
  shopify_token TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  abandoned_at TIMESTAMPTZ,
  recovered_at TIMESTAMPTZ, -- NULL until recovered (order created within 7 days)
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkout Items Table
CREATE TABLE IF NOT EXISTS checkout_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checkout_id UUID NOT NULL REFERENCES checkouts(id) ON DELETE CASCADE,
  shopify_line_item_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  shopify_product_id TEXT,
  shopify_variant_id TEXT,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopify_id TEXT UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_shopify_id ON customers(shopify_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_is_repeat ON customers(is_repeat_customer);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_shopify_id ON products(shopify_id);
CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_shopify_id ON orders(shopify_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_financial_status ON orders(financial_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_created_at_financial_status ON orders(created_at, financial_status);

-- Order Items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_shopify_product_id ON order_items(shopify_product_id);

-- Checkouts indexes
CREATE INDEX IF NOT EXISTS idx_checkouts_shopify_id ON checkouts(shopify_id);
CREATE INDEX IF NOT EXISTS idx_checkouts_customer_id ON checkouts(customer_id);
CREATE INDEX IF NOT EXISTS idx_checkouts_abandoned_at ON checkouts(abandoned_at);
CREATE INDEX IF NOT EXISTS idx_checkouts_recovered_at ON checkouts(recovered_at);
CREATE INDEX IF NOT EXISTS idx_checkouts_created_at ON checkouts(created_at);
CREATE INDEX IF NOT EXISTS idx_checkouts_recovered_status ON checkouts(recovered_at, abandoned_at);

-- Checkout Items indexes
CREATE INDEX IF NOT EXISTS idx_checkout_items_checkout_id ON checkout_items(checkout_id);
CREATE INDEX IF NOT EXISTS idx_checkout_items_product_id ON checkout_items(product_id);

-- Refunds indexes
CREATE INDEX IF NOT EXISTS idx_refunds_shopify_id ON refunds(shopify_id);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_created_at ON refunds(created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkouts_updated_at BEFORE UPDATE ON checkouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to mark checkout as recovered when order is created
CREATE OR REPLACE FUNCTION mark_checkout_recovered()
RETURNS TRIGGER AS $$
BEGIN
  -- If order has a customer and was created within 7 days of checkout abandonment
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE checkouts
    SET recovered_at = NEW.created_at
    WHERE customer_id = NEW.customer_id
      AND abandoned_at IS NOT NULL
      AND recovered_at IS NULL
      AND NEW.created_at <= abandoned_at + INTERVAL '7 days'
      AND NEW.created_at >= abandoned_at;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to mark checkouts as recovered
CREATE TRIGGER mark_checkout_recovered_on_order
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION mark_checkout_recovered();

-- Function to update customer repeat status
CREATE OR REPLACE FUNCTION update_customer_repeat_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET is_repeat_customer = (orders_count > 1),
      updated_at = NOW()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update customer repeat status
CREATE TRIGGER update_customer_repeat_on_order
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION update_customer_repeat_status();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- For MVP, allow all operations (will be restricted later with proper auth)
-- In production, these should be restricted based on shop/user authentication

-- Customers: Allow all operations for now
CREATE POLICY "Allow all operations on customers" ON customers
  FOR ALL USING (true) WITH CHECK (true);

-- Products: Allow all operations for now
CREATE POLICY "Allow all operations on products" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- Orders: Allow all operations for now
CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- Order Items: Allow all operations for now
CREATE POLICY "Allow all operations on order_items" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

-- Checkouts: Allow all operations for now
CREATE POLICY "Allow all operations on checkouts" ON checkouts
  FOR ALL USING (true) WITH CHECK (true);

-- Checkout Items: Allow all operations for now
CREATE POLICY "Allow all operations on checkout_items" ON checkout_items
  FOR ALL USING (true) WITH CHECK (true);

-- Refunds: Allow all operations for now
CREATE POLICY "Allow all operations on refunds" ON refunds
  FOR ALL USING (true) WITH CHECK (true);

