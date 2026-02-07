# Diseño de Base de Datos - OneView

## 📊 Resumen

Este documento describe el esquema de base de datos para OneView, diseñado para almacenar y analizar datos de tiendas Shopify.

## 🗂️ Estructura de Tablas

### 1. `customers` - Clientes
Almacena información de los clientes de Shopify.

**Campos principales:**
- `shopify_id`: ID único de Shopify
- `email`: Email del cliente
- `first_name`, `last_name`: Nombre del cliente
- `orders_count`: Cantidad de pedidos realizados
- `total_spent`: Total gastado por el cliente
- `is_repeat_customer`: Boolean que indica si es cliente recurrente (orders_count > 1)

**Índices:**
- `shopify_id` (único)
- `email`
- `is_repeat_customer` (para segmentación)
- `created_at` (para filtros temporales)

---

### 2. `products` - Productos
Almacena información de los productos de Shopify.

**Campos principales:**
- `shopify_id`: ID único de Shopify
- `title`: Nombre del producto
- `handle`: URL slug del producto
- `vendor`: Proveedor
- `product_type`: Tipo de producto

**Índices:**
- `shopify_id` (único)
- `handle` (para búsquedas)

---

### 3. `orders` - Pedidos
Almacena información de los pedidos de Shopify.

**Campos principales:**
- `shopify_id`: ID único de Shopify
- `shopify_name`: Nombre del pedido (ej: #1001)
- `customer_id`: Referencia al cliente (FK)
- `email`: Email del cliente
- `total_price`: Precio total del pedido
- `financial_status`: Estado de pago (pending, authorized, paid, refunded, etc.)
- `fulfillment_status`: Estado de cumplimiento
- `created_at`: Fecha de creación del pedido

**Índices:**
- `shopify_id` (único)
- `customer_id` (para relaciones)
- `financial_status` (para KPIs de estados de pago)
- `created_at` (para filtros temporales)
- `(created_at, financial_status)` (compuesto para consultas de KPIs)

**Relaciones:**
- `customer_id` → `customers.id`

---

### 4. `order_items` - Items de Pedidos
Almacena los productos incluidos en cada pedido.

**Campos principales:**
- `order_id`: Referencia al pedido (FK)
- `shopify_line_item_id`: ID del line item en Shopify
- `product_id`: Referencia al producto (FK)
- `shopify_product_id`: ID del producto en Shopify
- `shopify_variant_id`: ID de la variante en Shopify
- `title`: Nombre del producto/variante
- `quantity`: Cantidad
- `price`: Precio unitario

**Índices:**
- `order_id` (para consultas por pedido)
- `product_id` (para análisis de productos)
- `shopify_product_id` (para sincronización)

**Relaciones:**
- `order_id` → `orders.id`
- `product_id` → `products.id`

---

### 5. `checkouts` - Carritos Abandonados
Almacena información de los carritos abandonados (checkouts).

**Campos principales:**
- `shopify_id`: ID único de Shopify
- `shopify_token`: Token del checkout
- `customer_id`: Referencia al cliente (FK)
- `email`: Email del cliente
- `total_price`: Precio total del carrito
- `abandoned_at`: Fecha en que se abandonó (NULL si aún está activo)
- `recovered_at`: Fecha en que se recuperó (cuando se creó un pedido dentro de 7 días)

**Índices:**
- `shopify_id` (único)
- `customer_id` (para relaciones)
- `abandoned_at` (para consultas de carritos abandonados)
- `recovered_at` (para consultas de carritos recuperados)
- `(recovered_at, abandoned_at)` (compuesto para consultas de recuperación)

**Relaciones:**
- `customer_id` → `customers.id`

**Lógica de recuperación:**
- Un checkout se marca como "recuperado" cuando:
  1. Se crea un pedido (`order`) con el mismo `customer_id`
  2. El pedido se crea dentro de 7 días después de `abandoned_at`
  3. Esto se hace automáticamente mediante un trigger

---

### 6. `checkout_items` - Items de Carritos
Almacena los productos incluidos en cada carrito abandonado.

**Campos principales:**
- `checkout_id`: Referencia al checkout (FK)
- `shopify_line_item_id`: ID del line item en Shopify
- `product_id`: Referencia al producto (FK)
- `shopify_product_id`: ID del producto en Shopify
- `shopify_variant_id`: ID de la variante en Shopify
- `title`: Nombre del producto/variante
- `quantity`: Cantidad
- `price`: Precio unitario

**Índices:**
- `checkout_id` (para consultas por checkout)
- `product_id` (para análisis de productos)

**Relaciones:**
- `checkout_id` → `checkouts.id`
- `product_id` → `products.id`

---

### 7. `refunds` - Reembolsos
Almacena información de los reembolsos.

**Campos principales:**
- `shopify_id`: ID único de Shopify
- `order_id`: Referencia al pedido reembolsado (FK)
- `amount`: Monto del reembolso
- `note`: Nota del reembolso
- `created_at`: Fecha del reembolso

**Índices:**
- `shopify_id` (único)
- `order_id` (para consultas por pedido)
- `created_at` (para filtros temporales)

**Relaciones:**
- `order_id` → `orders.id`

---

## 🔄 Funciones y Triggers

### 1. `update_updated_at_column()`
Actualiza automáticamente el campo `updated_at` cuando se modifica un registro.

**Aplicado a:**
- `customers`
- `products`
- `orders`
- `checkouts`

### 2. `mark_checkout_recovered()`
Marca automáticamente un checkout como recuperado cuando se crea un pedido relacionado.

**Condiciones:**
- El pedido debe tener un `customer_id`
- El pedido debe crearse dentro de 7 días después de `abandoned_at`
- El checkout debe tener `recovered_at = NULL`

### 3. `update_customer_repeat_status()`
Actualiza automáticamente `is_repeat_customer` cuando se crea un nuevo pedido.

**Lógica:**
- Si `orders_count > 1`, entonces `is_repeat_customer = true`

---

## 🔍 Índices para Optimización

### Consultas de KPIs

Los índices están optimizados para las siguientes consultas frecuentes:

1. **Facturación total por rango de fechas:**
   - `idx_orders_created_at` + `idx_orders_financial_status`

2. **Cantidad de pedidos:**
   - `idx_orders_created_at`

3. **Carritos abandonados:**
   - `idx_checkouts_abandoned_at`

4. **Carritos recuperados (7 días):**
   - `idx_checkouts_recovered_status` (compuesto)

5. **Compradores 1 vez vs recurrentes:**
   - `idx_customers_is_repeat`

6. **Pedidos por estado de pago:**
   - `idx_orders_created_at_financial_status` (compuesto)

7. **Top productos:**
   - `idx_order_items_product_id` + `idx_order_items_order_id`

8. **Reembolsos:**
   - `idx_refunds_created_at` + `idx_refunds_order_id`

---

## 🔒 Row Level Security (RLS)

### Estado Actual (MVP)

Para el MVP, todas las tablas tienen políticas que permiten todas las operaciones (`USING (true) WITH CHECK (true)`).

**⚠️ IMPORTANTE:** En producción, estas políticas deben ser restringidas según:
- Autenticación del usuario
- Asociación con la tienda (shop_id) cuando se implemente multi-tenancy
- Roles y permisos del usuario

### Políticas Futuras (v2.0)

```sql
-- Ejemplo de política futura (no implementada aún)
CREATE POLICY "Users can only see their shop's data" ON orders
  FOR ALL USING (
    shop_id IN (
      SELECT shop_id FROM user_shops WHERE user_id = auth.uid()
    )
  );
```

---

## 📈 Consideraciones de Performance

1. **Índices compuestos:** Se usan para consultas que filtran por múltiples campos (ej: fecha + estado)

2. **Cascadas:** Las relaciones usan `ON DELETE CASCADE` para mantener integridad referencial

3. **Timestamps:** Todos los timestamps usan `TIMESTAMPTZ` para manejar zonas horarias correctamente

4. **Decimales:** Los precios usan `DECIMAL(10, 2)` para precisión financiera

5. **Sincronización:** El campo `synced_at` permite rastrear cuándo se sincronizó cada registro con Shopify

---

## 🔄 Flujo de Datos

1. **Sincronización inicial:**
   - Se cargan datos históricos desde Shopify API
   - Se crean registros en todas las tablas relevantes

2. **Sincronización continua (webhooks):**
   - Los webhooks actualizan datos en tiempo real
   - Se actualiza `synced_at` en cada sincronización

3. **Sincronización programada (5 min):**
   - Reconciliación de datos
   - Actualización de campos calculados (ej: `is_repeat_customer`)

4. **Cálculo de KPIs:**
   - Se calculan en tiempo real desde las tablas
   - Los índices optimizan estas consultas

---

## 📝 Notas de Implementación

- El esquema está diseñado para escalar a múltiples tiendas (aunque no está en el MVP)
- Se puede agregar un campo `shop_id` en el futuro sin romper la estructura actual
- Los triggers automáticos reducen la lógica de aplicación necesaria
- Las políticas RLS se pueden ajustar sin cambiar el esquema

---

**Última actualización:** Diciembre 2024  
**Versión del esquema:** 1.0

