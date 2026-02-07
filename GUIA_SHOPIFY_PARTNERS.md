# Guía Completa: Registro en Shopify Partners para OneView

Esta guía te llevará paso a paso por el proceso de registro y configuración de tu app en Shopify Partners.

## 💰 ¿Cuánto cuesta? ¿Necesito acceso especial?

**¡Es completamente GRATIS!** 🎉

- ✅ **Registro en Shopify Partners**: Gratis
- ✅ **Crear apps de desarrollo**: Gratis
- ✅ **Desarrollar apps privadas/personalizadas**: Gratis
- ⚠️ **Publicar en Shopify App Store**: $19 USD (solo si quieres vender tu app públicamente)

**Importante**: 
- No necesitas acceso especial ni invitación
- Puedes tener una cuenta de **cliente/merchant** (tu tienda) Y una cuenta de **Partner** (para desarrollar) al mismo tiempo
- El monto de facturación de tu cliente (5M UYU, 1M USD, etc.) **NO influye** en nada para Partners
- Son dos cosas completamente diferentes:
  - **Cuenta de Cliente/Merchant**: Para vender productos en tu tienda
  - **Cuenta de Partner**: Para desarrollar apps, temas o referir clientes

**Para OneView**: Como es una app privada/personalizada, no necesitas pagar nada. Solo el registro gratuito.

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener:
- Una cuenta de email válida
- Acceso a internet
- Un nombre para tu app (ej: "OneView" o "OneView Analytics")

---

## 🚀 Paso 1: Crear Cuenta en Shopify Partners

1. **Ve a Shopify Partners**
   - Abre tu navegador y visita: https://partners.shopify.com
   - Haz clic en **"Sign up"** o **"Iniciar sesión"** si ya tienes cuenta

2. **Registro de cuenta**
   - Si no tienes cuenta, completa el formulario de registro:
     - Email
     - Contraseña
     - Nombre completo
     - Nombre de la empresa (puede ser tu nombre personal)
   - Acepta los términos y condiciones
   - Verifica tu email si es necesario

3. **Accede al Dashboard**
   - Una vez dentro, verás el dashboard de Shopify Partners
   - En el menú lateral, busca la sección **"Apps"**

---

## 🎯 Paso 2: Crear una Nueva App

1. **Navegar a Apps**
   - En el dashboard, haz clic en **"Apps"** en el menú lateral
   - O ve directamente a: https://partners.shopify.com/apps

2. **Crear nueva app**
   - Haz clic en el botón **"Create app"** o **"Crear app"**
   - Selecciona **"Create app manually"** (no uses el CLI por ahora)

3. **Información básica de la app**
   - **App name**: `OneView` (o el nombre que prefieras)
   - **App URL**: Por ahora puedes dejar un placeholder como `https://oneview.app` (lo actualizarás después)
   - Haz clic en **"Create app"**

---

## ⚙️ Paso 3: Configurar OAuth y Credenciales

Una vez creada la app, verás varias pestañas. Necesitas configurar:

### 3.1 Obtener Credenciales API

1. **Ve a la pestaña "API credentials"**
   - En la página de tu app, busca la pestaña **"API credentials"** o **"Credenciales API"**
   - Aquí verás:
     - **Client ID** (esta es tu `SHOPIFY_API_KEY`)
     - **Client secret** (esta es tu `SHOPIFY_API_SECRET`)

2. **⚠️ IMPORTANTE: Guarda estas credenciales**
   - Copia el **Client ID** y el **Client secret**
   - Guárdalos en un lugar seguro (las necesitarás para el `.env.local`)
   - El Client secret solo se muestra una vez, así que asegúrate de copiarlo

### 3.2 Configurar Scopes (Permisos)

1. **Ve a la pestaña "Configuration"** o **"Configuración"**
   - Busca la sección **"Scopes"** o **"Permisos"**
   - Haz clic en **"Configure"** o **"Configurar"**

