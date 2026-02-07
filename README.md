# OneView

Un dashboard de análisis y gestión para tiendas Shopify que proporciona una vista consolidada de KPIs, métricas de negocio y listas detalladas de pedidos, carritos abandonados, productos y reembolsos.

## 📋 Descripción

OneView es una aplicación MVP diseñada para ofrecer a los comerciantes de Shopify una visión clara y accionable de su negocio. La plataforma integra datos de Shopify mediante webhooks y sincronización programada, almacenándolos en Supabase para un acceso rápido y eficiente.

## ✨ Características (v1.0)

### Dashboard con KPIs

El dashboard principal incluye los siguientes indicadores clave de rendimiento (según el rango de fechas seleccionado):

- **Facturación total**: Ingresos generados en el período
- **Cantidad de pedidos**: Total de pedidos realizados
- **Carritos abandonados**: Cantidad de checkouts abandonados
- **Carritos recuperados**: Cantidad recuperada según regla de 7 días
- **Segmentación de clientes**: Compradores de primera vez vs. compradores recurrentes
- **Pedidos por estado de pago**:
  - Pendiente: `pending`, `authorized`, `unpaid`
  - Pagado: `paid`
- **Top productos**: Unidades vendidas y facturación por producto
- **Producto estrella**: Producto con mayor facturación en los últimos 7 días
- **Reembolsos**: Monto total y cantidad de reembolsos

### Listas Navegables

- **Carritos abandonados**: Lista detallada con información completa
- **Pedidos**: Lista con estado de pago/pendiente y detalles
- **Reembolsos**: Lista con información detallada
- **Productos**: Lista con unidades vendidas y facturación

### Acciones Disponibles

- Ver detalle completo dentro de la aplicación
- Botón "Abrir en Shopify" para acceder directamente a cada elemento en Shopify

## 🏗️ Arquitectura

### Stack Tecnológico

- **Base de datos**: Supabase (centro de almacenamiento de datos)
- **Fuente de verdad**: Shopify (API y webhooks)
- **Sincronización**:
  - Webhooks de Shopify para capturar eventos en tiempo real
  - Sincronización programada cada 5 minutos vía Shopify API para reconciliar y completar datos
  - Botón manual "Actualizar ahora" para disparar sincronización inmediata

### Flujo de Datos

1. Shopify genera eventos que se capturan mediante webhooks
2. Los datos se almacenan en Supabase
3. Cada 5 minutos se ejecuta una sincronización programada para asegurar la integridad de los datos
4. El usuario puede forzar una actualización manual en cualquier momento

## 🚀 Próximas Características (v2.0)

Las siguientes funcionalidades están planificadas para futuras versiones:

- Integración con Meta Ads
- Métricas de email marketing (open rate, clicks, etc.)
- Métricas de agente IA (mensajes, conversiones, etc.)
- Soporte multi-tienda por cuenta
- Roles adicionales (ej. Viewer sin permisos de administrador)

## 🎨 Branding

- **Nombre**: OneView (pendiente de confirmación final)
- **Tono visual**: Estilo Apple (minimalista, redondeado, cuidado en sombras, brillos y detalles)
- **Paleta de colores**: Blanco / Negro / Grises + acento verde oscuro

## 📝 Notas

- Esta es la versión MVP (v1.0) del producto
- Actualmente solo soporta integración con Shopify
- El diseño sigue principios de minimalismo y usabilidad inspirados en Apple

---

**Versión**: 1.0 (MVP)

