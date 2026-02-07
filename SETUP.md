# Guía de Setup - OneView

Esta guía te ayudará a configurar el proyecto OneView en tu entorno local.

## 📋 Prerrequisitos

- Node.js >= 18.0.0
- npm o yarn
- Cuenta de Supabase
- Cuenta de Shopify Partners (para crear la app)

## 🚀 Pasos de Instalación

### 1. Instalar Dependencias

```bash
npm install
```

o

```bash
yarn install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Shopify
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_SCOPES=read_orders,read_products,read_checkouts,read_customers
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sync Configuration
SYNC_INTERVAL_MINUTES=5
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Obtén la URL y las keys desde el dashboard
3. Agrega las credenciales al archivo `.env.local`

### 4. Configurar Shopify App

1. Ve a [Shopify Partners](https://partners.shopify.com)
2. Crea una nueva app
3. Configura los scopes necesarios:
   - `read_orders`
   - `read_products`
   - `read_checkouts`
   - `read_customers`
4. Configura la URL de redirección: `http://localhost:3000/api/auth/callback`
5. Configura los webhooks en el dashboard de Shopify apuntando a:
   - `http://localhost:3000/api/webhooks/shopify`
6. Agrega las credenciales al archivo `.env.local`

### 5. Ejecutar el Proyecto

```bash
npm run dev
```

o

```bash
yarn dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
oneview/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── sync/         # Endpoint de sincronización
│   │   └── webhooks/     # Webhooks de Shopify
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── lib/                   # Utilidades y clientes
│   ├── shopify/          # Cliente de Shopify
│   ├── supabase/         # Cliente de Supabase
│   └── utils.ts          # Utilidades generales
├── types/                 # Definiciones de TypeScript
└── components/            # Componentes React (a crear)
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run type-check` - Verifica los tipos de TypeScript

## 📝 Próximos Pasos

1. Crear el esquema de base de datos en Supabase
2. Implementar la lógica de sincronización con Shopify
3. Desarrollar los componentes del dashboard
4. Implementar los cálculos de KPIs
5. Crear las listas navegables

## 🔧 Troubleshooting

### Error: Missing Supabase environment variables
- Verifica que el archivo `.env.local` existe y contiene todas las variables necesarias
- Asegúrate de que las variables comienzan con `NEXT_PUBLIC_` si se usan en el cliente

### Error: Missing Shopify API credentials
- Verifica que has creado la app en Shopify Partners
- Confirma que las credenciales están correctas en `.env.local`

### Error al ejecutar `npm run dev`
- Asegúrate de tener Node.js >= 18.0.0
- Elimina `node_modules` y ejecuta `npm install` nuevamente