2. **Seleccionar scopes necesarios**
   - Marca los siguientes scopes (solo lectura):
     - ✅ `read_orders` - Para leer pedidos
     - ✅ `read_products` - Para leer productos
     - ✅ `read_checkouts` - Para leer carritos abandonados
     - ✅ `read_customers` - Para leer información de clientes
   
   **Nota**: No necesitas permisos de escritura para el MVP, solo lectura.

3. **Guardar cambios**
   - Haz clic en **"Save"** o **"Guardar"**

### 3.3 Configurar URLs de Redirección OAuth

1. **En la misma pestaña "Configuration"**
   - Busca la sección **"Allowed redirection URL(s)"** o **"URLs de redirección permitidas"**

2. **Agregar URL de desarrollo local**
   - Para desarrollo local, agrega:
     ```
     http://localhost:3000/api/auth/callback
     ```
   - Haz clic en **"Add URL"** o **"Agregar URL"**

3. **Agregar URL de producción (opcional por ahora)**
   - Si ya tienes un dominio de producción, agrega:
     ```
     https://tu-dominio.com/api/auth/callback
     ```
   - Puedes agregar múltiples URLs (una por línea)

4. **Guardar cambios**
   - Haz clic en **"Save"** o **"Guardar"**

---

## 🔔 Paso 4: Configurar Webhooks

Los webhooks permiten que Shopify notifique a tu app cuando ocurren eventos importantes.

### 4.1 Acceder a la configuración de Webhooks

1. **Ve a la pestaña "Webhooks"**
   - En la página de tu app, busca la pestaña **"Webhooks"**

2. **Crear webhooks necesarios**
   - Haz clic en **"Create webhook"** o **"Crear webhook"**
   - Necesitas crear los siguientes webhooks:

#### Webhook 1: Orders Created
- **Event**: `Orders - Create`
- **Format**: `JSON`
- **URL**: `http://localhost:3000/api/webhooks/shopify`
- **API version**: Deja la versión más reciente

#### Webhook 2: Orders Updated
- **Event**: `Orders - Update`
- **Format**: `JSON`
- **URL**: `http://localhost:3000/api/webhooks/shopify`

#### Webhook 3: Checkouts Create
- **Event**: `Checkouts - Create`
- **Format**: `JSON`
- **URL**: `http://localhost:3000/api/webhooks/shopify`

#### Webhook 4: Refunds Create
- **Event**: `Refunds - Create`
- **Format**: `JSON`
- **URL**: `http://localhost:3000/api/webhooks/shopify`

**Nota**: Para producción, reemplaza `localhost:3000` con tu dominio real.

### 4.2 Obtener Webhook Secret

1. **Después de crear cada webhook**
   - Shopify generará un **Webhook signing secret**
   - Este secret se usa para verificar que los webhooks vienen realmente de Shopify
   - **⚠️ IMPORTANTE**: Copia este secret (lo necesitarás para `SHOPIFY_WEBHOOK_SECRET`)

2. **Alternativa: Secret compartido**
   - Si todos los webhooks usan el mismo endpoint, Shopify puede usar un secret compartido
   - Revisa en la configuración de la app si hay un "Webhook signing secret" global

---

## 📝 Paso 5: Configurar Variables de Entorno

Ahora que tienes todas las credenciales, actualiza tu archivo `.env.local`:

1. **Abre o crea el archivo `.env.local`** en la raíz del proyecto

2. **Agrega las credenciales de Shopify**:

```env
# Shopify
SHOPIFY_API_KEY=tu_client_id_aqui
SHOPIFY_API_SECRET=tu_client_secret_aqui
SHOPIFY_SCOPES=read_orders,read_products,read_checkouts,read_customers
SHOPIFY_WEBHOOK_SECRET=tu_webhook_secret_aqui

# App URL (para desarrollo local)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANTE**: 
- Reemplaza `tu_client_id_aqui`, `tu_client_secret_aqui`, y `tu_webhook_secret_aqui` con los valores reales
- Nunca subas el archivo `.env.local` a Git (debe estar en `.gitignore`)

---

## 🧪 Paso 6: Verificar la Configuración

### 6.1 Verificar que el proyecto puede iniciar

1. **Instala dependencias** (si no lo has hecho):
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Verifica que no hay errores**
   - El servidor debería iniciar sin errores relacionados con Shopify
   - Si ves errores sobre credenciales faltantes, verifica tu `.env.local`

### 6.2 Probar la instalación de la app (cuando esté lista)

Una vez que implementes el flujo OAuth, podrás:
1. Instalar la app en una tienda de desarrollo
2. Verificar que los webhooks se reciben correctamente
3. Probar la sincronización de datos

---

## 📋 Checklist de Configuración

Usa este checklist para asegurarte de que todo está configurado:

- [ ] Cuenta de Shopify Partners creada
- [ ] App creada en Shopify Partners
- [ ] Client ID (API Key) copiado
- [ ] Client Secret copiado
- [ ] Scopes configurados:
  - [ ] `read_orders`
  - [ ] `read_products`
  - [ ] `read_checkouts`
  - [ ] `read_customers`
- [ ] URL de redirección OAuth configurada: `http://localhost:3000/api/auth/callback`
- [ ] Webhooks creados:
  - [ ] Orders - Create
  - [ ] Orders - Update
  - [ ] Checkouts - Create
  - [ ] Refunds - Create
- [ ] Webhook Secret copiado
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Proyecto inicia sin errores

---

## 🔗 URLs Importantes

- **Shopify Partners Dashboard**: https://partners.shopify.com
- **Documentación de Shopify API**: https://shopify.dev/docs/api
- **Documentación de Webhooks**: https://shopify.dev/docs/api/admin-graphql/latest/resources/webhook
- **Documentación de OAuth**: https://shopify.dev/docs/apps/auth/oauth

---

## ⚠️ Notas Importantes

1. **Desarrollo vs Producción**
   - Para desarrollo local, usa `localhost:3000`
   - Para producción, necesitarás:
     - Un dominio con HTTPS (Shopify requiere HTTPS para producción)
     - Actualizar todas las URLs en la configuración de la app
     - Usar un servicio como ngrok para desarrollo local con webhooks (opcional)

2. **Tienda de Desarrollo**
   - Puedes crear una tienda de desarrollo gratuita en Shopify para probar
   - Ve a: https://partners.shopify.com/organizations
   - Crea una "Development store"

3. **Límites de Rate**
   - Shopify tiene límites de rate limiting en su API
   - Para el MVP, esto no debería ser un problema
   - Revisa la documentación si necesitas hacer muchas llamadas

4. **Seguridad**
   - Nunca compartas tus credenciales
   - No subas `.env.local` a repositorios públicos
   - Rota las credenciales si sospechas que fueron comprometidas

---

## 🆘 Troubleshooting

### Error: "Invalid API credentials"
- Verifica que copiaste correctamente el Client ID y Client Secret
- Asegúrate de que no hay espacios extra al copiar/pegar

### Error: "Redirect URI mismatch"
- Verifica que la URL en `.env.local` coincide exactamente con la configurada en Shopify Partners
- Asegúrate de que la URL de redirección incluye el protocolo (`http://` o `https://`)

### Los webhooks no llegan
- Verifica que el endpoint `/api/webhooks/shopify` está funcionando
- Para desarrollo local, considera usar ngrok para exponer tu servidor local
- Verifica que el Webhook Secret está correcto en `.env.local`

### No puedo instalar la app en mi tienda
- Asegúrate de que la app está en modo "Development" (no requiere revisión)
- Verifica que los scopes están correctamente configurados
- Revisa que la URL de redirección está configurada

---

## 📞 Próximos Pasos

Una vez completado el registro en Shopify Partners:

1. ✅ **Implementar el flujo OAuth** (ruta `/api/auth/callback`)
2. ✅ **Implementar la verificación de webhooks** (HMAC)
3. ✅ **Probar la instalación de la app en una tienda de desarrollo**
4. ✅ **Continuar con el diseño del esquema de base de datos**

---

**Última actualización**: [Fecha]
**Versión**: 1.0

